- PowerShell doesn't participate in [User Access Control (UAC)](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/). That means it's unable to prompt for elevation for tasks that require the approval of an administrator.
 ![[Pasted image 20260517180530.png]]

![[Pasted image 20260517180543.png]]

### POWERSHELL VERSION
- There are automatic variables in PowerShell that store state information. One of these variables is `$PSVersionTable`, which contains version information about your PowerShell session.

```PowerShell
$PSVersionTable
```

*TALK ABOUT SOME THAT WINDOWS POWERSHELL AND POWERSHELL CORE ARE BOTH PREINSTALLED SIDE BY SIDE AND ARE DIFFERENT *

### POWERSHELL HELP SYSTEM

- Experts don't always know the answers, but they know how to figure out the answers.
- Becoming proficient with the Help system is the key to success with PowerShell.


- Compiled commands in PowerShell are known as cmdlets,

- The naming convention for cmdlets follows a singular **Verb-Noun** format to make them easily discoverable

- For instance, `Get-Process` is the cmdlet to determine what processes are running, and `Get-Service` is the cmdlet to retrieve a list of services

- _"PowerShell command"_ describes any command in PowerShell, regardless of whether it's a cmdlet, function, or alias

- You can also run operating system native commands from PowerShell, such as traditional command-line programs like `ping.exe` and `ipconfig.exe`.

## The three core cmdlets in PowerShell

- `Get-Help`
- `Get-Command`
- `Get-Member`

 Both `Get-Help` and `Get-Command` are invaluable resources for discovering and understanding commands in PowerShell.

`Get-Help` is a multipurpose command that helps you learn how to use commands once you find them.

