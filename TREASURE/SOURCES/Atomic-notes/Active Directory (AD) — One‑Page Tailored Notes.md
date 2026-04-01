---
Tailored notes:
  - chat-gpt notes on AD
Active Directory: 
atomic-notes: active directory
---
#atomic-notes 
# Active Directory (AD) — One‑Page Tailored Notes

## Core Building Blocks

- Objects: Users, Computers, Groups, OUs, Domains, DCs — each with attributes (name/UPN, SID, group membership, permissions).
     ^organizational-units

> [!Orgaizational Units]
> - Containers vs OUs: Containers are default holding places (limited features); OUs support delegation and GPOs and should be used for organization.

    
- Domain Controllers (DCs): Servers running AD DS; handle authentication, directory writes, replication. Some DCs are Global Catalog (GC) for forest‑wide lookups.
    

## Hierarchy and Scope (Forest → Tree → Domain → OU → Objects)

- Forest: Top security and replication boundary; common schema and GC; can host multiple trees.
    
- Tree: One or more domains in a contiguous DNS namespace inside a forest.
    
- Domain: Administrative boundary with its own DCs, policies, and replication; transitive two‑way trusts form automatically within a forest.
    
- OUs: Organizational structure inside a domain for delegation and GPO targeting; can be nested by function or department.
    

> [!ORGANIZATIONAL UNIT]
> - Objects: Users, Computers, Groups, and Service Accounts live inside OUs or containers.^64c7c8

    

## Administrative Roles and What They Control

- Enterprise Admins (forest‑level): Full control across all domains; used for forest operations (e.g., adding domains), schema changes (often with Schema Admins).
    
- Domain Admins (domain‑level): Full control within a single domain (objects, DCs of that domain, GPOs).
    
- Other built‑in operator groups (domain‑level): Account/Server/Backup Operators for narrower operational tasks.
    
- Group Policy Creator Owners: Create/manage GPOs within a domain.
    

## Group Policy (GPO) Essentials

- Purpose: Configure security and settings for users/computers.
    
- Link targets: Site, Domain, OU.
    
- Precedence: Local < Site < Domain < OU; inheritance can be blocked; links can be Enforced.
    
- Best practice: Link GPOs to OUs that reflect roles/devices (e.g., Workstations OU, Servers OU).
    

## Group Strategy and Nesting

- Group scopes: Domain Local (assign permissions in domain), Global (collect users from same domain), Universal (span forest; good for cross‑domain access).
    
- Types: Security (ACLs/permissions) vs Distribution (email lists).
    
- Nesting patterns:
    
    - AGDLP: Accounts → Global → Domain Local → Permissions (single domain).
        
    - AGUDLP: Accounts → Global → Universal → Domain Local → Permissions (multi‑domain/forest).
        

## From Domain to a Single Workstation (Flow)

- Join workstation to domain → creates a Computer object (place in Workstations OU).
    
- User logs in → DC authenticates; GC assists for forest searches.
    

- GPOs linked to domain/OU apply to the workstation and its users.^64c7c8
    
- Domain Admins manage via domain policies; use delegated admins for OU‑scoped tasks.
     ^1920cb

## OU Design (Practical Template)

^410a1d

- Top‑level OUs by function:
    
    - Users, Workstations, Servers, Service Accounts, Admin (Privileged Identities).
        
- Optional departmental child OUs: HR, Finance, Engineering, IT.
    
- Delegate control on specific OUs (e.g., Helpdesk can reset passwords in Users OU; Desktop team can join computers in Workstations OU).^64c7c8
    
- Avoid using default “Users/Computers” containers for long‑term placement.
    

## Security and Ops Best Practices

- Keep Enterprise Admins and Domain Admins memberships minimal; use just‑in‑time access and privileged access workstations.
    
- Separate admin accounts (no browsing/email); enable auditing for privileged actions.
    
- Patch DCs, monitor replication/AD health, back up System State regularly.
    
- Prefer OUs over containers; document GPO links and delegation.
     ^5334ca
- For cross‑domain access, leverage Global→Universal→Domain Local with least privilege.
    

## Quick Commands and GUI Pointers

- MMC snap‑ins: Active Directory Users and Computers (ADUC), Group Policy Management (GPMC), Sites and Services.
    
- Common tasks:
    
    - Create OUs, move objects out of default Containers into OUs.^64c7c8
        
    - Link GPOs at OU level; verify Resultant Set of Policy (gpresult /r, RSOP).^64c7c8
         ^a258d1
    - Manage groups using AGDLP/AGUDLP model.
        

## Mental Map

- Forest
    
    - Tree(s)
        
        - Domain(s)
            
            - DCs (some GC)
                
            - OUs (nested)^64c7c8 ^9fc164
                
                - Users, Computers, Groups, Service Accounts
                    
- Admin scopes ^6af1f5
    
    - Enterprise Admins → Forest
        
    - Domain Admins → Domain
        
    - Delegated Admins → Specific OUs^64c7c8