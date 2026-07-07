For your own lab VM, disabling Defender's real-time protection is standard prep so tool execution (Rubeus, mimikatz, etc.) isn't flagged mid-test. Here's how, assuming you have local admin on the target:

**1. Disable real-time monitoring:**

powershell

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
```

**2. Disable other Defender protection layers (cloud-delivered protection, behavior monitoring, IOAV, script scanning):**

powershell

```powershell
Set-MpPreference -DisableIOAVProtection $true
Set-MpPreference -DisableBehaviorMonitoring $true
Set-MpPreference -DisableScriptScanning $true
Set-MpPreference -MAPSReporting 0
Set-MpPreference -SubmitSamplesConsent 2
```

**3. Disable Controlled Folder Access (blocks unauthorized writes, can interfere with tool drops):**

powershell

```powershell
Set-MpPreference -EnableControlledFolderAccess Disabled
```

**4. Add exclusions for your working directory instead of disabling everything (more realistic to how engagements actually work, and avoids re-enabling issues):**

powershell

```powershell
Add-MpPreference -ExclusionPath "C:\Tools"
Add-MpPreference -ExclusionExtension ".exe"
Add-MpPreference -ExclusionProcess "rubeus.exe"
```

**5. Verify current state:**

powershell

```powershell
Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, BehaviorMonitorEnabled
```

**6. If Tamper Protection is on, these will fail silently or throw access denied.** Tamper Protection blocks `Set-MpPreference` changes even with local admin. Check and disable via registry (needs to be off first, can't be scripted remotely once it's fully enforced — usually done via Group Policy in a lab domain, or manually in Windows Security GUI → Virus & threat protection settings → Manage settings → Tamper Protection toggle):

powershell

```powershell
Get-MpComputerStatus | Select-Object IsTamperProtected
```

**7. Fully uninstall Defender (more aggressive, only if you want it gone entirely rather than just paused) — requires reboot:**

powershell

```powershell
Uninstall-WindowsFeature -Name Windows-Defender
```

A couple of practical notes for your Kerberoasting sim specifically: none of this is actually required for Kerberoasting itself to work at the protocol level — TGS-REQ/REP is legitimate Kerberos traffic and Defender doesn't block the _request_. What Defender flags is the tool binary (Rubeus.exe gets signature-detected almost immediately) or memory-injection behavior. If your goal is testing detection evasion rather than just "can I get a hash," it's worth doing the exercise both ways — once with Defender on to see what actually gets flagged (Rubeus vs. the native `KerberosRequestorSecurityToken` .NET approach you were looking at earlier), then again with it off as a baseline comparison. That contrast is usually more useful for OSCP-style reporting than just having AV off from the start.

**EXECUTION POLICY AND NOT BEING ABLE TO **