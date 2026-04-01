powershell loads modules in just in time manner if you ask something it will load a module which is defined in that module . whenever you run `get-module` psreadline will always be present in the list because of putting those commands in the history file it have to be preloaded in every ps session 

### modules path 
powershell have some path where it will look for when loading a module and when you download a module it will be stored in any of those paths . there is a environment variable which have these modules path stored in 
```
$env:psmodulepath -split ';'
```
it will list all the modules path and split ; as delimiter

to get all the modules which are in those different paths available to us 
```
get-module -listavailable
```

### commands and functions available in a specific module 
```
get-command -module psreadline
```
print all the function and commands exported by this module 

### [powershell galary](https://powershellgalary.com) 
modules and script which are developed by people are shared or uploaded on this website 
you will find scripts and modules 
**script** : -
- a script is a collection of powershell commands 
- when we execute a script the function and variables declared and used in that script will not be available after the script execution . scripts run in different scope and on sessions we cannot access it outside the script scope 
**module** : - 
-  a module contains multiple scripts and some information about versions
- whereas in module we can use the functions and variables anywhere its globally defined we can execute it on any path in a powershell session . we can import scripts as modules and use the functions and variables in that script that way . 
-  to import a module or a script = `import-module`
- ![[Pasted image 20240714152656.png]]
- so powershell modules and script have different scopes 
### installing a script 
to install a script 
```
install-script <script-name>
```
you will encounter a lot of script on powershellgalary . 
afterwards it will be visible as a command and running that will execute that script 
to search of a command 
```
get-command install-*
```

### Naming conflict 
- `Import-Module` might add commands that hide and replace commands in the current session. Name conflicts can result in commands being hidden or replaced. Command replacement occurs when the imported module contains a command with the same name as an existing command in the session. The newly imported command replaces takes precedence over the existing command.

- For example, when a session includes a function and a cmdlet with the same name, PowerShell runs the function by default. When the session includes commands of the same type with the same name, such as two cmdlets with the same name, by default, it runs the most recently added command.

- You can run a command that has been hidden or replaced by qualifying the command name. To qualify the command name, add the name of module than contains the version of the command you want. For example:
```
Microsoft.PowerShell.Utility\Get-Date
```
- Running `Get-Date` with the module name prefix ensures that are running the version from the **Microsoft.PowerShell.Utility** module.

- To detect name conflicts, use the **All** parameter of the `Get-Command` cmdlet. By default, `Get-Command` gets only that commands that run when you type the command name. The **All** parameter gets all commands with the specific name in the session.

### Preventing naming conflict 
- To prevent name conflicts, use the **NoClobber** or **Prefix** parameters of the `Import-Module` cmdlet. The **Prefix** parameter adds a prefix to the names of imported commands so that they're unique in the session. The **NoClobber** parameter doesn't import any commands that would hide or replace existing commands in the session.

- You can also use the **Alias**, **Cmdlet**, **Function**, and **Variable** parameters of `Import-Module` to select only the commands that you want to import, and you can exclude commands that cause name conflicts in your session.

