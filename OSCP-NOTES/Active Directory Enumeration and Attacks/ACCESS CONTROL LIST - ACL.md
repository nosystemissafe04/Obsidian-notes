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
