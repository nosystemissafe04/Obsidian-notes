
## ## DNS Enumeration

### HOST

- find the IP address of  **www.megacorpone.com** .

```shell
host www.megacorpone.com

www.megacorpone.com has address 149.56.244.87
```

- `-t` to query different dns records

- Each server has a different priority (10, 20, 50, 60) and the server with the lowest priority number will be used first to forward mail addressed to the **megacorpone.com domain** (**fb.mail.gandi.net**).

```
kali@kali:~$ host -t mx megacorpone.com
megacorpone.com mail is handled by 10 fb.mail.gandi.net.
megacorpone.com mail is handled by 20 spool.mail.gandi.net.
megacorpone.com mail is handled by 50 mail.megacorpone.com.
megacorpone.com mail is handled by 60 mail2.megacorpone.com.
```

#### Bash one liner 
 -  Bash one-liner to attempt to resolve each hostname.

```SHELL
for ip in $(cat list.txt); do host $ip.megacorpone.com; done

www.megacorpone.com has address 149.56.244.87
Host ftp.megacorpone.com not found: 3(NXDOMAIN)
mail.megacorpone.com has address 51.222.169.212
Host owa.megacorpone.com not found: 3(NXDOMAIN)
Host proxy.megacorpone.com not found: 3(NXDOMAIN)
router.megacorpone.com has address 51.222.169.214
```

 - bash one-liner to attempt to resolve Ptr records or reverse dns lookups . 
```shell
for ip in $(seq 200 254); do host 51.222.169.$ip; done | grep -v "not found"
...
208.169.222.51.in-addr.arpa domain name pointer admin.megacorpone.com.
209.169.222.51.in-addr.arpa domain name pointer beta.megacorpone.com.
210.169.222.51.in-addr.arpa domain name pointer fs1.megacorpone.com.
211.169.222.51.in-addr.arpa domain name pointer intranet.megacorpone.com.
212.169.222.51.in-addr.arpa domain name pointer mail.megacorpone.com.
213.169.222.51.in-addr.arpa domain name pointer mail2.megacorpone.com.
214.169.222.51.in-addr.arpa domain name pointer router.megacorpone.com.
215.169.222.51.in-addr.arpa domain name pointer siem.megacorpone.com.
216.169.222.51.in-addr.arpa domain name pointer snmp.megacorpone.com.
217.169.222.51.in-addr.arpa domain name pointer syslog.megacorpone.com.
218.169.222.51.in-addr.arpa domain name pointer support.megacorpone.com.
219.169.222.51.in-addr.arpa domain name pointer test.megacorpone.com.
220.169.222.51.in-addr.arpa domain name pointer vpn.megacorpone.com.
...
```

## Dnsrecon

- `-d` for domain-name 
- `-t` for type of enumeration 
```shell
dnsrecon -d megacorpone.com -t std
[*] std: Performing General Enumeration against: megacorpone.com...
[-] DNSSEC is not configured for megacorpone.com
[*] 	 SOA ns1.megacorpone.com 51.79.37.18
[*] 	 NS ns1.megacorpone.com 51.79.37.18
[*] 	 NS ns3.megacorpone.com 66.70.207.180
[*] 	 NS ns2.megacorpone.com 51.222.39.63
[*] 	 MX mail.megacorpone.com 51.222.169.212
[*] 	 MX spool.mail.gandi.net 217.70.178.1
[*] 	 MX fb.mail.gandi.net 217.70.178.217
[*] 	 MX fb.mail.gandi.net 217.70.178.216
[*] 	 MX fb.mail.gandi.net 217.70.178.215
[*] 	 MX mail2.megacorpone.com 51.222.169.213
[*] 	 TXT megacorpone.com Try Harder
[*] 	 TXT megacorpone.com google-site-verification=U7B_b0HNeBtY4qYGQZNsEYXfCJ32hMNV3GtC0wWq5pA
[*] Enumerating SRV Records
[+] 0 Records Found
```


- `-D` for subdomain-list 
- `-t` for bruteforcing
```shell
 dnsrecon -d megacorpone.com -D ~/list.txt -t brt
[*] Using the dictionary file: /home/kali/list.txt (provided by user)
[*] brt: Performing host and subdomain brute force against megacorpone.com...
[+] 	 A www.megacorpone.com 149.56.244.87
[+] 	 A mail.megacorpone.com 51.222.169.212
[+] 	 A router.megacorpone.com 51.222.169.214
[+] 3 Records Found
```


## Dnsenum

```
kali@kali:~$ dnsenum megacorpone.com
...
dnsenum VERSION:1.2.6

-----   megacorpone.com   -----

...

Brute forcing with /usr/share/dnsenum/dns.txt:
_______________________________________________

admin.megacorpone.com.                   5        IN    A        51.222.169.208
beta.megacorpone.com.                    5        IN    A        51.222.169.209
fs1.megacorpone.com.                     5        IN    A        51.222.169.210
intranet.megacorpone.com.                5        IN    A        51.222.169.211
mail.megacorpone.com.                    5        IN    A        51.222.169.212
mail2.megacorpone.com.                   5        IN    A        51.222.169.213
ns1.megacorpone.com.                     5        IN    A        51.79.37.18
ns2.megacorpone.com.                     5        IN    A        51.222.39.63
ns3.megacorpone.com.                     5        IN    A        66.70.207.180
router.megacorpone.com.                  5        IN    A        51.222.169.214
```

## Nslookup (windows)

- for assumed breach scenerario and is avaialable in windows if we have windows

