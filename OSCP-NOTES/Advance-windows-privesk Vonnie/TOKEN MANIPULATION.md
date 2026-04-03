### https://sploitus.com
#public-exploits 

**SIMILAR TO EXPLOIT-DB or ALTERNATIVE TO EXPLOIT-DB** 

**finding which wordlists to pick**

```shell
locate sharepoint
```

- most number of lines in the file and picking that one 
```shell
sudo find / -iname "*sharepoint*" -type f -exec wc -l {} + 2>/dev/null
```


> [!info] fact
> .docx files are zip files 

**grepping through dir-busting-results**
- chaining grep commands 
```shell
sudo grep --color =always -ni 'doc' tally.gobuster | grep 200
```

IF THERE IS WORKGROUP INFO AND HOSTNAME THEY BOTHS CAN COMBINE TO MAKE A FQDN IT MAY NOT WORK BUT STILL ITS A VALUEABLE INFO 

### FTP

**USING WGET TO MIRROR THE WHOLE FOLDER AND FILES OF FTP SERVER**

```SHELL
sudo wget --mirror --user=<username> --password=<'password'> ftp://<target-host>
```

> [!info]
> **ANOTHER TOOL FOR FTP INTERACTION <mark class="hltr-myblue">CURLFTPFS</mark>**
> 
> - mount remote ftp host as local directory  

**USING <mark class="hltr-green-flag">TREE</mark> COMMAND TO INTERACT WITH THE FTP SERVER MIRRORED FILES**
- -h for human readable files size , and <mark class="hltr-myblue">configure depth</mark> 
```SHELL
tree -h 
```

FOUND KEEPASS DATABASE 

### CRACKING KEEPASS

**CRACKING KEEPASS DATABASE FILE WITH HASHCAT**

```SHELL
keepass2john <hash.kdbx>
```

```shell
hashcat --example-hashes | grep -i keepass -B 1
```

ALWAYS PAY ATTENTION TO THE FORMAT HASHCAT REQUIRED , WHEN CONVERTING KEEPASS2JOHN WE WILL SEE THE USERNAME AT THE STARTING OF THE HASH AND HASHCAT DOES NOT HAVE THIS FORMAT OF THE HASH <mark class="hltr-myblue">FIX THE KEEPASS HASH BY REMOVING THE USERNAME AT THE STARTING OF THE HASH</mark> 

```SHELL
sudo hashcat -m 13400 hash.txt rockyou.txt
```

FOUND CREDENTIAL TO ACCESS AN SMB SHARE IN KEEPASS DATABASE 

### SMB

**ACCESSING SMB SHARE AND ENUMERATION ON SMB**

**NETEXEC**

```SHELL
nxc smb <targetip> -u '<username>' -p '<password>' --shares 
```

```shell
nxc smb <targetip> -u '<username>' -p '<password>' --users
```

```shell
nxc smb <targetip> -u '<username>' -p '<password>' --groups
```

**SMBMAP**

```SHELL
sudo smbmap -u 'finanace' -p 'password' -H <target-ip-OR-hostname>
```

```shell
sudo smbmap -u 'finanace' -p 'password' -H <target-ip-OR-hostname> -r <sharename>
```

**MOUNTING SMB SHARE ON LOCAL FILESYSTEM**

```SHELL
sudo mount -t cifs -o username=<username>,password=<password> \\\\<targetip>\\<sharename> path-to-mount-on
```
here -o means options with comma seperated , and `\\\\` there is only two backslashes required but another 2 is being added for escaping the backslash , we are on shell so it interprets them 

**USING TREE IN THE MOUNTED SMB SHARE**
WE WILL BE INCREASEING AND DECREASING THE LEVEL OF DEPTH IN SEARCHING THROUGH DIRECTORIES WITH `-L`

```SHELL
tree -L 2 
```

**LIGHT REVERSE ENGINEERING BINARY**
REMEMBER IN OSCP IT IS ADVANCE STUFF , <mark class="hltr-green-flag">SO ONLY STRINGS AND GREPPING THROUGH BINARY FILE IS ENOUGH</mark> , IF WE DONT FIND ANYTHING MOVE ON , 
FIRST WE ARE TESTER THEN WE ARE HACKER 

```shell
file <binary>
```

```SHELL
strings 
```
```SHELL
radare <binary>
> aaaa
> afl
```