---
Tailored notes:
  - chat-gpt notes on AD
atomic-notes: active directory
enumeration: building blocks
---
#atomic-notes 


What an OU is

- Logical container inside a domain to group users, computers, groups, service accounts.
    
- Used for delegation (who can manage what) and for applying GPOs.
    
- Mirrors org structure (Servers/Workstations/IT/Dept), which hints at privilege boundaries and likely misconfigurations.
    

Why OUs matter in attacks

- Delegation on OUs grants rights over child objects (reset passwords, create/delete objects, write group membership).
    
- GPOs linked to OUs can be abused (scripts, scheduled tasks, local admin grants, software deployment).
    
- Create-computer rights on an OU can enable machine join abuse and downstream escalation paths (e.g., RBCD).
    

Enumeration must-haves

- Map OU tree: names, DNs, canonical paths.
    
- For each OU: linked GPOs (order, Enforced), delegated ACLs (who can write/modify), child object types and counts.
    
- Distinguish default Containers (CN=Users, CN=Computers) from real OUs (only OUs can have GPO links).
    

High-value OUs to prioritize

- Servers / Tier0 / Domain Controllers OU: tight controls expected; any writable link or delegation is gold.
    
- IT/Admin OU: helpdesk/ops groups often delegated—look for reset password or link GPO rights.
    
- Workstations OU: common place for GPOs that add local admins or deploy scripts/agents.
    
- Service Accounts OU: targets for password reset or SPN/constrained delegation angles.
    
- Staging/Quarantine/Legacy OUs: often stale, misconfigured delegation.
    

Key attack angles via OUs

- Delegation abuse:
    
    - Rights like WriteDacl, GenericAll/Write, ResetPassword, Create/Delete Child on the OU → control users/computers under it.
        
    - WriteMembers on groups stored in that OU → privilege via group membership changes.
        
- GPO abuse:
    
    - If you can edit or link a GPO to the OU, push startup/logon scripts, scheduled tasks, registry, or local admin via Preferences/Restricted Groups.
        
    - Writable GPO SYSVOL paths or script shares → replace payloads.
        
- Create computer object rights:
    
    - Join rogue machine, leverage policies and potential RBCD or cert-based paths for escalation/lateral movement.
        

What to record per OU (minimum)

- Name, DN, canonical path, purpose (Servers/Workstations/IT/Dept).
    
- Linked GPOs (GUID/name, Enforced, order) and any risky settings (Local Users and Groups, Scripts, Scheduled Tasks).
    
- Delegated principals with powerful rights (Reset-Pwd, Write, Create/Delete Child, Link GPO).
    
- Notable child objects (counts of users/computers; any high-value systems).
    

Red flags to act on

- Helpdesk or non-IT groups with modify rights on Servers/Tier0 OUs.
    
- GPOs linked to Workstations/Servers OUs that add domain groups to local Administrators.
    
- Startup/logon scripts from writable shares.
    
- Legacy OUs with broad, old delegations.
    

Quick command cues (for your memory)

- List OUs + GPOs: Get-ADOrganizationalUnit -Filter * -Properties CanonicalName,LinkedGroupPolicyObjects
    
- OU ACLs: Get-DomainObjectAcl -SearchBase "<OU DN>" -ResolveGUIDs
    
- GPO local admin mapping: Get-DomainGPO | Get-DomainGPOLocalGroup
    
- Objects in OU: Get-ADComputer/Get-ADUser -SearchBase "<OU DN>" -Filter *
    

Minimal workflow in labs

1. Dump OU structure and GPO links; mark Servers/Workstations/IT/Tier0.
    
2. Scan OU ACLs; flag any write/reset/create rights.
    
3. Inspect linked GPOs for local admin grants and scripts.
    
4. Choose the weakest OU:
    
    - If can edit/link GPO → push controlled code or local admin.
        
    - If can create computer → plan join + RBCD/cert abuse.
        
    - If can reset passwords → target useful accounts and pivot.

