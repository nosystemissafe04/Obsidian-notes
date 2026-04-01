Domain information is a core component of any penetration test, and it is not just about the subdomains but about the entire presence on the Internet

This type of information is gathered passively without direct and active scans. In other words, we remain hidden and navigate as "customers" or "visitors" to avoid direct connections to the company that could expose us

1. the first thing we should do is scrutinize the company's `main website`. Then, we should read through the texts, keeping in mind what technologies and structures are needed for these services.
	
	For example, many IT companies offer app development, IoT, hosting, data science, and IT security services, depending on their industry. If we encounter a service that we have had little to do with before, it makes sense and is necessary to get to grips with it and find out what activities it consists of and what opportunities are available. Those services also give us a good overview of how the company can be structured.

	this part is the combination between the `first principle` and the `second principle` of enumeration [[Enumeration Principles#Enumeration Principles]]
	We pay attention to what `we see` and `we do not see`. We see the services but not their functionality. However, services are bound to certain technical aspects necessary to provide a service. Therefore, we take the developer's view and look at the whole thing from their point of view. This point of view allows us to gain many technical insights into the functionality.
	

when `passively` gathering information, we can use third-party services to understand the company better.

### Online Presence 
1. The first point of presence on the Internet may be the `SSL certificate` from the company's main website that we can examine. Often, such a certificate includes more than just a subdomain, and this means that the certificate is used for several domains, and these are most likely still active . it is possible to have a single cert used for different distinct domains .  wildcard cert which supports all the subdomain in the domain 
2. Another source to find more subdomains is [crt.sh](https://crt.sh/). This source is [Certificate Transparency](https://en.wikipedia.org/wiki/Certificate_Transparency) logs. Certificate Transparency is a process that is intended to enable the verification of issued digital certificates for encrypted Internet connections. The standard ([RFC 6962](https://tools.ietf.org/html/rfc6962)) provides for the logging of all digital certificates issued by a certificate authority in audit-proof logs. This is intended to enable the detection of false or maliciously issued certificates for a domain. SSL certificate providers like [Let's Encrypt](https://letsencrypt.org/) share this with the web interface [crt.sh](https://crt.sh/), which stores the new entries in the database to be accessed later.

#### Certificate Transparancy 
3. We can also output the results in JSON format.
```bash
curl -s https://crt.sh/\?q\=inlanefreight.com\&output\=json | jq .
```

OR

```bash
curl -s "https://crt.sh/?q=$1&output=json" | jq | grep "common_name" | sort -u | awk -F '"' '/",/ {print $4}'

OR (HTB)

curl -s https://crt.sh/\?q\=inlanefreight.com\&output\=json | jq . | grep name | cut -d":" -f2 | grep -v "CN=" | cut -d'"' -f2 | awk '{gsub(/\\n/,"\n");}1;' | sort -u
```
this will filter the output and only show the subdomains 
but if there are third-party involved we can more filter those subdomains bcz we can only scan those with permission 

```bash
for i in $(cat subd.txt); do host $i | grep "has address" | grep "sanmati" | awk '{print $1,"=>","\033[1;37m"$4"\033[0m"}'; done

OR (HTB)

 for i in $(cat subdomainlist);do host $i | grep "has address" | grep inlanefreight.com | cut -d" " -f1,4;done
```

we can enumerate all the ip to those subdomain and domains 
#### Company hosted servers 

4. Once we see which hosts can be investigated further, we can generate a list of IP addresses with a minor adjustment  and run them through `Shodan`.
```bash
for i in $(cat ip.txt | awk -F'=>' '{print $2}' | sort -u );do shodan host "$i";done
```

I created a script to do all this 
```bash
curl -s "https://crt.sh/?q=$1&output=json" | jq | grep "common_name" | sort -u | awk -F '"' '/",/ {print $4}' | tee subd.txt
read -p $'\033[1;31mDo you want to resolve these HOSTNAME to their IP (y/n)?\033[0m ' result
result=${result,,}
website=$(echo $1 | awk -F'.' '{print $1}')
if [[ "$result" == "y" ]]; then
	for i in $(cat subd.txt); do host "$i" | grep "has address" | grep "$website" | awk '{print $1,"=>","\033[1;37m"$4"\033[0m"}'; done | tee ip.txt
else
	echo "have a nice enumration :)"
fi
```
i did not integrate shodan in this script bcz **i dont know what is the reason but shodan is giving me error 403 forbidden so i dont see any thing running the above command for shodan if i could i can do more filteration and get more information as passive point of view **

```bash
0xxNosystemisSafe@htb[/htb]$ for i in $(cat subdomainlist);do host $i | grep "has address" | grep inlanefreight.com | cut -d" " -f4 >> ip-addresses.txt;done
0xxNosystemisSafe@htb[/htb]$ for i in $(cat ip-addresses.txt);do shodan host $i;done

10.129.24.93
City:                    Berlin
Country:                 Germany
Organization:            InlaneFreight
Updated:                 2021-09-01T09:02:11.370085
Number of open ports:    2

Ports:
     80/tcp nginx 
    443/tcp nginx 
	
10.129.27.33
City:                    Berlin
Country:                 Germany
Organization:            InlaneFreight
Updated:                 2021-08-30T22:25:31.572717
Number of open ports:    3

Ports:
     22/tcp OpenSSH (7.6p1 Ubuntu-4ubuntu0.3)
     80/tcp nginx 
    443/tcp nginx 
        |-- SSL Versions: -SSLv2, -SSLv3, -TLSv1, -TLSv1.1, -TLSv1.3, TLSv1.2
        |-- Diffie-Hellman Parameters:
                Bits:          2048
                Generator:     2
				
10.129.27.22
City:                    Berlin
Country:                 Germany
Organization:            InlaneFreight
Updated:                 2021-09-01T15:39:55.446281
Number of open ports:    8

Ports:
     25/tcp  
        |-- SSL Versions: -SSLv2, -SSLv3, -TLSv1, -TLSv1.1, TLSv1.2, TLSv1.3
     53/tcp  
     53/udp  
     80/tcp Apache httpd 
     81/tcp Apache httpd 
    110/tcp  
        |-- SSL Versions: -SSLv2, -SSLv3, -TLSv1, -TLSv1.1, TLSv1.2
    111/tcp  
    443/tcp Apache httpd 
        |-- SSL Versions: -SSLv2, -SSLv3, -TLSv1, -TLSv1.1, TLSv1.2, TLSv1.3
        |-- Diffie-Hellman Parameters:
                Bits:          2048
                Generator:     2
                Fingerprint:   RFC3526/Oakley Group 14
    444/tcp  
		
10.129.27.33
City:                    Berlin
Country:                 Germany
Organization:            InlaneFreight
Updated:                 2021-08-30T22:25:31.572717
Number of open ports:    3

Ports:
     22/tcp OpenSSH (7.6p1 Ubuntu-4ubuntu0.3)
     80/tcp nginx 
    443/tcp nginx 
        |-- SSL Versions: -SSLv2, -SSLv3, -TLSv1, -TLSv1.1, -TLSv1.3, TLSv1.2
        |-- Diffie-Hellman Parameters:
                Bits:          2048
                Generator:     2
```
HACK THE BOX module ouput after running shodan command 

#### DNS Records
```bash
dig any <domain>
```

***if this command does not show any output information try different dns server*** 

```bash
dig @8.8.8.8 any <domain>
```

you will probably get all the records 

- `A` records: We recognize the IP addresses that point to a specific (sub)domain through the A record. Here we only see one that we already know.
    
- `MX` records: The mail server records show us which mail server is responsible for managing the emails for the company. Since this is handled by google in our case, we should note this and skip it for now.
    
- `NS` records: These kinds of records show which name servers are used to resolve the FQDN to IP addresses. **Most hosting providers use their own name servers, making it easier to identify the hosting provider.**
    
- `TXT` records: this type of record often contains verification keys for different third-party providers and other security aspects of DNS, such as [SPF](https://datatracker.ietf.org/doc/html/rfc7208), [DMARC](https://datatracker.ietf.org/doc/html/rfc7489), and [DKIM](https://datatracker.ietf.org/doc/html/rfc6376), which are responsible for verifying and confirming the origin of the emails sent. Here we can already see some valuable information if we look closer at the results.
```bash
persistent.com.		3600	IN	TXT	"jamf-site-verification=CcuiUKCXXSz4z5bKQkxwvQ"
persistent.com.		3600	IN	TXT	"webexdomainverification.1AXU8=9dbe04eb-a813-4b5b-89ca-9fbeff982cf6"
persistent.com.		3600	IN	TXT	"MS=ms44481961"
persistent.com.		3600	IN	TXT	"duo_sso_verification=rkogbk99r0Tj0Z1gzLAecgQ6xLKSRGbM4aQxwJjXH4qyuFOqCw838luuLAGyMaLT"
persistent.com.		3600	IN	TXT	"apple-domain-verification=2iuZ8XXyWxJuom0E"
persistent.com.		3600	IN	TXT	"atlassian-domain-verification=7i0uI3NIeJlA4iSOvqb0Jp6B7wFAzJvoGad3it4UW8OT7e7KDvP1lC9vBXTRywFR"
persistent.com.		3600	IN	TXT	"webexdomainverification.4C675B8BC2A3B136E053AB06FC0A3F65=7615ae93-4ad2-4747-af8e-728f639a2f5e"
persistent.com.		3600	IN	TXT	"apple-domain-verification=b8OQ0SHh7TJsbY6B"
persistent.com.		3600	IN	TXT	"google-site-verification=XFI5j2XEoWSccG5IEGPvULylVoo7b023KxkIOJ98JEo"
persistent.com.		3600	IN	TXT	"google-site-verification=-PqVKljqtFt4Fh1sve5FszUkRxLJJO5NG5RkWioGBsM"
persistent.com.		3600	IN	TXT	"_globalsign-domain-verification=bATEx55hElKdzdli0bWJUaSx9ZXsM_baRMgkpRgNM_"
persistent.com.		3600	IN	TXT	"ibmid=a12d638f-85ec-4ca6-81b8-44569bd50640"
persistent.com.		3600	IN	TXT	"google-gws-recovery-domain-verification=39460385"
persistent.com.		3600	IN	TXT	"cisco-ci-domain-verification=6e763bc7095e7381209bddbae09783e88d747f73a6356150324af56932fa7518"
persistent.com.		3600	IN	TXT	"google-site-verification=qMjENSSBHmpscd_iHbWTZFD6vXXz8ZH46dncUBgv3Ec"
persistent.com.		3600	IN	TXT	"ms-domain-verification=ccbbb4aa-7bb5-471e-9ecb-b65d23817ddd"
persistent.com.		3600	IN	TXT	"amazonses:3Ju5DkekGdv52veN8q603NPIg0Mcwi55BgQiTpqSb88="
persistent.com.		3600	IN	TXT	"box-domain-verification=77390a5b1c410bc4976db5047bbe1ca56cfe15aea3b2768945f7c4b5b57a1863"
persistent.com.		3600	IN	TXT	"flexera-domain-verification-llwbjyiutuczxmkb"
persistent.com.		3600	IN	TXT	"w/DeVc+wJTzanXXnpHe+NxSJFgNBM/MZjhY+XhCeMumwRH7CIfD2NXtufDDixtjBf3yjpObKRcUW+nx7NJsugw=="
persistent.com.		3600	IN	TXT	"v=spf1 exists:%{i}._i.%{d}._d.espf.dmp.cisco.com include:%{d}.11.spf-protect.dmp.cisco.com -all"
persistent.com.		3600	IN	TXT	"_globalsign-domain-verification=0kDrRM3qA8thhuJtMQJzwfIeStv3sXqX_sIPlI2rgW"
persistent.com.		3600	IN	TXT	"pardot600091=162ef2375c4199ae9a342eb149e721eaa4bf58e95c42a31af5e944ce3b61270b"
persistent.com.		3600	IN	TXT	"google-site-verification=yMD3_yfaaHjLMVpjVmtAnEZLvC9TeRjF9bmEtcjGKIc"
persistent.com.		3600	IN	TXT	"amazonses:IiHwOVmU/2xYZt7M/sO4njDqPVJiyFjtXejTifqICNk="
persistent.com.		3600	IN	TXT	"adobe-sign-verification=ec5ca6f16a8415a3fa66d90a32b573b7"
```

here we see extra information and thirdparty involved these are verification keys 

we could see 
- jamf
- webex
- apple
- atlanssian
- google
- ibm
- cisco
- amazon
- flexera
- adobe

For example, [Atlassian](https://www.atlassian.com/) states that the company uses this solution for software development and collaboration. If we are not familiar with this platform, we can try it for free to get acquainted with it.
[Google Gmail](https://www.google.com/gmail/) indicates that Google is used for email management. Therefore, it can also suggest that we could access open GDrive folders or files with a link.
amazon 
and like this we can have a prediction of which service is used for which perpose and then when we do more active enumration we can  varify things 

The last thing we see is **AWS**  This company seems to be a hosting provider where domains can be purchased and registered. **The TXT record with the "MS" value is often used to confirm the domain. In most cases, it is similar to the username or ID used to log in to the management platform**.


