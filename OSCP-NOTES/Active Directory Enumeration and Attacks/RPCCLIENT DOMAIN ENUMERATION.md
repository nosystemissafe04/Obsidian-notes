Here's a practical rpcclient cheatsheet for AD enumeration.

### Connecting

bash

```bash
# Anonymous/null session
rpcclient -U "" -N <target_ip>

# With creds
rpcclient -U "DOMAIN\user%password" <target_ip>
rpcclient -U "user" <target_ip>      # will prompt for password

# Specify domain separately
rpcclient -U "user%password" -W DOMAIN <target_ip>
```

Once connected you get an `rpcclient $>` prompt — all commands below run from there.

### Domain / Server info

bash

```bash
querydominfo          # domain name, SID, server role, max password age
querydomain            # similar domain summary
srvinfo                 # server OS version, type
lsaquery                # domain SID
getdompwinfo           # password policy summary (min length, complexity)
```

### Password policy (important for spraying)

bash

```bash
getdompwinfo
```

For more detail combine with `enumdomusers` + `queryuser` to check `bad_password_count`/lockout per user.

### User enumeration

*bash*

```bash
enumdomusers                          # list all domain users + RIDs
queryuser <RID>                       # full details on one user (e.g. queryuser 0x1f4)
queryuser 0x3e8                       # RID in hex — convert decimal if needed
querydispinfo                          # display info (users) — sometimes works when enumdomusers is restricted
querydispinfo2
querydispinfo3
```

Convert RID decimal↔hex on the fly:

bash

```bash
printf '0x%x\n' 1000      # decimal -> hex
```

Loop to dump every user's details:

bash

```bash
for rid in $(rpcclient -U "user%pass" <ip> -c "enumdomusers" | grep -oP 'rid:\[\K[^\]]+'); do
  rpcclient -U "user%pass" <ip> -c "queryuser $rid"
done
```

### Group enumeration

bash

```bash
enumdomgroups                         # list all domain groups + RIDs
querygroup <RID>                      # details on a group
querygroupmem <RID>                   # members of a group (by RID)
enumalsgroups domain                  # aliases (local groups) in domain
enumalsgroups builtin                 # builtin aliases (Administrators, etc.)
queryaliasmem builtin 0x220           # members of builtin Administrators (544 = 0x220)
```

Common builtin RIDs to remember:

| Group          | RID (dec) | RID (hex) |
| -------------- | --------- | --------- |
| Administrators | 544       | 0x220     |
| Users          | 545       | 0x221     |
| Guests         | 546       | 0x222     |
| Domain Admins  | 512       | 0x200     |
| Domain Users   | 513       | 0x201     |
| Domain Guests  | 514       | 0x202     |

### RID cycling / brute-forcing SIDs (works even with restricted enum)

bash

```bash
lookupsids S-1-5-21-XXXXXXXXX-XXXXXXXXX-XXXXXXXXX-500     # resolve specific SID to name
lookupnames Administrator                                   # name -> SID
```

Brute force RIDs 500–1500 to find users/groups even if `enumdomusers` is blocked:

bash

```bash
for i in $(seq 500 1500); do
  rpcclient -U "user%pass" <ip> -c "lookupsids S-1-5-21-XXXXXXXXX-XXXXXXXXX-XXXXXXXXX-$i"
done
```

(Get the domain SID first via `lsaquery`.)

### Shares enumeration

bash

```bash
netshareenum
netshareenumall
netsharegetinfo <sharename>
```

### Computer/machine enumeration

bash

```bash
enumdomusers           # not just users; for machines check via LDAP usually, but:
samlookupnames domain <machinename$>
```

(rpcclient is weaker for machine account listing — `nxc` or `ldapsearch` is better for this.)

### Session / connected info

bash

```bash
netsessenum            # currently connected sessions
netfileenum             # open files
```

### SAM / LSA policy detail

bash

```bash
lsaquery
lsaenumsid
lookupsids <SID>
lookupnames <name>
querysecdesc           # security descriptor info
```

### Misc useful

bash

```bash
enumprivs                # list privileges
getusrdompwinfo <RID>   # per-user password info
dsroledominfo            # role of the server (PDC, member server, etc.)
```

### One-liners (no interactive shell needed)

bash

```bash
rpcclient -U "" -N <ip> -c "enumdomusers"
rpcclient -U "" -N <ip> -c "querydominfo"
rpcclient -U "user%pass" <ip> -c "enumdomusers" | awk -F'[][]' '{print $2}'   # just usernames
```

### Practical enumeration order on an engagement

bash

```bash
rpcclient -U "" -N <ip> -c "querydominfo"          # check anonymous works at all
rpcclient -U "" -N <ip> -c "enumdomusers"          # try anon user list
rpcclient -U "" -N <ip> -c "lsaquery"               # get domain SID for RID cycling fallback
rpcclient -U "" -N <ip> -c "enumdomgroups"
rpcclient -U "" -N <ip> -c "querygroupmem 0x200"   # Domain Admins members
rpcclient -U "" -N <ip> -c "netshareenum"
```

If anonymous gets `NT_STATUS_ACCESS_DENIED` on `enumdomusers`, fall back to RID cycling with `lookupsids`, which often still works even when SAMR enumeration is locked down — since SID lookup ties to a different access check than full enumeration.

One note: rpcclient is great for **manual verification and scripting fine-grained queries**, but for speed at scale, `nxc smb -u user -p pass --users --groups --rid-brute` does most of this in one shot. Use rpcclient when you need to drill into specific RIDs/groups or when nxc's output isn't giving you enough detail.