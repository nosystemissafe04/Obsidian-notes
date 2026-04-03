```POWERSHELL
.\netsh advfirewall set allprofiles state off
```

```cmd
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v "fDenyTSConnections" /t REG_DWORD /d 0 /f 
```
