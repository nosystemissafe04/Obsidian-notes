
```
history 
```
- can be used to print the current session history 
```
invoke-history <number of history > 
```
- this will run that command again we have to enter the number at which it cames .there is also a alias of this command 
```
r <number of history >
```
- either the command is correct or not it will store that command 

modules can be listed with 
```
get-module
```
- powershell loads the module when you execute something which is provided by that module 
- get-psreadline is a module which have history commands in it 

- so these above are session history if you open another powershell window these history will not be present in that session 

to get all the history regardless of sessions , we can use get-psreadlineoption which shows the option of this module and find out the path of the history file where all the history will be stored . there is a limit to this file which can also be seen by looking into option of psreadline  . 
just open this history file and you got all the history of multiple sessions 
```
start notepad++ ((get-psreadlineoption).historysavepath)
```
there is a newer feature of psreadline module which will filter all the sesitive information to be stored in the history file . so that the attacker cannot gain it as history file doesnt require admin right to open and read it but this feature is only available in newer versions of psreadline right now we are running 2.0 to update this module . 
```
install-module psreadline 
```
- this will update the module . if execution policy is set to restricted it will not load the newer module 
- after updating it  . we can use that functionality where sensitive information will not be stored in history file 
- this feature can also be abused via attacker so that his malicious commands will not be stored in history file ^attacker
	lets say 
```
write-host "i am an attacker" #password
```
- this command have password as a comment and this is one of the keyword which psreadline does not store so they can have this in every command they use 
the attackers can also manually edit the history file to disguise the people of blueteam . or manually deleting some command in history file . its more difficult for them and its easy to use a commented password keyword 

the session history have the commands which are filtered by psreadline means the persistent history which is stored in a file via psreadline module does not have sensitive information but the session history have those sensitive information as a history 

### file based history search 
we can use a keybinding to search for history in that history file that psreadline maintains . 
**ctrl + r for reverse search** 
**ctrl + s for forward search** 
to iterate over searches use the same keybindings 

### event handler 
handlers refer to event handlers, which are used to manage events raised by various objects, such as .NET objects, Windows Forms controls, or PowerShell engine events. Event handlers are scripts or functions that execute in response to an event
for example : if a certain keys are pressed or there is a keybinding a certain function or scriptblock will be executed 
```
set-psreadlinekeyhandler -chord "ctrl+spacebar" -scriptblock {write-host "hello this is powershell"}
```
like this we can use handlers 

### addtohistoryhandler
this handler is called when ever a command is written in a history file . it will return true if the command will be written and return false to not write it to the history file . as we have seen psreadline do filter commands . that is done by this handler . 
the part to focus on is that an attacker can edit this handler to return false on every command to be executed and it does not require admin rights to do that but the command which is used to edit or set this handler to false will be recorded . we have discussed that can also be bypassed with a comment and a keyword . 
```
set-psreadlineoption -addtohistoryhandler {return $false}
```
now this handler will always return false . if you uparrow to privious command it will not show that as using up arrow is also iterates over history file and we havent stored anything by turning this handler to false 

![[Pasted image 20240713191939.png]]