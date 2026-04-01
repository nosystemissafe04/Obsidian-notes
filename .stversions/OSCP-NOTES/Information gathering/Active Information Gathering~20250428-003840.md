
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