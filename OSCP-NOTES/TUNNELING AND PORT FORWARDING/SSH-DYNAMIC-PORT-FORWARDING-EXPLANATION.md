### SSH Dynamic Port Forwarding — Full Breakdown

---

### Syntax

bash

```bash
ssh -D [LOCAL_PORT] [USER]@[SSH_SERVER]
```

---

### Breaking Down Each Part

```
ssh -D   1080      user@victim_ip
          │              │
          │              └── Who you SSH into (jump host)
          └──────────────── SOCKS5 proxy port that opens on YOUR machine
```

#### Notice — No destination IP or port!

```
-L  8080 : 127.0.0.1 : 80   user@victim   ← fixed destination
-D  1080                     user@victim   ← NO fixed destination
                                              destination decided later
                                              by each tool/request
```

---

### The KEY Mental Model

> **With `-L` you forward ONE specific port to ONE destination. With `-D` you open a SOCKS5 proxy — victim forwards to ANYWHERE on demand.**

```
-L  →  One pipe, fixed destination
-D  →  Open proxy, infinite destinations, decided at request time
```

---

### Visual Flow

```
YOUR KALI                    VICTIM (SSH Server)         ANYWHERE VICTIM CAN REACH
─────────────────────────    ───────────────────         ─────────────────────────

proxychains nmap 192.168.1.0/24
        │
        │  traffic goes to local SOCKS5 proxy
        │  on 127.0.0.1:1080
        ▼
  SOCKS5 proxy says
  "where do you want to go?"
  tool says "192.168.1.20:445"
        │
        │  SSH tunnel carries
        │  the request ──────────────► SSH Daemon receives
                                       "connect to 192.168.1.20:445"
                                             │
                                             │ victim makes
                                             │ the connection
                                             ▼
                                       192.168.1.20:445  ✅
                                       192.168.1.30:80   ✅
                                       192.168.1.40:3306 ✅
                                       (any host, any port
                                        victim can reach)
```

---

### How Proxychains Fits In

Proxychains is the **middleman** that takes any tool's traffic and **pushes it through your SOCKS5 proxy**.

#### Step 1 — Configure proxychains

bash

```bash
# Edit /etc/proxychains.conf (or proxychains4.conf)

# At the very bottom, replace or add:
socks5  127.0.0.1  1080
#         ↑            ↑
#    your kali    port you chose in -D
```

#### Step 2 — Start the tunnel

bash

```bash
ssh -D 1080 user@victim_ip
#       ↑
#  must match what you put in proxychains.conf
```

#### Step 3 — Prepend proxychains to any tool

bash

```bash
proxychains nmap -sT -Pn 192.168.1.20
proxychains evil-winrm -i 192.168.1.20 -u admin -p password
proxychains crackmapexec smb 192.168.1.0/24
proxychains curl http://192.168.1.30
proxychains smbclient //192.168.1.20/share
```

---

### Full Picture With Proxychains

```
YOUR KALI                        VICTIM                  INTERNAL NETWORK
──────────────────               ──────────────          ────────────────

proxychains evil-winrm
-i 192.168.1.20                                          192.168.1.20
        │                                                (WinRM :5985)
        │                                                      ▲
        ▼                                                      │
proxychains                                                    │
intercepts traffic                                             │
        │                                                      │
        ▼                                                      │
SOCKS5 proxy                                                   │
127.0.0.1:1080                                                 │
        │                                                      │
        │──── SSH tunnel ────►  SSH daemon  ────connects to────┘
                                on victim
```

---

### -L vs -D Side by Side

```
SCENARIO: You want to reach internal network 192.168.1.0/24
          Victim is your only way in

WITH -L (you'd need one line per target):
────────────────────────────────────────
ssh -L 4445:192.168.1.20:445 user@victim   # only reaches .20:445
ssh -L 5986:192.168.1.30:80  user@victim   # only reaches .30:80
ssh -L 3307:192.168.1.40:3306 user@victim  # only reaches .40:3306
→ tedious, one tunnel per service


WITH -D (one line covers everything):
──────────────────────────────────────
ssh -D 1080 user@victim
proxychains nmap 192.168.1.0/24            # scans whole subnet
proxychains evil-winrm -i 192.168.1.20     # hits .20
proxychains curl http://192.168.1.30       # hits .30
proxychains mysql -h 192.168.1.40          # hits .40
→ one tunnel, reach everything
```

---

### Important Proxychains Tips for OSCP

bash

```bash
# 1. nmap with proxychains MUST use -sT (TCP connect scan)
#    -sS (SYN scan) does NOT work through SOCKS
proxychains nmap -sT -Pn -p 80,443,445,3389,5985 192.168.1.20

# 2. Use quiet mode to reduce proxychains noise
proxychains -q nmap -sT -Pn 192.168.1.20

# 3. For web browsing through proxy — use firefox
#    Settings → Network → Manual proxy → SOCKS5 127.0.0.1:1080

# 4. Run SSH with -N to not open a shell (cleaner)
ssh -D 1080 -N user@victim_ip
#        ↑
#    no shell opened, just tunnel
```

---

### One Line Summary

```
-D opens a SOCKS5 proxy on YOUR machine.
Victim becomes a gateway to its entire network.
Proxychains pushes any tool's traffic through that proxy.
You reach ANY host ANY port that victim can talk to.
```

---

### OSCP Cheatsheet — When to Use What

```
Service on victim's localhost only?
└──► ssh -L 8080:127.0.0.1:80 user@victim

One specific internal machine/port?
└──► ssh -L 8080:192.168.1.20:80 user@victim

Whole internal network / multiple hosts?
└──► ssh -D 1080 user@victim  +  proxychains

No SSH available, have shell on victim?
└──► chisel server (you) + chisel client R:socks (victim) + proxychains
```