```shell
C:\Users\student>nslookup mail.megacorptwo.com
DNS request timed out.
    timeout was 2 seconds.
Server:  UnKnown
Address:  192.168.50.151

Name:    mail.megacorptwo.com
Address:  192.168.50.154
```

- The output above shows we queried the default DNS server (192.168.50.151) to resolve the IP address of mail.megacorptwo.com, which the DNS server then answered with "192.168.50.154".

```shell
C:\Users\student>nslookup -type=TXT info.megacorptwo.com 192.168.50.151
Server:  UnKnown
Address:  192.168.50.151

info.megacorptwo.com    text =

        "greetings from the TXT record body"
```


## Port scanning with nmap 

- To deal with large volumes of hosts, or to otherwise try to conserve network traffic, we can attempt to probe targets using _Network Sweeping_ techniques in which we begin with broad scans, then use more specific scans against hosts of interest.


``` shell
nmap -p 80 192.168.50.1-253 -oG web-sweep.txt
grep open web-sweep.txt | cut -d" " -f2
```

### NSE scripts

- The _http-headers_ script, for example, attempts to connect to the HTTP service on a target system and determine the supported headers.

```shell
kali@kali:~$ nmap --script http-headers 192.168.50.6
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 13:53 EST
Nmap scan report for 192.168.50.6
Host is up (0.14s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
| http-headers:
|   Date: Thu, 10 Mar 2022 18:53:29 GMT
|   Server: Apache/2.4.41 (Ubuntu)
|   Last-Modified: Thu, 10 Mar 2022 18:51:54 GMT
|   ETag: "d1-5d9e1b5371420"
|   Accept-Ranges: bytes
|   Content-Length: 209
|   Vary: Accept-Encoding
|   Connection: close
|   Content-Type: text/html
|
|_  (Request type: HEAD)

Nmap done: 1 IP address (1 host up) scanned in 5.11 seconds
```

- we can use the `--script-help` option, which displays a description of the script and a URL where we can find more in-depth information,

```shell
kali@kali:~$ nmap --script-help http-headers
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 13:54 EST

http-headers
Categories: discovery safe
https://nmap.org/nsedoc/scripts/http-headers.html
  Performs a HEAD request for the root folder ("/") of a web server and displays the HTTP headers returned.
...
```

## Network enumeration with windows

- The [_Test-NetConnection_](https://docs.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection?view=windowsserver2022-ps) function checks if an IP responds to ICMP and whether a specified TCP port on the target host is open.

```shell
PS C:\Users\student> Test-NetConnection -Port 445 192.168.50.151

ComputerName     : 192.168.50.151
RemoteAddress    : 192.168.50.151
RemotePort       : 445
InterfaceAlias   : Ethernet0
SourceAddress    : 192.168.50.152
TcpTestSucceeded : True
```

### Powershell oneliner to scan open ports

-  we need to instantiate a _TcpClient_ Socket object as _Test-NetConnection_ to send additional traffic that is not needed for our purposes.

```powershell
PS C:\Users\student> 1..1024 | % {echo ((New-Object Net.Sockets.TcpClient).Connect("192.168.50.151", $_)) "TCP port $_ is open"} 2>$null
TCP port 88 is open
...
```


## ## SMB Enumeration

- **NetBIOS Service Ports**:
    
    - Listens on **TCP port 139** and multiple **UDP ports**.
        
- **SMB Service**:
    
    - Listens on **TCP port 445**.
        
    - **SMB** and **NetBIOS** are **separate protocols**.
        
- **NetBIOS Details**:
    
    - Acts as a **session layer protocol** for local network communication.
        
    - **NBT (NetBIOS over TCP/IP)** is used for **backward compatibility**.
        
- **Modern Implementations**:
    
    - **SMB** can operate **without** NetBIOS.
        
    - However, **both are often enabled together** for legacy support.
        
- **Enumeration Techniques**:
    
    - NetBIOS and SMB are typically enumerated **together** during scans.
        
    - Tools like **nmap** can be used to scan these services.


```shell
kali@kali:~$ nmap -v -p 139,445 -oG smb.txt 192.168.50.1-254

kali@kali:~$ cat smb.txt
# Nmap 7.92 scan initiated Thu Mar 17 06:03:12 2022 as: nmap -v -p 139,445 -oG smb.txt 192.168.50.1-254
# Ports scanned: TCP(2;139,445) UDP(0;) SCTP(0;) PROTOCOLS(0;)
Host: 192.168.50.1 ()	Status: Down
...
Host: 192.168.50.21 ()	Status: Up
Host: 192.168.50.21 ()	Ports: 139/closed/tcp//netbios-ssn///, 445/closed/tcp//microsoft-ds///
...
Host: 192.168.50.217 ()	Status: Up
Host: 192.168.50.217 ()	Ports: 139/closed/tcp//netbios-ssn///, 445/closed/tcp//microsoft-ds///
# Nmap done at Thu Mar 17 06:03:18 2022 -- 254 IP addresses (15 hosts up) scanned in 6.17 seconds
```

#### ##Netbios specific tool 

- We can use this to query the NetBIOS name service for valid NetBIOS names, specifying the originating UDP port as 137 with the `-r` option.

```shell
kali@kali:~$ sudo nbtscan -r 192.168.50.0/24
Doing NBT name scan for addresses from 192.168.50.0/24

IP address       NetBIOS Name     Server    User             MAC address
------------------------------------------------------------------------------
192.168.50.124   SAMBA            <server>  SAMBA            00:00:00:00:00:00
192.168.50.134   SAMBAWEB         <server>  SAMBAWEB         00:00:00:00:00:00
...
```