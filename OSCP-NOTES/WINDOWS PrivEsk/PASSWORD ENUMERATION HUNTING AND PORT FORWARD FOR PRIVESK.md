

[[Credential Hunting in Windows]]

using this resource methodology [[local_privilege_escalation#7. Cleartext Passwords / Stored credentials]]

powershell command to list file names which may contain sensitive information , like kdbx extension file , txt file , ini .....
```powershell
PS C:\Users\dave> Get-ChildItem -Path C:\ -Include *.kdbx -File -Recurse -ErrorAction SilentlyContinue

Get-ChildItem -Path C:\ -Include *.kdbx -File -Recurse -ErrorAction SilentlyContinue
```

- FINDSTR
	- ` findstr /SIM /C:"password" *.txt *.ini *.cfg *.config *.xml *.git *.ps1 *.yml`

		- change the /C parameter to anything like pass or token or key 

		- /s searches the current directory and all subdirectories for matching files.[findstr-wikipedia](https://en.wikipedia.org/wiki/Findstr) when using this command we have to change the current directory to root , other wise use the below command 

		- /i makes the search case-insensitive so letter case is ignored.[findstr-microsoft](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc732459\(v=ws.11\))

		- /m prints only the filename if a file contains at least one matching line, suppressing the matching lines themselves.[findstr-wikipedia](https://en.wikipedia.org/wiki/Findstr)

```powershell
findstr /SIM "password" C:\*.xml
replace .xml with .txt or any other extension as you wish 
```
##### other resources 
[[Credential Hunting in Windows]]




- ```powershell
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
```
 

- reg query runs read only search in win registary 
- HKLM = HKEY_LOCAL_MACHINE is a provider see([[Powershell Fundamentals#Powershell Providers]])
- /f = search filter matches the text "**password**" case insensitive
- /t REQ_SZ = only return matches where the value type is a plain string 
- /S = recurse throught all the keys under HKLM 
 
 change the password string to anything else to find that string in the registary 

##### Exact match and case sensitive:
 
`reg query HKLM /f password /t REG_SZ /s /e /c`

 ##### Search only in data:

`reg query HKLM /f password /t REG_SZ /s /d`

there are other ways to find passwords in file system , with findstr [[PASSWORD ENUMERATION]]

**i am skipping the part to escalate with password bcz psexec is not working , the workaroung here is to use port forward , to connect via plink , or escalate with another good shell via ssh to use those creds , i am not good at port forwarding** 


