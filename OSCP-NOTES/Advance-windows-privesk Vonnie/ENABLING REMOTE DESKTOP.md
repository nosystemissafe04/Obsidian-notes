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

#### PERSISTANCE 