#### SITUATIONAL AWARENESS

**user enumeration**
```CMD
whoami

whoami /groups

whaomi /priv
```

```cmd
net user 

net group 
```

**finding other user information**
```
net user <username>

net group <groupname>
```

**list of local user and they are enable or not**
```powershell
get-localuser
```

**list of local groups**
```powershell
net localgroup
```

*or*

```powershell
get-localgroup
```
*remember to distinguish between standard and non standard groups*

`REMOTE MANAGEMENT` = USERS WHO CAN ACCESS IT VIA WMI 
`REMOTE DESKTOP` = USERS WHO CAN RDP TO THE MACHINE 
`BACKUP OPERATORS` = OVERRIDE SECURITY RESTRICTIONS

**finding the members of local group**
```powershell
get-localgroupmember <groupname>
```

**system information , architechture , os version , patched or not **
```powershell
systeminfo
```

**network information**
```cmd
ifconfig /all
```

```powershell
route print
```

**all active network connections**
```powershell
netstat -ano
```

**finding all the installed applicaton**
we will query two registry keys to list both 32 and 64bit applications
*32 bit applications*
```powershell
get-itemproperty "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname
```

*64 bit applications*
```powershell
get-itemproperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname
```

SOME APPLICATION MAY NOT BE SHOWN IN THE RESULT THOSE APPLICATION WHICH HAVE FLAWED INSTALLATION OR NOT INSTALLED PROPERLY 

*CHECK THOSE DIRECTORY WHERE INSTALLATION OF 64BIT AND 32BIT APPLICATION STORE THERE FILES*

*INSPECT DOWNLOADS DIRECTORY TO FIND MORE APPLICATION PROGRAMS*

---

**WHICH OF THE ABOVE APPLICATIONS ARE CURRENTLY RUNNING**
```POWERSHELL
get-process
```
*the <mark class="hltr-green-flag">pid</mark> we got from netstat command and the <mark class="hltr-green-flag">id</mark> of get-process command can give us which application are running or listening for connections *


### HIDDEN IN PLAIN VIEW
```POWERSHELL
get-childitem -path C:\ -include *.kdbx -file -recurse -erroraction silentlycontinue
```

BASED ONTHE INFORMATION WE GATHERED , IF XAMPP OR OTHER APPLICATION ARE RUNNING WE WILL TARGET THOSE APPLICATION TO FIND THE PASSWORDS IF THEY ARE STORED OR NOT

```POWERSHELL
get-childitem -path C:\xampp -include *.txt,*.ini -file -recurse -erroraction silentlycontinue
```

checking the directory of user

```powershell
get-childitem -path C:\users\dave -include *.txt,*.pdf,*.xls,*.xlsx,*.doc,*.docx -file -recurse -erroraction silentlycontinue
```

*if we did horizontal escalation by finding any passwords , we ned to repeate the whole process of finding any sensitive file and configuration files*