- Logical container inside a domain to group users, computers, groups, service accounts.
    
- Used for delegation (who can manage what) and for applying GPOs.
    
- Mirrors org structure (Servers/Workstations/IT/Dept), which hints at privilege boundaries and likely misconfigurations.
    

Why OUs matter in attacks

- Delegation on OUs grants rights over child objects (reset passwords, create/delete objects, write group membership).
    
- GPOs linked to OUs can be abused (scripts, scheduled tasks, local admin grants, software deployment).
    
- Create-computer rights on an OU can enable machine join abuse and downstream escalation paths (e.g., RBCD).
    

Enumeration must-haves

- Map OU tree: names, DNs, canonical paths.
    
- For each OU: linked GPOs (order, Enforced), delegated ACLs (who can write/modify), child object types and counts.
    
- Distinguish default Containers (CN=Users, CN=Computers) from real OUs (only OUs can have GPO links).
    

High-value OUs to prioritize

- Servers / Tier0 / Domain Controllers OU: tight controls expected; any writable link or delegation is gold.
    
- IT/Admin OU: helpdesk/ops groups often delegated—look for reset password or link GPO rights.
    
- Workstations OU: common place for GPOs that add local admins or deploy scripts/agents.
    
- Service Accounts OU: targets for password reset or SPN/constrained delegation angles.
    
- Staging/Quarantine/Legacy OUs: often stale, misconfigured delegation.
    

Key attack angles via OUs

- Delegation abuse:
    
    - Rights like WriteDacl, GenericAll/Write, ResetPassword, Create/Delete Child on the OU → control users/computers under it.
        
    - WriteMembers on groups stored in that OU → privilege via group membership changes.
        
- GPO abuse:
    
    - If you can edit or link a GPO to the OU, push startup/logon scripts, scheduled tasks, registry, or local admin via Preferences/Restricted Groups.
        
    - Writable GPO SYSVOL paths or script shares → replace payloads.
        
- Create computer object rights:
    
    - Join rogue machine, leverage policies and potential RBCD or cert-based paths for escalation/lateral movement.
        

What to record per OU (minimum)

- Name, DN, canonical path, purpose (Servers/Workstations/IT/Dept).
    
- Linked GPOs (GUID/name, Enforced, order) and any risky settings (Local Users and Groups, Scripts, Scheduled Tasks).
    
- Delegated principals with powerful rights (Reset-Pwd, Write, Create/Delete Child, Link GPO).
    
- Notable child objects (counts of users/computers; any high-value systems).
    

Red flags to act on

- Helpdesk or non-IT groups with modify rights on Servers/Tier0 OUs.
    
- GPOs linked to Workstations/Servers OUs that add domain groups to local Administrators.
    
- Startup/logon scripts from writable shares.
    
- Legacy OUs with broad, old delegations.
    

Quick command cues (for your memory)

- List OUs + GPOs: Get-ADOrganizationalUnit -Filter * -Properties CanonicalName,LinkedGroupPolicyObjects
    
- OU ACLs: Get-DomainObjectAcl -SearchBase "<OU DN>" -ResolveGUIDs
    
- GPO local admin mapping: Get-DomainGPO | Get-DomainGPOLocalGroup
    
- Objects in OU: Get-ADComputer/Get-ADUser -SearchBase "<OU DN>" -Filter *
    

Minimal workflow in labs

1. Dump OU structure and GPO links; mark Servers/Workstations/IT/Tier0.
    
2. Scan OU ACLs; flag any write/reset/create rights.
    
3. Inspect linked GPOs for local admin grants and scripts.
    
4. Choose the weakest OU:
    
    - If can edit/link GPO → push controlled code or local admin.
        
    - If can create computer → plan join + RBCD/cert abuse.
        
    - If can reset passwords → target useful accounts and pivot.