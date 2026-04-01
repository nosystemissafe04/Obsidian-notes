**GETTING HELP IN POWERSHELL** 7.0,0 [[recording-multitrack-2024-08-08T13-17-25-981Z.wav|powershell intro]]

```powershell
update-help
```

```POWERSHELL
GET-HELP *secure*string*
```
- use autocompletion with just a `-` then clicking tab to find out all the options or parameters , to get a list of all the parameter and what they do we can use `-parameter *`

```powershell
get-help convertto-securestring -parameter *
```

- we need secure string to connect to a computer using powershell remoting , we need to create a powershell secure string option [[Credentials and Remoting#creating secure string from clear text passwords|creating secure string]]
- we found password hash of the user , when we are jumping from one user to another which is not admin we are escalating horizontally , means it doesnt guarntee admin access , but it may have different attack vectors , 
- we are using here invoke-command which is used to run a command on local and remote host [[Credentials and Remoting#]]