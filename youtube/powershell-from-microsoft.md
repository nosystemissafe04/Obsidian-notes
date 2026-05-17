### what is powershell




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

#### GET-HELP

- it initially performs a wildcard search for command names based on your input.

```POWERSHELL
GET-HELP
```

```POWERSHELL
Get-Help -Name Get-Help
```

- Beginning with PowerShell version 3.0, the help content doesn't ship preinstalled with the operating system. When you run `Get-Help` for the first time, a message asks if you want to download the PowerShell help files to your computer.

*UNINSTALL HELP COMMAND THEN ON VIDEO TO TELL THAT IF IT IS NOT INSTALLED THIS COMMAND WILL RUN UPDATE-HELP AND WILL DOWNLOAD THE HELP CONTENT*

##### TROUBLESHOOT

- If you don't receive this message, run `Update-Help` from an elevated PowerShell session running as an administrator.

### PARAMETERS

-  Parameters allow you to specify options and arguments that change the behavior of a command.
-  The **SYNTAX** section of each help article outlines the available parameters for the command.
- `Get-Help` has several parameters that you can specify to return the entire help article or a subset for a command.

```powershell
SYNTAX Get-Help [[-Name] <System.String>] [-Category {Alias | Cmdlet | Provider | General | FAQ | Glossary | HelpFile | ScriptCommand | Function | Filter | ExternalScript | All | DefaultHelp | Workflow | DscResource | Class | Configuration}] [-Component <System.String[]>] [-Full] [-Functionality <System.String[]>] [-Path <System.String>] [-Role <System.String[]>] [<CommonParameters>] Get-Help [[-Name] <System.String>] [-Category {Alias | Cmdlet | Provider | General | FAQ | Glossary | HelpFile | ScriptCommand | Function | Filter | ExternalScript | All | DefaultHelp | Workflow | DscResource | Class | Configuration}] [-Component <System.String[]>] -Detailed [-Functionality <System.String[]>] [-Path <System.String>] [-Role <System.String[]>] [<CommonParameters>] Get-Help [[-Name] <System.String>] [-Category {Alias | Cmdlet | Provider | General | FAQ | Glossary | HelpFile | ScriptCommand | Function | Filter | ExternalScript | All | DefaultHelp | Workflow | DscResource | Class | Configuration}] [-Component <System.String[]>] -Examples [-Functionality <System.String[]>] [-Path <System.String>] [-Role <System.String[]>] [<CommonParameters>] Get-Help [[-Name] <System.String>] [-Category {Alias | Cmdlet | Provider | General | FAQ | Glossary | HelpFile | ScriptCommand | Function | Filter | ExternalScript | All | DefaultHelp | Workflow | DscResource | Class | Configuration}] [-Component <System.String[]>] [-Functionality <System.String[]>] -Online [-Path <System.String>] [-Role <System.String[]>] [<CommonParameters>] Get-Help [[-Name] <System.String>] [-Category {Alias | Cmdlet | Provider | General | FAQ | Glossary | HelpFile | ScriptCommand | Function | Filter | ExternalScript | All | DefaultHelp | Workflow | DscResource | Class | Configuration}] [-Component <System.String[]>] [-Functionality <System.String[]>] -Parameter <System.String> [-Path <System.String>] [-Role <System.String[]>] [<CommonParameters>] Get-Help [[-Name] <System.String>] [-Category {Alias | Cmdlet | Provider | General | FAQ | Glossary | HelpFile | ScriptCommand | Function | Filter | ExternalScript | All | DefaultHelp | Workflow | DscResource | Class | Configuration}] [-Component <System.String[]>] [-Functionality <System.String[]>] [-Path <System.String>] [-Role <System.String[]>] -ShowWindow [<CommonParameters>] ...
```

- the information appears to be repeated six times.
- Each of those blocks is an individual parameter set, indicating the `Get-Help` cmdlet features six distinct sets of parameters
-  A closer look reveals each parameter set contains at least one unique parameter, making it different from the others

- Parameter sets are mutually exclusive.
- Once you specify a unique parameter that only exists in one parameter set, PowerShell limits you to using the parameters contained within that parameter set
- For instance, you can't use the **Full** and **Detailed** parameters of `Get-Help` together because they belong to different parameter sets.

Each of the following parameters belongs to a different parameter set for the `Get-Help` cmdlet.

- Full
- Detailed
- Examples
- Online
- Parameter
- ShowWindow

[](https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/02-help-system?view=powershell-7.6&source=recommendations#the-command-syntax)




