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
```

**WE ARE USING GET-NETLOCALGROUPMEMBER NOT GET-DOMAINGROUPMEMBER THEY BOTH ARE DIFFERENT WE ARE LOCALLY FINDING FOR USERS IN THAT GROUP AND **