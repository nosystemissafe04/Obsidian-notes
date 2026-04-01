```bash
 sudo nmap 10.129.2.0/24 -sn -oA tnet | grep for | cut -d" " -f5
```
finding all the alive host on subnet and grepping to only display ip's

```bash
sudo nmap -sn -oA tnet -iL hosts.lst | grep for | cut -d" " -f5
```
giving a list of ip and performing host discovery and grepping to display IP only

```bash
 sudo nmap -sn -oA tnet 10.129.2.18 10.129.2.19 10.129.2.20| grep for | cut -d" " -f5
```
multiple IP 

```bash
sudo nmap -sn -oA tnet 10.129.2.18-20| grep for | cut -d" " -f5
```
range

```bash
sudo nmap 10.129.2.18 -sn -oA host -PE --packet-trace 
```
ICMP ECHO request (PE ) option . on local network but it will send arp request on local bcz the addressing is done on MAC in layer 2 so explicitly disbale arp we can use 

```bash
sudo nmap 10.129.2.18 -sn -oA host -PE --packet-trace --disable-arp-ping 
```

**TTL values can be used to identy between linux and windows hosts when doing host discovery  if the ttl is 126 or something along those numbers its windows and if the TTL is 64 to 62 its linux**
the above option `--disable-arp-ping ` will disable arp on local network and use ICMP for host discovery  in the response we get TTL values 
```bash
sudo nmap -sn 192.168.1.0-50 -vv --packet-trace  --disable-arp-ping  | grep "RCVD" 
```

