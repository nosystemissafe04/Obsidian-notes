#windows-info
### 📌 Major Levels of Privilege in Windows

#### 1️⃣ **User Account Levels (Broad Categories)**

| Level                        | Typical Accounts                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| SYSTEM (NT AUTHORITY\SYSTEM) | OS-level, kernel-level, the highest possible privilege.                                |
| Administrator                | Local Administrators group members. Can install software, manage system settings, etc. |
| Standard User                | Regular user, limited rights, cannot install system-wide software.                     |
| Guest                        | Very limited, no persistence, no write access to critical locations.                   |

👉 _SYSTEM > Administrator > User > Guest_

---

#### 2️⃣ **Special Groups & Identities**

| Group / Identity              | Notes                                                                 |
| ----------------------------- | --------------------------------------------------------------------- |
| SYSTEM                        | Runs as kernel (e.g. LSASS, services). Highest level.                 |
| Local Administrator           | Powerful but not kernel.                                              |
| Domain Administrator          | Admin rights across the whole domain.                                 |
| Network Service               | Limited service account with some network permissions.                |
| Local Service                 | Limited service account with no network identity.                     |
| TrustedInstaller              | Manages Windows Updates — even higher than admin for some operations. |
| Everyone, Authenticated Users | Special identities used in ACLs (Access Control Lists).               |

---

#### 3️⃣ **Privileges / User Rights**

These are **fine-grained rights** assigned to user accounts or groups — this is where it gets very detailed.

Here are **some of the most important ones**:

| Privilege (Right)                    | Effect / Usage                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| SeDebugPrivilege                     | Debug any process — used for process injection, LSASS dumps, Mimikatz needs this. |
| SeBackupPrivilege                    | Read any file even without ACL permission — allows raw file access.               |
| SeRestorePrivilege                   | Write any file bypassing ACLs.                                                    |
| SeTakeOwnershipPrivilege             | Take ownership of any object, then change its permissions.                        |
| SeImpersonatePrivilege               | Impersonate another user (used in many privilege escalation attacks).             |
| SeTcbPrivilege (_Act as part of OS_) | Very dangerous — allows acting as part of the OS, rarely granted.                 |
| SeAssignPrimaryTokenPrivilege        | Allows assigning a primary token to a process (privilege escalation vector).      |
| SeLoadDriverPrivilege                | Load kernel drivers — used in many kernel exploit attacks.                        |
| SeShutdownPrivilege                  | Shutdown the system.                                                              |
| SeChangeNotifyPrivilege              | Bypass traverse checking — _everyone usually has this_.                           |
| SeCreateTokenPrivilege               | Create a token — highly sensitive.                                                |
| SeManageVolumePrivilege              | Manage file system volumes.                                                       |
| SeRemoteInteractiveLogonRight        | Right to log on via RDP.                                                          |
| SeInteractiveLogonRight              | Right to log on interactively at console.                                         |

👉 These are stored in **user tokens** and controlled via **Local Security Policy** or **Group Policy**.

#### The following are directly ported from windows documentation cover a lot of group policy settings 

