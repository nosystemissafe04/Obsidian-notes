#### SHARPCOLLECTION 
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

#### WINPEAS
- WINPEAS SHOWS POWERSHELL LOGGING INFO WHICH IS USE-FULL TO KNOW IF WE ARE LEAVING BEHIND ANY TRACES FOR POWERSHELL LOGGING SEE ([[Powershell logging and logging bypass]])

**POWERSHELL HISTORY (PSREADLINE)**
ANOTHER VECTOR FOR PRIVESC , MAY CONTAIN SENSITIVE INFORMATION OR PASSWORDS see ([[]])