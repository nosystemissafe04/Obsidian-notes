### SHARPCOLLECTION 
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

- we are pin pointing and going deep into very selective services , so first we need to make sure we can write to those registry , we are able to write on some of them 

```powershell
Get-ItemProperty -Path HKLM_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\*
```
<mark class="hltr-myblue">this will show us all the properties of every object in the services path</mark> 

