### SSH Local Port Forward Syntax

bash

```bash
ssh -L [LOCAL_PORT]:[DESTINATION_IP]:[DESTINATION_PORT] [USER]@[SSH_SERVER]
```

---

### Breaking Down Each Part

```
ssh -L   8080  :  127.0.0.1  :  80    user@victim_ip
          │            │          │         │
          │            │          │         └── Who you SSH into (jump host)
          │            │          └──────────── Port of the target service
          │            └─────────────────────── Destination IP 
          │                                     (relative to the SSH server)
          └──────────────────────────────────── Port that opens on YOUR machine
```

---

### The KEY Mental Model

> **The destination IP is resolved FROM THE VICTIM'S PERSPECTIVE — not yours.**

This is what confuses most people.

```
127.0.0.1  →  means localhost OF THE VICTIM
```

So when you write:

bash

```bash
ssh -L 8080:127.0.0.1:80 user@victim
```

You are saying:

```
"Open port 8080 on MY machine,
 tunnel it through SSH to victim,
 and from VICTIM reach 127.0.0.1:80"
                  ↑
            victim's own localhost
```

---

### Three Different Scenarios

#### Scenario 1 — Service on victim's own localhost

bash

```bash
ssh -L 8080:127.0.0.1:80 user@10.10.10.5
```

```
[You:8080] ──SSH tunnel──► [Victim 10.10.10.5] ──► [127.0.0.1:80]
                                                      (victim itself)
```

- Service is running **on the victim locally**
- Only victim can normally reach it
- Now YOU can hit `127.0.0.1:8080` on your kali

---

#### Scenario 2 — Service on a DIFFERENT internal machine

bash

```bash
ssh -L 8080:192.168.1.20:445 user@10.10.10.5
```

```
[You:8080] ──SSH tunnel──► [Victim 10.10.10.5] ──► [192.168.1.20:445]
                                                      (internal machine
                                                       only victim can reach)
```

- `192.168.1.20` is a machine **only victim can talk to**
- You can't reach it directly
- Victim acts as the **relay**
- Now `127.0.0.1:8080` on your kali hits that internal machine's SMB

---

#### Scenario 3 — Victim itself but different port

bash

```bash
ssh -L 4444:10.10.10.5:8080 user@10.10.10.5
```

```
[You:4444] ──SSH tunnel──► [Victim 10.10.10.5:8080]
```

- Here destination IP is the **victim's own external IP**
- Useful if port 8080 is firewalled from outside but SSH (22) is open
- You reach `127.0.0.1:4444` on kali → hits victim's port 8080

---

### Visual Flow of What Happens

```
YOUR KALI                    VICTIM (SSH Server)         TARGET SERVICE
─────────────────────────    ───────────────────         ──────────────
curl 127.0.0.1:8080
        │
        │  (traffic hits your local port 8080)
        │
        ▼
  SSH Client encrypts
  and sends through
  SSH tunnel ──────────────► SSH Daemon receives
                              decrypts traffic
                                    │
                                    │ (now makes connection
                                    │  AS IF IT IS LOCAL)
                                    ▼
                              connects to ──────────────► 127.0.0.1:80
                              destination                 (web app, db,
                                                          whatever runs here)
```

---

### Common Mistake People Make

bash

```bash
# WRONG thinking:
# "127.0.0.1 means MY localhost"

ssh -L 8080:127.0.0.1:80 user@victim
#              ↑
#   This is VICTIM'S 127.0.0.1
#   NOT your kali's localhost
```

---

### Real OSCP Examples

bash

```bash
# Internal web app on victim's localhost
ssh -L 8080:127.0.0.1:80 user@10.10.10.5
→ browse http://127.0.0.1:8080 on your kali

# WinRM on internal machine (pivot)
ssh -L 5985:192.168.1.20:5985 user@10.10.10.5
→ evil-winrm -i 127.0.0.1 -u admin -p password

# MySQL on victim's localhost
ssh -L 3306:127.0.0.1:3306 user@10.10.10.5
→ mysql -h 127.0.0.1 -P 3306 -u root -p

# SMB on internal machine
ssh -L 445:192.168.1.20:445 user@10.10.10.5
→ smbclient //127.0.0.1/share
```

---

### One Line Summary

```
-L  LOCAL_PORT : WHERE_VICTIM_CONNECTS_TO : ON_WHICH_PORT
                  (from victim's perspective)
```

You open a port **on your machine**, traffic flows through the SSH tunnel, and **victim makes the final connection** to the destination. The destination can be victim itself (`127.0.0.1`) or any host victim can reach on the internal network.