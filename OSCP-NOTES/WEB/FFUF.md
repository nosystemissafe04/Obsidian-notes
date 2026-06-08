- RECURSION = -recursion 
- RECURSION-DEPTH = -recursion-depth num

more recursion = more time to complete the scan 

- specify extension with `-e .php` like this 

*we cannot add .php on fuzz string there maybe directory which will not resolve if the name does not match , so its better to do that it will scan the single string 2 time without ext and with ext so now we can find out which one are dirs and which are not*

- also add `-v` to show `full urls` otherwise we willnot find out which dir contain which file 

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/FUZZ -recursion -recursion-depth 1 -e .php -v
```

**DNS**

DNS PLAY A VITAL ROLE IF WE ADD A DOMAIN NAME ENTRY ON /etc/hosts file and then visit the website we may get new subdomains and new website running on it , so if we find a name add that and then start again directory busting 