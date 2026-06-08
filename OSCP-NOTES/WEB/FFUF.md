- RECURSION = -recursion 
- RECURSION-DEPTH = -recursion-depth num

more recursion = more time to complete the scan 

- specify extension with `-e .php` like this 

*we cannot add .php on fuzz string there maybe directory which will not resolve if the name does not match , so its better to do that it will scan the single string 2 time without ext and with ext so now we can find out which one are dirs and which are not*

- also add `-v` to show `full urls` otherwise we willnot find out which dir contain which file 

```bash
ffuf -w /opt/useful/seclists/Discovery/Web-Content/directory-list-2.3-small.txt:FUZZ -u http://SERVER_IP:PORT/FUZZ -recursion -recursion-depth 1 -e .php -v
```
