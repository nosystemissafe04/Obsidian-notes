### GAINING THE FOOTHOLD
- From the nmap scan we found smb , http server on port 80 and 8088 
- go on to these ports via browser , and check what is there just navigate around to find more and more information what pages are there , any email used in contact us page , use whois on domain , 
- if there login and registration - Try weak/default credentials on login pages before registering your own user, register on and then try again to find anything is there 
- Inspect client-side JavaScript for hidden endpoints or clues when possible.
- Don’t forget to check HTTP headers or uncommon request methods (like PUT/DELETE), which can expose extra functionality.
- If SMB is open, include basic enumeration with smbclient or relevant nmap scripts
- if its a blogging website maybe there can be a comment section its a input which may not show up on regular dirbusting 
- so we choose 80 where there is a login page 
- if nmap could not found anything on but these http ports we could just jump to dir busting on these ports to find anything 
- or before all these we could enumerate more on these ports like if what webstack is being used , wappalizer can tell us nikto is another one , and there are tools to find these based on the webstack we can try to point doing extensions like aspx or php or web servers like apache or jenkins to find public exploits
- first we will use searchsploit , it is way more faster then normal browsing on web 
- ok now we have paths (we are doing these side by side for better parallelism) 
	- public exploits 
	- dirbusting result 
	- there are two ports 
- on both the ports using sed grep or awk whatever you can use , find any input paths in dirbusted results 
- again use sql injection payload or xxs payloads on these input areas with burp or any other tools (remember we need to be efficiant with tools here wide range of tools )
- while doing this go on public exploits if something interesting pops up , 
- by doing all these we somehow will get an idea where we have to move forward sql willnot show up sometimes

# ESCALATION 

```cmd
where /R c:\windows bash.exe
```
finding bash on system via CMD

```CMD
where /R c:\windows wsl.exe
```
finding wsl.exe is present or not on the system 

remember if we can run bash.exe or wsl.exe as root or any other user , we might try to login , and find anything interesting there like enumerating more on wsl for stored passwords , or hashes which might reveal the clear text password , so that we can use that password to login as elevated user , 
	use history
	find text files containing passwords 
	inspect /etc/shadow or other permission misconfiguration 

from here its more of a linux privesk 

if we found any credential on history in bash or in powershell or in cmd , we can use psexec , wmisexec or smbexec for loggin into machine via uploading a malware , if not we can try to login over smb , we can upload netcat and try to invoke or run that file over that service account if we can execute that somehow , for example if there is an iis server running and we can execute aspx or php we , we have code execution , we can get foothold 


