 there are several ways we can move laterally. Typically, if we take over an account with local admin rights over a host, or set of hosts, we can perform a `Pass-the-Hash` attack to authenticate via the SMB protocol

*But what if we don't yet have local admin rights on any hosts in the domain?*

There are several other ways we can move around a Windows domain:

- `Remote Desktop Protocol` (`RDP`) - is a remote access/management protocol that gives us GUI access to a target host
- [PowerShell Remoting](https://docs.microsoft.com/en-us/powershell/scripting/learn/ps101/08-powershell-remoting?view=powershell-7.2) - also referred to as PSRemoting or Windows Remote Management (WinRM) access, is a remote access protocol that allows us to run commands or enter an interactive command-line session on a remote host using PowerShell
- `MSSQL Server` - an account with sysadmin privileges on an SQL Server instance can log into the instance remotely and execute queries against the database. This access can be used to run operating system commands in the context of the SQL Server service account through various methods

We can enumerate this access in various ways. The easiest, once again, is via BloodHound, as the following edges exist to show us what types of remote access privileges a given user has:

- [CanRDP](https://bloodhound.specterops.io/resources/edges/can-rdp)
- [CanPSRemote](https://bloodhound.specterops.io/resources/edges/can-ps-remote)
- [SQLAdmin](https://bloodhound.specterops.io/resources/edges/sql-admin)

## Remote Desktop
  if we have control of a local admin user on a given machine, we will be able to access it via RDP

 Sometimes, we will obtain a foothold with a user that does not have local admin rights anywhere, but does have the rights to RDP into one or more machines.

Using PowerView, we could use the [Get-NetLocalGroupMember](https://powersploit.readthedocs.io/en/latest/Recon/Get-NetLocalGroupMember/) function to begin enumerating members of the `Remote Desktop Users` group on a given host.

#### Enumerating the Remote Desktop Users Group

```POWERSHELL
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-MS01 -GroupName "Remote Desktop Users"

ComputerName : ACADEMY-EA-MS01 
GroupName : Remote Desktop Users 
MemberName : INLANEFREIGHT\Domain Users 
SID : S-1-5-21-3842939050-3880317879-2865463114-513 
IsGroup : True 
IsDomain : UNKNOWN
```

**WE ARE USING GET-NETLOCALGROUPMEMBER NOT GET-DOMAINGROUPMEMBER THEY BOTH ARE DIFFERENT WE ARE LOCALLY FINDING FOR USERS IN THAT GROUP . THE USERS OF THIS GROUP CAN RDP TO MACHINES IN THE NETWORK WE ARE TARGETING THOSE USERS**

From the information above, we can see that all Domain Users (meaning `all` users in the domain) can RDP to this host. It is common to see this on Remote Desktop Services (RDS) hosts or hosts used as jump hosts. This type of server could be heavily used, and we could potentially find sensitive data (such as credentials) that could be used to further our access

we may find a local privilege escalation vector that could lead to local admin access and credential theft/account takeover for a user with more privileges in the domain. Typically the first thing I check after importing BloodHound data is:

#### Checking the Domain Users Group's Local Admin & Execution Rights using BloodHound

![Graph showing DOMAIN USERS@INLANEFREIGHT.LOCAL with local admin and execution rights, connected to ACADEMY-EA-MS01.INLANEFREIGHT.LOCAL via CanRDP.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/bh_RDP_domain_users.png)

If we gain control over a user through an attack such as LLMNR/NBT-NS Response Spoofing or Kerberoasting, we can search for the username in BloodHound to check what type of remote access rights they have either directly or inherited via group membership under `Execution Rights` on the `Node Info` tab.

#### Checking Remote Access Rights using BloodHound

![Node info for WLEY@INLANEFREIGHT.LOCAL showing execution rights, including Group Delegated RDP Privileges set to 1.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/execution_rights.png)

We could also check the `Analysis` tab and run the pre-built queries `Find Workstations where Domain Users can RDP` or `Find Servers where Domain Users can RDP`. There are other ways to enumerate this information, but BloodHound is a powerful tool that can help us narrow down these types of access rights quickly and accurately, which is hugely beneficial to us as penetration testers under time constraints for the assessment period.

To test this access, we can either use a tool such as `xfreerdp` or `Remmina` from our VM or the Pwnbox or *`mstsc.exe` if attacking from a Windows host.*

## WinRM

Like RDP, we may find that either a specific user or an entire group has WinRM access to one or more hosts. This could also be low-privileged access that we could use to hunt for sensitive data or attempt to escalate privileges or may result in local admin access, which could potentially be leveraged to further our access. We can again use the PowerView function `Get-NetLocalGroupMember` to the `Remote Management Users` group. This group has existed since the days of Windows 8/Windows Server 2012 to enable WinRM access without granting local admin rights.

#### Enumerating the Remote Management Users Group

```powershell
Get-NetLocalGroupMember -ComputerName ACADEMY-EA-MS01 -GroupName "Remote Management Users"
```

We can also utilize this custom `Cypher query` in BloodHound to hunt for users with this type of access. This can be done by pasting the query into the `Raw Query` box at the bottom of the screen and hitting enter.

```bloodhound
MATCH p1=shortestPath((u1:User)-[r1:MemberOf*1..]->(g1:Group)) MATCH p2=(u1)-[:CanPSRemote*1..]->(c:Computer) RETURN p2
```

#### Using the Cypher Query in BloodHound

![BloodHound graph showing connection from FOREND@INLANEFREIGHT.LOCAL to ACADEMY-EA-MS01.INLANEFREIGHT.LOCAL via CanPSRemote.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/canpsremote_bh_cypherq.png)

We could also add this as a custom query to our BloodHound installation, so it's always available to us.

#### Adding the Cypher Query as a Custom Query in BloodHound

![Interface for creating a custom query to find WinRM users with dangerous rights.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/user_defined_query.png)

#### Establishing WinRM Session from Windows

```powershell
$password = ConvertTo-SecureString "Klmcargo2" -AsPlainText -Force

$cred = new-object System.Management.Automation.PSCredential ("INLANEFREIGHT\forend", $password)

Enter-PSSession -ComputerName ACADEMY-EA-MS01 -Credential $cred

```

#### Connecting to a Target with Evil-WinRM and Valid Credentials

```shell
evil-winrm -i 10.129.201.234 -u forend
```


## SQL Server Admin

More often than not, we will encounter SQL servers in the environments we face. It is common to find user and service accounts set up with sysadmin privileges on a given SQL server instance.

- We may obtain credentials for an account with this access via Kerberoasting
- LLMNR/NBT-NS Response Spoofing or password spraying.
- Another way that you may find SQL server credentials is using the tool [Snaffler](https://github.com/SnaffCon/Snaffler) to find web.config or other types of configuration files that contain SQL server connection strings.

#### Using a Custom Cypher Query to Check for SQL Admin Rights in BloodHound

BloodHound, once again, is a great bet for finding this type of access via the `SQLAdmin` edge. We can check for `SQL Admin Rights` in the `Node Info` tab for a given user or use this custom Cypher query to search:

```bloodhound
MATCH p1=shortestPath((u1:User)-[r1:MemberOf*1..]->(g1:Group)) MATCH p2=(u1)-[:SQLAdmin*1..]->(c:Computer) RETURN p2
```


![Graph showing SQLAdmin connection from ACADEMY-EA-DB01.INLANEFREIGHT.LOCAL to DAMUNDSEN@INLANEFREIGHT.LOCAL.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/sqladmins_bh.png)

We can use our ACL rights to authenticate with the `wley` user, change the password for the `damundsen` user and then authenticate with the target using a tool such as `PowerUpSQL`, which has a handy [command cheat sheet](https://github.com/NetSPI/PowerUpSQL/wiki/PowerUpSQL-Cheat-Sheet).

#### umerating MSSQL Instances with PowerUpSQL

```powershell
cd .\PowerUpSQL\

Import-Module .\PowerUpSQL.ps1

Get-SQLInstanceDomain

ComputerName : ACADEMY-EA-DB01.INLANEFREIGHT.LOCAL 
Instance : ACADEMY-EA-DB01.INLANEFREIGHT.LOCAL,1433 
DomainAccountSid : 1500000521000170152142291832437223174127203170152400 
DomainAccount : damundsen 
DomainAccountCn : Dana Amundsen 
Service : MSSQLSvc 
Spn : MSSQLSvc/ACADEMY-EA-DB01.INLANEFREIGHT.LOCAL:1433 
LastLogon : 4/6/2022 11:59 AM
```

*We could then authenticate against the remote SQL server host and run custom queries or operating system commands*

```powershell
Get-SQLQuery -Verbose -Instance "172.16.5.150,1433" -username "inlanefreight\damundsen" -password "SQL1234!" -query 'Select @@version'
```

**We can also authenticate from our Linux attack host using [mssqlclient.py](https://github.com/SecureAuthCorp/impacket/blob/master/examples/mssqlclient.py) from the Impacket toolkit.**

#### Running mssqlclient.py Against the Target

```powershell
mssqlclient.py INLANEFREIGHT/DAMUNDSEN@172.16.5.150 -windows-auth
```

Once connected, we could type `help` to see what commands are available to us.

#### Viewing our Options with Access to the SQL Server

```shell

SQL> help

     lcd {path}                 - changes the current local directory to {path}
     exit                       - terminates the server process (and this session)
     enable_xp_cmdshell         - you know what it means
     disable_xp_cmdshell        - you know what it means
     xp_cmdshell {cmd}          - executes cmd using xp_cmdshell
     sp_start_job {cmd}         - executes cmd using the sql server agent (blind)
     ! {cmd}                    - executes a local shell cmd
```


We could then choose `enable_xp_cmdshell` to enable the [xp_cmdshell stored procedure](https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql?view=sql-server-ver15) which allows for one to execute operating system commands via the database if the account in question has the proper access rights.

#### Choosing enable_xp_cmdshell

```shell
SQL> enable_xp_cmdshell
```

