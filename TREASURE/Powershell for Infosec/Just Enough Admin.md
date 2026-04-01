just enough admin is used for access control . suppose you have an AD environment and you dns administrator to clear dns cache or restart dns service if something malfunctions so you are giving an administrative priviledge to a user just to do limited tasks and if someone have domain administrator they an absolute full control on that whole environment so to encounter it microsoft entroduced just enogh admin to control the privilege of user who only wants admin rights for just some tasks . 
we are giving access to only those things which are essential or certian things which a user need without giving them full admin rights 
- **Reduce the number of administrators on your machines** using virtual accounts or group-managed service accounts to perform privileged actions on behalf of regular users.
- **Limit what users can do** by specifying which cmdlets, functions, and external commands they can run.
- **Better understand what your users are doing** with transcripts and logs that show you exactly which commands a user executed during their session.

now lets dive into JEA 
```
#Requires -RunAsAdministrator

############################################################################################
### Create the RoleCapabilities file (psrc) inside of a <module>\RoleCapabilities folder ###
############################################################################################

$roleCapabilitiesPath = "C:\Program Files\WindowsPowerShell\Modules\SpoolerRestart\RoleCapabilities"
New-Item -ItemType Directory $roleCapabilitiesPath -ErrorAction Ignore

$VisibleCmdlets = 'Get-Service',
                  @{ Name = 'Restart-Service'; Parameters = @{ Name = 'Name'; ValidateSet = 'Spooler' }},
                  @{ Name = 'Stop-Service'; Parameters = @{ Name = 'Name'; ValidateSet = 'Spooler' }}

New-PSRoleCapabilityFile -Path "$roleCapabilitiesPath\SpoolerRestart.psrc" -VisibleCmdlets $visibleCmdlets
```
- we opened a file name jea in powershell for infosec 
- the these line create a rolecapabilites file psrc inside of a module folder . creating a role called spoolerrestart whoever get this role will only be allowed to run those commands which are specified . 
- one thing to note here is that in modules we have to name our role with the same name as the directory means 
- `<.....>\module\SpoolerRestart\RoleCapabilities\SpoolerRestart.psrc`
- rolecapabilites  defines the role or you can say **who** 
- then we are defining what commands are allowed by the person having that role in the environment 
- so we are only allowing get-service as a whole with all the parameters allowed 
- then we are allowing restart service and only allowing name parameter and in that parameter we are only allowing spooler as a valid value to that variable other than that no value will be accepted . so think how much we can control over the role .  only the commands explicitly mentioned are allowed if you dont mention the command it willbe bydefault blocked . and what args are allowed and what value to those args are allowed . awesome !!!!!

then we have 
```
#############################################################################
### Create the Session Configuration file (pssc) in a temporary directory ###
#############################################################################

$myargs = @{
 Path = "$env:Temp\SpoolerRestart.pssc"
 RoleDefinitions = @{ 'PrinterAdmins' = @{RoleCapabilities = "SpoolerRestart" }}
 SessionType = "RestrictedRemoteServer"
 RunAsVirtualAccount = $true
}
New-PSSessionConfigurationFile @myargs
```
- when somebody connects to this role what configuration will that session have . it define that . 
- the configuration is defined in SpoolerRestart.pssc in our case 
- it define who have the role that we set earleir . it means which group members have this role assigned or anybody who is in printeradmins group have the role of spoolerrestart in our case 
- then sessiontype which is restrictedremoteserver 
- then we are setting that whoever connect to this group or endpoint will have a virtual account assigned

```
###############################################################
#### Register the endpoint that the session will connect to ###
###############################################################
 
Register-PSSessionConfiguration -Name "SpoolerRestartEndpoint" -Path $env:Temp\SpoolerRestart.pssc -Force
```
An endpoint in JEA is the access point for remote PowerShell sessions. It is essentially a constrained runspace that users connect to for executing their tasks. Endpoints are configured to run under specific session configurations which is `$env:temp\spoolerrestart.pssc `, limiting what the users can do based on their assigned roles. To set up an endpoint:

**Connect to the JEA endpoint** by specifying the configuration name when creating a new PowerShell session (e.g., `New-PSSession -ConfigurationName MyJEAEndpoint`).
### Session Configuration

A session configuration in JEA defines the environment for a PowerShell session. It specifies which users are allowed to connect and what they are allowed to do. The session configuration file (.pssc) is where you configure the details such as:

- **Role Definitions**: Defines the roles available in the session and the corresponding role capabilities.
- **Transcript Directory**: Specifies where to save transcripts of the session activities.
- **Session Type**: Determines whether the session is interactive or restricted.
- **Run As Virtual Account**: Configures the session to run under a virtual account with limited privileges.


we to query how many groups are there on a win computer [[manual recon on users and groups in non ad environment#1. **List All Local Groups**]]
we see on a remote computer we executed this command and got toknow that there is a group called printeradmin
to know the users of that group [[manual recon on users and groups in non ad environment#3. **List Members of a Specific Local Group**]]
we found a user called bob 
now to know about bob [[manual recon on users and groups in non ad environment#2. **List All Local Users OR specific user **]]

after executing the script it will create a psrolecapability file in the path specified and that file look like this 
we can set alias , module to import when that session will be open , functions and external commands and a lot ... 
it very customisable 
![[Pasted image 20240806005641.png]]

now lets look pssc session configuration file which is in temp folder in our case 
![[Pasted image 20240806010846.png]]
we can describe transcript directory sessiontype and  virtual accounts
```

# User roles (security groups), and the role capabilities that should be applied to them when applied to a session
RoleDefinitions = @{
    'PrinterAdmins' = @{
        'RoleCapabilities' = 'SpoolerRestart' } }

}
```
the role which should be applied to them when applied to a session printeradmins groups member can assigned this role 

now how should bob connect to this endpoint . lets say we ran that script on a server and there is endpoint on that machine where bob can connect and bob is a member of printeradmins group so he can connect 
```
enter-pssesion -computername <server-name> -configurationname <endpoint-name > -credential $creds
```
this will connect to server on that endpoint when he connects it all the session configs will be applied with those credential
![[Pasted image 20240806012916.png]]
we are not able to run ls command on that computer where we set jea . 
when executing get-command we see a lot of commands which we didnt allowed earlier in the configs . these are the command which are always be allowed bcz it required as in powershell to operate like clear-host to clear the screen exiting , getting help ...

if we change psrc file it will modify the endpoint . like when we allow all the commands `get-*` all the get commands will be allowed just changing the psrc file little bit can be dangerous 
if it was a set verb with wildcard it could be drastic 

![[Pasted image 20240806015111.png]]
changed the allowed command and setup transcription logs 
![[Pasted image 20240806015141.png]]
now we can run all these get commands 

we setup the logging directory lets look at logging 

when i enable logging by gpo it logs but i didnt logged the commands executed . on remote server . i dont know why and i am leaving it not digging in why . but when i enable logging with the script that we have it started logging all the commands on remote server not on the computer where we are executing commands on 

the transcription logging that we set are logging in that directory 

#### Desired state configuration
![[Pasted image 20240806140240.png]]
![[Pasted image 20240806140244.png]]
![[Pasted image 20240806140248.png]]
we are not gettting into this topic bcz dsc is moving out of powershell and now its only for azure environemnt and an external module it does not came bydefault with powershell . 
the dsc is used when someone what to have all the session configs applied when they connect . if someone change them it will reapply those custome session configs to that remote server 