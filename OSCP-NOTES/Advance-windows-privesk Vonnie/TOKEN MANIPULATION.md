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
