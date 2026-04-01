#windows-info 

The language mode of a PowerShell session determines which elements of the PowerShell language can be used in the session.

PowerShell supports the following language modes:

- `FullLanguage`
- `RestrictedLanguage`
- `ConstrainedLanguage` (introduced in PowerShell 3.0)
- `NoLanguage`
The language mode determines the language elements that are permitted in the session.

The language mode is a property of the session configuration (or "endpoint") that's used to create the session. All sessions that use a particular session configuration have the language mode of the session configuration.

All PowerShell sessions have a language mode. Sessions are created using the session configurations on the target computer. The language mode set in the session configuration determines the language mode of the session. To specify the session configuration of a PSSession, use the **ConfigurationName** parameter of cmdlets that create a session.

Beginning in PowerShell 7.3, you can run `pwsh` with the **ConfigurationFile** parameter. This allows you to start PowerShell using a specific configuration.

#### Finding the Language Mode 
```
$ExecutionContext.sessionstate.languagemode
```
we cannot use this method  of finding when the session is configured with `restrictedlanguage` and `nolanguage` mode . we cant use **member-access operator(.)** to get the property value in these language mode . instead , **the error message reveals the language modes .** 

When you run the `$ExecutionContext.SessionState.LanguageMode` command in a `RestrictedLanguage` session, PowerShell returns the **PropertyReferenceNotSupportedInDataSection** and **VariableReferenceNotSupportedInDataSection** error messages.

- **PropertyReferenceNotSupportedInDataSection**: Property references aren't allowed in restricted language mode or a Data section.
- **VariableReferenceNotSupportedInDataSection**: A variable that can't be referenced in restricted language mode or a Data section is being referenced.

When you run the `$ExecutionContext.SessionState.LanguageMode` command in a NoLanguage session, PowerShell returns the **ScriptsNotAllowed** error message.

- **ScriptsNotAllowed**: The syntax isn't supported by this runspace. This might be because it's in no-language mode.
#### Setting the Language Mode
```
$ExecutionContext.sessionstate.languagemode = "restrictedlanguage"
```
this will only set the language mode temporarily . when you restart the session it will roll back to default 

**there is also another way to set it with an environment variable**

you have to be an admin to set it 
```
[Environment]::SetEnvironmentVariable('__PSLockdownPolicy','4', 'Machine')
```
- microsoft says that its just a debug feature 
- since it requires admin priviledge somepeople think that it is a secure way of enabling it but it is not !!!
- but its different when we set it up there in by $executioncontext now if we start another session the language mode does not change 
-  it requires as admin to remove that environment variable so it gives a  sense of security but it is not secure way of doing it 

#### Bypassing Constrained Language mode 
#windows-bypass 


[just look at this blog how we can evade language mode when we set it up this way ](https://devblogs.microsoft.com/powershell/powershell-constrained-language-mode)
- we can effectivily bypass constrain language mode with naming convention if we used this environment variable to set constrain language mode . we just have system32 in name or file path to bypass it ^attacker

- read this blog to understand how it works 

- ### [constrain language mode bypass](https://www.blackhillsinfosec.com/constrained-language-mode-bypass-when-pslockdownpolicy-is-used)
![[Pasted image 20240725123900.png]]
we have system32 in the  name of the file and boom we are executing the script with fulllanguage mode 
![[Pasted image 20240725124403.png]]
now here we have system32 in file path 
and notice it doesn't matter if the system32's 's' is capital or not 
![[Pasted image 20240725124608.png]]
### FullLanguage mode

The `FullLanguage` mode permits all language elements in the session. `FullLanguage` is the default language mode for default sessions on all versions of Windows.

### RestrictedLanguage mode

In `RestrictedLanguage` mode, users can run commands (cmdlets, functions, CIM commands, and workflows), but can't use script blocks. This mode is also used to process modules manifests loaded by `Import-Module`.

Beginning in PowerShell 7.2, the `New-Object` cmdlet is disabled in `RestrictedLanguage` mode when system lockdown is configured.

By default, only the following variables are permitted in `RestrictedLanguage` mode:

- `$PSCulture`
- `$PSUICulture`
- `$True`
- `$False`
- `$Null`

Module manifests are loaded in `RestrictedLanguage` mode and may use these additional variables:

- `$PSScriptRoot`
- `$PSEdition`
- `$EnabledExperimentalFeatures`
- Any environment variables, like `$ENV:TEMP`

Only the following comparison operators are permitted:

- `-eq` (equal)
- `-gt` (greater-than)
- `-lt` (less-than)

Assignment statements, property references, and method calls aren't permitted.

### ConstrainedLanguage mode

`ConstrainedLanguage` mode is designed to allow basic language elements such as loops, conditionals, string expansion, and access to object properties. The restrictions prevent operations that could be abused by a malicious actor.

The `ConstrainedLanguage` mode permits all cmdlets and a subset of PowerShell language elements, but limits the object types that can be used.

The features of `ConstrainedLanguage` mode are as follows:

- All cmdlets in Windows modules are fully functional and have complete access to system resources, except as noted.
- All elements of the PowerShell scripting language are permitted.
- All modules included in Windows can be imported and all commands that the modules export run in the session.
- The `Add-Type` cmdlet can load signed assemblies, but it can't load arbitrary C# code or Win32 APIs.
- The `New-Object` cmdlet can be used only on allowed types (listed below).
- Only allowed types can be used in PowerShell. Other types aren't permitted. Type conversion is permitted, but only when the result is an allowed type.
- Cmdlet parameters that convert string input to types work only when the resulting type is an allowed type.
- The `ToString()` method and the .NET methods of allowed types can be invoked.
- Users can get all properties of allowed types. Users can set the values of properties only on allowed types.

### NoLanguage mode

PowerShell `NoLanguage` mode disables PowerShell scripting language completely. You can't run scripts or use variables. You can only run native commands and cmdlets.

Beginning in PowerShell 7.2, the `New-Object` cmdlet is disabled in `NoLanguage` mode when system lockdown is configured.

### How those  [[Popular Powershell Attack Tools]] will behave when constrain language mode is implemented on a session
only nishang [[Popular Powershell Attack Tools#Just a Recon script]]
recon script is able to run when constrain language mode is set 

we havent covered what is the right way to to set CLM 
![[Pasted image 20240725142440.png]]

#### How to revert back to fulllanguage mode 
```
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment\" -name __PSLockdownPolicy -Value 8
```
[taken from here ](https://notes.qazeer.io/windows/bypass_ps_constrainedlanguagemode#unprivileged-constrainedlanguage-mode-bypass-using-powershell-hosts)
