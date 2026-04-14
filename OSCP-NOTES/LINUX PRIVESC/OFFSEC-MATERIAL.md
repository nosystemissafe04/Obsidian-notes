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
/sbin/modinfo libata
```

**SETUID SETGID**




