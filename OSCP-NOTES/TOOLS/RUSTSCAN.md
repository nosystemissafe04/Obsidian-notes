### RustScan Full Command Reference

bash

```bash
# Basic scan with ulimit
rustscan -a 10.10.10.5 --ulimit 5000

# Fast scan all ports
rustscan -a 10.10.10.5 --ulimit 65535 -b 65535

# Scan with nmap passthrough
rustscan -a 10.10.10.5 --ulimit 5000 -- -sV -sC

# Scan specific ports
rustscan -a 10.10.10.5 -p 22,80,443,445 --ulimit 5000

# Scan port range
rustscan -a 10.10.10.5 -r 1-65535 --ulimit 5000

# Scan with timeout (unstable networks)
rustscan -a 10.10.10.5 --ulimit 5000 -t 2000

# Scan whole subnet
rustscan -a 10.10.10.0/24 --ulimit 5000
```

### OSCP Recommended RustScan Workflow

bash

```bash
# Step 1 — Quick full port discovery
rustscan -a 10.10.10.5 --ulimit 5000 -- -sV -sC

# Step 2 — Feed open ports to nmap for deep scan
rustscan -a 10.10.10.5 --ulimit 5000 | grep Open
# take open ports, run detailed nmap

# Step 3 — Targeted nmap on found ports
nmap -sV -sC -p 22,80,443 -oN scan.txt 10.10.10.5
```