- PowerShell doesn't participate in [User Access Control (UAC)](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/). That means it's unable to prompt for elevation for tasks that require the approval of an administrator.
 ![[Pasted image 20260517180530.png]]

![[Pasted image 20260517180543.png]]

### POWERSHELL VERSION
- There are automatic variables in PowerShell that store state information. One of these variables is `$PSVersionTable`, which contains version information about your PowerShell session.

```PowerShell
$PSVersionTable
```

*TALK ABOUT SOME THAT WINDOWS POWERSHELL AND POWERSHELL CORE ARE BOTH PREINSTALLED SIDE BY SIDE AND ARE DIFFERENT *
