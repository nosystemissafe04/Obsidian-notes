### https://sploitus.com
#public-exploits 

SIMILAR TO EXPLOIT-DB or ALTERNATIVE TO EXPLOIT-DB 

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

**CRACKING KEEPASS DATABASE FILE WITH HASHCAT**

```SHELL
keepass2john <hash.kdbx>
```

```shell
hashcat --example-hashes | grep -i keepass -B 1
```

ALWAYS PAY ATTENTION TO THE FORMAT HASHCAT REQUIRED , WHEN CONVERTING KEEPASS2JOHN WE WILL SEE THE USERNAME AT THE STARTING OF THE HASH AND HASHCAT DOES NOT HAVE THIS FORMAT OF THE HASH <mark class="hltr-myblue">FIX THE KEEPASS HASH BY REMOVING THE USERNAME AT THE STARTING OF THE HASH</mark> 

