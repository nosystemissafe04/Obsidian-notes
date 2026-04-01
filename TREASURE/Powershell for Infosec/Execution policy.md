#windows-info 

execution policy is not a security feature but stops accedental running of powershell scripts 
if someone intentionally try to run the script its not gonna stop the execution of that script 
![[Pasted image 20240710164308.png]]
- Bypass = used to run the script witthout any restriction . microsoft developed this feature for application which uses ps helper scripts  script 
- restricted = its the most restrictive and comes by default in windows client  . blocks all script unless you specify the bypass mode 
- unrestricted = its the default policy for non-windows system. only give warning while running scripts
- remotesigned = it will not run web marked scripts which are not signed .those scripts  which are  not signed will not run in this policy . the script should contain the certificate issued by those organization which are trusted by your operating system
- allsigned = all the script in the system should be signed 
- default/undefined = undefined which are not have been set yet and default policy as you can see above 
### Execution policy Scopes
You can set an execution policy that is effective only in a particular scope.

The valid values for **Scope** are **MachinePolicy**, **UserPolicy**, **Process**, **CurrentUser**, and **LocalMachine**. **LocalMachine** is the default when setting an execution policy.

The **Scope** values are listed in precedence order. The policy that takes precedence is effective in the current session, even if a more restrictive policy was set at a lower level of precedence.
if we set more restrictive policy on MachinePolicy and less restrictive policy on CurrntUser as per the precedence no script will run and machinepolicy will be used for the whole system and vise versa 

For more information, see [Set-ExecutionPolicy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.4).

- MachinePolicy  >>>>> set via group policy 
    
    Set by a Group Policy for all users of the computer.
    
- UserPolicy >>>>>> set via group policy 
    
    Set by a Group Policy for the current user of the computer.
    
- Process 
    
    The **Process** scope only affects the current PowerShell session. The execution policy is saved in the environment variable `$env:PSExecutionPolicyPreference`, rather than the registry. When the PowerShell session is closed, the variable and value are deleted.
    
- CurrentUser
    
    The execution policy affects only the current user. It's stored in the **HKEY_CURRENT_USER** registry subkey.
    
- LocalMachine >>>>>> set via administrator
    
    The execution policy affects all users on the current computer. It's stored in the **HKEY_LOCAL_MACHINE** registry subkey.

setting the execution policy 
```
set-executionpolicy <policy> -scope <scope>
```
listing execution policy 
```
get-executionpolicy -list
```

#### Zone Identifier
 data downloaded from the internet is handled by a browser application running on Windows. Browsers create an Alternate Data Stream named `_“Zone.Identifier_,_”_` whenever such data is downloaded and a _“ZoneId”_ is added to this stream, representing the zone from which the file originated. Zone IDs are listed in the table below. For more information on URL security zones refer to [this article](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ms537183(v=vs.85)?redirectedfrom=MSDN).

|                  |            |
| ---------------- | ---------- |
| **Zone**         | **ZoneId** |
| Local machine    | 0          |
| Local intranet   | 1          |
| Trusted sites    | 2          |
| Internet         | 3          |
| Restricted sites | 4          |
**Alternate Data Stream** = "Alternate Data Stream" (ADS) is a feature of the Windows NTFS (New Technology File System) that allows additional data to be associated with a file without affecting its primary data stream. Essentially, it is a way to store metadata about a file, such as its origin or security zone information, without altering the main content of the file

finding the zone identifier . this will also provide the url where this file is downloaded 
```
get-content <path to file > -stream zone.identifier
```
get-content is like cat in linux 

to know all the stream of that file 
```
get-item <filename> -stream *
```
get-content's -stream parameter does not support wildcard so we have to use get -item here 


to find all the file in a directory having zone identifiers 
```
get-item * -stream zone.identifier -erroraction silentlycontinue 
```
as we discussed earlier we can unblock or remove this mark of the web or zone-identifier from a file using 
```
unblock-file <file>
```

when the script is signed if the content of that script is slightly be changed it will not run as the signature will not varify the content of that script ###

### [15 ways to bypass powershell execution policy ](https://www.netspi.com/blog/technical-blog/network-penetration-testing/15-ways-to-bypass-the-powershell-execution-policy/)
#windows-bypass 

The ways that are interesting 
- using invoke-expression or iex and download the script and executing it directly on memory 
- using invoke-command to run scripts remotely if winRM is enabled and remote powershell is enabled on that computer it requires admin rights to do that 
- using a function to swap authorizationmanager to null and running scripts 



