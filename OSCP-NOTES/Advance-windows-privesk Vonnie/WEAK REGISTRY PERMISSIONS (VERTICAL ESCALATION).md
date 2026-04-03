 SHARPCOLLECTION 
- PRE-COMPILED C# OFFENSIVE TOOLS AND BINARY FOR DIFFERENT ARCHITECTURE HOSTS
-  **C# = the language you write in**
- **.NET Framework = the environment that runs your C# code**

WE NEEDED TO FIND THE EXACT VERSION OF .NETFRAMWORK THE TARGET HOST RUNS
![[Pasted image 20260402014431.png]]

`cd HKLM:\` [[Powershell Fundamentals#Powershell Providers]]

```powershell
cd HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\<VERSION>
```

![[Pasted image 20260402015109.png]]

| Setting       | Meaning                         |
| ------------- | ------------------------------- |
| Version       | “What version is my app?”       |
| TargetVersion | “What platform does it run on?” |

- DOWNLOADED WINPEAS FROM SHARCOLLECTION WITH THE APPROPRIATE VERSOIN OF .NETFRAMEWORK WHICH IS 4 IN OUR CASE AND TARGET IS RUNNING 64BIT 

### WINPEAS

- WINPEAS SHOWS POWERSHELL LOGGING INFO WHICH IS USE-FULL TO KNOW IF WE ARE LEAVING BEHIND ANY TRACES FOR POWERSHELL LOGGING SEE ([[Powershell logging and logging bypass]])

**POWERSHELL HISTORY (PSREADLINE)**
ANOTHER VECTOR FOR PRIVESC ,<mark class="hltr-mycolor"> PSREADLINE MODULE</mark> MAY CONTAIN SENSITIVE INFORMATION OR PASSWORDS see ([[Session History and History File]])

- ALSO SHOWS LAPS AND <mark class="hltr-myblue">AV IS PRESENT OR NOT </mark>

## MODIFIABLE REGISTRY

- *REGISTRY CONTAIN INFO ABOUT WHAT SERVICE WILL RUN WHICH BINARY ON THE FILE SYSTEM , IF WE CAN MODIFY THE REGISTRY , WE CAN POINT THAT SERVICE BINARY POINTER TO SOMETHING WHICH WE OWN , HERE WE DONT HAVE PERMISSION ON THE BINARY PATH OR ON THE BINARY WHICH WILL RUN WHEN THE SERVICE RUNS , SO WE CAN CHANGE THE PATH TO OUR OWN FORGED PATH AND BINARY SO THAT WHEN THAT SERVICE RUNS WHICH IS BY NT-AUTHORITY , IT WILL RUN OUR BINARY WHICH WE CAN USE TO PLACE A REVERSE SHELL* 
- <mark class="hltr-green-flag">REMEMBER THIS PATH</mark> `HKLM\SYSTEM\CurrentControlSet\Services`


> [!info]
> - The LocalSystem account is a predefined local account used by the service control manager.
> 
> - <mark class="hltr-green-flag">It has extensive privileges on the local computer</mark>, and acts as the computer on the network. Its token includes the NT AUTHORITY\SYSTEM and BUILTIN\Administrators SIDs; <mark class="hltr-green-flag">these accounts have access to most system objects</mark>. The name of the account in all locales is .\LocalSystem. The name, LocalSystem or _ComputerName_\LocalSystem can also be used. This account does not have a password. If you specify the LocalSystem account in a call to the [**CreateService**](https://learn.microsoft.com/en-us/windows/desktop/api/Winsvc/nf-winsvc-createservicea) or [**ChangeServiceConfig**](https://learn.microsoft.com/en-us/windows/desktop/api/Winsvc/nf-winsvc-changeserviceconfiga) function, any password information you provide is ignored.
> 
> - A service that runs in the context of the LocalSystem account inherits the security context of the SCM.

<span style="font-size: 29px;"><strong>CROSS CHECKING PERMISSIONS WITH ACCESSCHK (SYSINTERNALS)</strong></span>

```POWERSHELL
.\accesschk.exe -kwsu HKLM_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services
```
k = name is the registry key 
w = show only object with write access 
s = recurse 
u = suppress errors 
```POWERSHELL
.\accesschk.exe -kwsu HKLM_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services | findstr "HKLM"
```
- we are pin pointing and going deep into very selective services , so first we need to make sure we can write to those registry , we are able to write on some of them 

```powershell
Get-ItemProperty -Path HKLM_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\*
```
<mark class="hltr-myblue">this will show us all the properties of every object in the services path</mark> 

- **filter services which we can restart and runs as localsystem**
	- the **objectname** field contains which user or account this service runs as 
	- the **PSChildName** contains the service name 
	- the **start** field contains <mark class="hltr-myblue">start-type</mark> , so we need 3 which is manually started 
	![[Pasted image 20260402182047.png]]

```powershell
Get-ItemProperty -Path HKLM_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\* | where-object { ($_.objectname -eq 'LocalSystem') -and ($_.start -eq '3')}
```

*THERE IS A DIFFERENCE IN WRITING TO A SERVICE AND RESTARTING A SERVICE BOTH ARE DIFFERENT AND BOTH NEED DIFFERENT PERMISSIONS, WE FOUND WHICH SERVICES WE CAN WRITE ON , ON THOSE SERVICES WHICH ONE'S ARE RUNNING AS LOCALSYSTEM AND CAN BE MANUALLY RESTARTED , BUT IT DOES NOT GIVE US THE PERMISSIONS TO START WE JUST FOUND OUT SERVICES WHICH NEEDS MANUAL START TO START THEM <mark class="hltr-mycolor">BUT IT DOES NOT SHOW US IF WE CAN START THEM OR NOT</mark> , SO TO FIDN THAT WE WILL USE A TOOL CALLED <mark class="hltr-green-flag">SC SDSHOW</mark> 

> [!info]
> [found this blog which will be usefull in future ](https://decoder.cloud/2019/02/07/demystifying-windows-service-permissions-configuration/)

<span style="font-size: 29px;"><strong>SC SDSHOW</strong></span>
- Displays a service's [SECURITY DESCRIPTOR](https://learn.microsoft.com/en-us/windows/win32/secauthz/security-descriptors), using the Security Descriptor Definition Language (SDDL).
- **Windows “sc.exe”.**  This program has a lot of options and with “**sdset**” it is possible to modifiy the security setting of a service, but you have to specify it in the cryptic SDDL ([Security Description Definition Language](https://docs.microsoft.com/it-it/windows/desktop/SecAuthZ/security-descriptor-definition-language)). The opposite command “sdshow” will list the SDDL:
```CMD
cmd \c sc sdshow wuauserv
```

![[Pasted image 20260402225936.png]]
 
(Type;;Permissions;;;Principal)

**Type**
- TYPE defines allow or deny here `A` means allow 

**Permissons**
![[Pasted image 20260402230004.png]]

**Principal**
![[Pasted image 20260402230040.png]]

```powershell
foreach($service in $ishackable.PSChildName){ $sddl=(cmd \c sc sdshow $service); if($sddl -match "someregex"){$service}}
```

- when preparing regex we can use https://regexr.com
![[Pasted image 20260403155826.png]]

- the full script would be 
```powershell

$ishackable=Get-ItemProperty -Path HKLM_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\* | where-object { ($_.objectname -eq 'LocalSystem') -and ($_.start -eq '3')}

```