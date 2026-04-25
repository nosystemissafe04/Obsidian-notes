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

```cmd
ifconfig
```

```cmd

```