| Group Policy Setting                                                                                                                                                                                                                                               | Constant Name                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [Access Credential Manager as a trusted caller](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/access-credential-manager-as-a-trusted-caller)                                   | SeTrustedCredManAccessPrivilege           |
| [Access this computer from the network](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/access-this-computer-from-the-network)                                                   | SeNetworkLogonRight                       |
| [Act as part of the operating system](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/act-as-part-of-the-operating-system)                                                       | SeTcbPrivilege                            |
| [Add workstations to domain](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/add-workstations-to-domain)                                                                         | SeMachineAccountPrivilege                 |
| [Adjust memory quotas for a process](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/adjust-memory-quotas-for-a-process)                                                         | SeIncreaseQuotaPrivilege                  |
| [Allow log on locally](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/allow-log-on-locally)                                                                                     | SeInteractiveLogonRight                   |
| [Allow log on through Remote Desktop Services](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/allow-log-on-through-remote-desktop-services)                                     | SeRemoteInteractiveLogonRight             |
| [Back up files and directories](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/back-up-files-and-directories)                                                                   | SeBackupPrivilege                         |
| [Bypass traverse checking](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/bypass-traverse-checking)                                                                             | SeChangeNotifyPrivilege                   |
| [Change the system time](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/change-the-system-time)                                                                                 | SeSystemtimePrivilege                     |
| [Change the time zone](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/change-the-time-zone)                                                                                     | SeTimeZonePrivilege                       |
| [Create a pagefile](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/create-a-pagefile)                                                                                           | SeCreatePagefilePrivilege                 |
| [Create a token object](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/create-a-token-object)                                                                                   | SeCreateTokenPrivilege                    |
| [Create global objects](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/create-global-objects)                                                                                   | SeCreateGlobalPrivilege                   |
| [Create permanent shared objects](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/create-permanent-shared-objects)                                                               | SeCreatePermanentPrivilege                |
| [Create symbolic links](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/create-symbolic-links)                                                                                   | SeCreateSymbolicLinkPrivilege             |
| [Debug programs](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/debug-programs)                                                                                                 | SeDebugPrivilege                          |
| [Deny access to this computer from the network](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/deny-access-to-this-computer-from-the-network)                                   | SeDenyNetworkLogonRight                   |
| [Deny log on as a batch job](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/deny-log-on-as-a-batch-job)                                                                         | SeDenyBatchLogonRight                     |
| [Deny log on as a service](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/deny-log-on-as-a-service)                                                                             | SeDenyServiceLogonRight                   |
| [Deny log on locally](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/deny-log-on-locally)                                                                                       | SeDenyInteractiveLogonRight               |
| [Deny log on through Remote Desktop Services](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/deny-log-on-through-remote-desktop-services)                                       | SeDenyRemoteInteractiveLogonRight         |
| [Enable computer and user accounts to be trusted for delegation](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/enable-computer-and-user-accounts-to-be-trusted-for-delegation) | SeEnableDelegationPrivilege               |
| [Force shutdown from a remote system](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/force-shutdown-from-a-remote-system)                                                       | SeRemoteShutdownPrivilege                 |
| [Generate security audits](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/generate-security-audits)                                                                             | SeAuditPrivilege                          |
| [Impersonate a client after authentication](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/impersonate-a-client-after-authentication)                                           | SeImpersonatePrivilege                    |
| [Increase a process working set](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/increase-a-process-working-set)                                                                 | SeIncreaseWorkingSetPrivilege             |
| [Increase scheduling priority](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/increase-scheduling-priority)                                                                     | SeIncreaseBasePriorityPrivilege           |
| [Load and unload device drivers](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/load-and-unload-device-drivers)                                                                 | SeLoadDriverPrivilege                     |
| [Lock pages in memory](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/lock-pages-in-memory)                                                                                     | SeLockMemoryPrivilege                     |
| [Log on as a batch job](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/log-on-as-a-batch-job)                                                                                   | SeBatchLogonRight                         |
| [Log on as a service](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/log-on-as-a-service)                                                                                       | SeServiceLogonRight                       |
| [Manage auditing and security log](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/manage-auditing-and-security-log)                                                             | SeSecurityPrivilege                       |
| [Modify an object label](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/modify-an-object-label)                                                                                 | SeRelabelPrivilege                        |
| [Modify firmware environment values](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/modify-firmware-environment-values)                                                         | SeSystemEnvironmentPrivilege              |
| [Obtain an impersonation token for another user in the same session](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/impersonate-a-client-after-authentication)                  | SeDelegateSessionUserImpersonatePrivilege |
| [Perform volume maintenance tasks](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/perform-volume-maintenance-tasks)                                                             | SeManageVolumePrivilege                   |
| [Profile single process](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/profile-single-process)                                                                                 | SeProfileSingleProcessPrivilege           |
| [Profile system performance](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/profile-system-performance)                                                                         | SeSystemProfilePrivilege                  |
| [Remove computer from docking station](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/remove-computer-from-docking-station)                                                     | SeUndockPrivilege                         |
| [Replace a process level token](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/replace-a-process-level-token)                                                                   | SeAssignPrimaryTokenPrivilege             |
| [Restore files and directories](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/restore-files-and-directories)                                                                   | SeRestorePrivilege                        |
| [Shut down the system](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/shut-down-the-system)                                                                                     | SeShutdownPrivilege                       |
| [Synchronize directory service data](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/synchronize-directory-service-data)                                                         | SeSyncAgentPrivilege                      |
| [Take ownership of files or other objects](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/take-ownership-of-files-or-other-objects)                                             | SeTakeOwnershipPriviledge                 |

Local accounts are stored on the machine that owns them. You cannot get this information without accessing the machine itself. Assuming you are dealing with a large network then this could take a while as each machine has to be scanned. However doing it is trivial depending upon the technology you want to use. For example given an arbitrary machine (for which you have the necessary rights) then the [Get-LocalGroupMember](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localgroupmember?view=powershell-5.1) Powershell cmdlet (PS 5.1+) gives you the local users.

Copy

```
   Get-LocalGroupMember Administrators  
```

As for getting all the AD servers you'll need to query AD for that. Then enumerate each server to get the members.

Copy

```
   Get-ADComputer -Filter * -SearchBase "DC=mycompany,DC=com"  
```

Putting it all together for a report.

Copy

```
   $servers = Get-ADComputer -Filter * -SearchBase "DC=mycompany ,DC=com" | Select-Object Name  
   foreach ($server in $servers) {  
       Invoke-Command -Session $server -cred -ScriptBlock {  
           Get-LocalGroupMember -Group Administrators | Write-Host "[$($server.Name)] $($_.Name)"  
       } -Credential $adminCredentials  
   }  
```

Personally, if you want to manage the local admins then you should be using group policy for that. Have the group policy wipe out everyone in the local admins group and put in only the users you want. This is a per-machine list. By default you would likely only want your domain admins (maybe) and whoever runs your infrastructure but you can add additional people per machine.

Refer to the [following article](https://activedirectorypro.com/remove-local-admin-rights-using-group-policy/) on how to set up GP to do this automatically. If you really want to do it by script then be aware that after your script runs any admin can add users back into the group. Hence why GP is a better option.

#### 4️⃣ **Integrity Levels (Mandatory Integrity Control)**

| Level            | Effect                                                             |
| ---------------- | ------------------------------------------------------------------ |
| System Integrity | SYSTEM processes (rare).                                           |
| High Integrity   | Admin processes (UAC elevation).                                   |
| Medium Integrity | Standard user processes (normal apps).                             |
| Low Integrity    | Sandbox processes (e.g. Edge/IE protected mode, some PDF viewers). |

👉 Used to **prevent lower-integrity processes from attacking higher ones**, even within the same user.