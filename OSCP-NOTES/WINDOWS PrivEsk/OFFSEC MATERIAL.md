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
get-itemproperty "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname
```