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

**ANOTHER TOOL CURLFTPFS**

- mount remote ftp host as local directory  