
[[Credential Hunting in Windows]]

using this resource methodology [[local_privilege_escalation#7. Cleartext Passwords / Stored credentials]]



- FINDSTR
	- ` findstr /SIM /C:"password" *.txt *.ini *.cfg *.config *.xml *.git *.ps1 *.yml`

		- change the /C parameter to anything like pass or token or key 

		- /s searches the current directory and all subdirectories for matching files.[findstr-wikipedia](https://en.wikipedia.org/wiki/Findstr)

		- /i makes the search case-insensitive so letter case is ignored.[findstr-microsoft](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc732459\(v=ws.11\))

		- /m prints only the filename if a file contains at least one matching line, suppressing the matching lines themselves.[findstr-wikipedia](https://en.wikipedia.org/wiki/Findstr)

##### other resources 
[[Credential Hunting in Windows]]