[take a look at module on microsoft website](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_modules?view=powershell-7.4#see-also)
### Importance of Matching Folder and Module Names

For autoloading to work correctly, the module's folder name and the module's file name (excluding the extension) must match. This is because PowerShell uses the folder name to locate the module file. Here’s why it matters:

1. **Module Discovery**: When searching for modules, PowerShell looks for folders that match the module name. If the folder name does not match the module name, PowerShell cannot find the module file.
    
2. **Predictable Structure**: Having a consistent naming convention helps maintain a predictable and organized structure, making it easier to manage and locate modules, especially in environments with many modules.
    
3. **Autoload Mechanism**: For the autoload feature to function, PowerShell needs to find the module file in a directory that matches the module name. If the names do not match, PowerShell will not be able to autoload the module correctly.
    

### Extensions for PowerShell Modules

PowerShell modules can come in several forms, each with its own extension:

1. **Script Module (`.psm1`)**: These are PowerShell scripts that contain functions and cmdlets. They are the most common type of module.
    
    - Example: `MyModule.psm1`
2. **Binary Module (`.dll`)**: These are compiled .NET assemblies that contain cmdlets written in a .NET language such as C#.
    
    - Example: `MyModule.dll`
3. **Manifest File (`.psd1`)**: This file contains metadata about the module, such as its version, author, and dependencies. While not strictly necessary for a module to function, manifest files are essential for defining the module’s properties and dependencies.
    
    - Example: `MyModule.psd1`
4. **Module Package (`.nupkg`)**: These are NuGet packages used when distributing PowerShell modules via the PowerShell Gallery. They are ZIP archives containing the module files and metadata.
    
    - Example: `MyModule.nupkg`


### manifest file 
A module manifest is a PowerShell data file (`.psd1`) containing a hash table. The keys-value pairs in the hash table describe the contents and attributes of the module, define the prerequisites, and control how the components are processed.

Manifests aren't required to load a module but they're required to publish a module to the PowerShell Gallery. Manifests also enable you to separate your module's implementation from how it loads. With a manifest, you can define requirements, compatibility, loading order, functionstoexport , where the help would come from . when you import a manifest file it will load all the files needed defined in it and in which order 

When you use `New-ModuleManifest` without specifying any parameters for the manifest's settings it writes a minimal manifest file. The snippet below shows you this default output, snipped of commentary and spacing for brevity:

PowerShellCopy

```
@{
# RootModule = ''
ModuleVersion = '1.0'
# CompatiblePSEditions = @()
GUID = 'e7184b71-2527-469f-a50e-166b612dfb3b'
Author = 'username'
CompanyName = 'Unknown'
Copyright = '(c) 2022 username. All rights reserved.'
# Description = ''
# PowerShellVersion = ''
# PowerShellHostName = ''
# PowerShellHostVersion = ''
# DotNetFrameworkVersion = ''
# CLRVersion = ''
# ProcessorArchitecture = ''
# RequiredModules = @()
# RequiredAssemblies = @()
# ScriptsToProcess = @()
# TypesToProcess = @()
# FormatsToProcess = @()
# NestedModules = @()
FunctionsToExport = @()
CmdletsToExport = @()
VariablesToExport = '*'
AliasesToExport = @()
# DscResourcesToExport = @()
# ModuleList = @()
# FileList = @()
PrivateData = @{
    PSData = @{
        # Tags = @()
        # LicenseUri = ''
        # ProjectUri = ''
        # IconUri = ''
        # ReleaseNotes = ''
    } # End of PSData hashtable
} # End of PrivateData hashtable
# HelpInfoURI = ''
# DefaultCommandPrefix = ''
}
```
if you  import a script the variables are exported and are globally declared . but when we import a module variables in that module are not exported if you want to export variables you can do that with manifest file defining a key value pair to export variables that you want . 

### commands precedence
If you don't specify a path, PowerShell uses the following precedence order when it runs commands.

1. Alias
2. Function
3. Cmdlet (see [Cmdlet name resolution](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_precedence?view=powershell-7.4#cmdlet-name-resolution))
4. External executable files (including PowerShell script files)

if you create a function named get-command it will it will overlap the the actual cmdlet to this actual function and functions have higher percedence as cmdlet powershell will execute that function . to find all about those similar functions 
`get-command get-variable -all`
it will print all the get-variable 

if you want to run a cmdlet thats being overlapped by that naming conflict you can do that by specifying a actual path of that cmdlet . you can find source of that cmdlet in get-command output 
for example 
```
Microsoft.powershell.utility\get-variable 
```

to prevent naming conflict visit [[#Naming conflict]] and there prevention [[#Preventing naming conflict]]

### Clibri Loader Malware:Hijack execution flow 
- on 27 august 2021 , cybersec researchers discovered a malware loader dubbed colibri being sold on an underground russian forum . the actors claims that the loader is stealthy and can be used to target windows systems , to drop other malware onto the infected systems 
- it hijacked the get-variable cmdlet by placing the malicious binary in environment variable 
- when we start powershell session it looks for get-variable in paths and colibri does the same by putting malicious file in the path and scheduled a task to open powershell . to run the malware
- its an application so it is on the lowest precedence . but when i upgraded psreadline it is not working maybe psreadline is calling get-variable but updating it remove that calling 

### [Powershell commands Obfuscation](https://github.com/clr2of8/Invoke-Obfuscation) 
we will be using a tool for obfuscating powershell commands . 
	we can obfuscate string , token  



