**FIRST MASSSCAN AND THEN NMAP MASSCAN WILL SCAN IT FAST A HUGE NUMBER OF PORTS**
```SHELL
sudo masscan -e tun0 -p0-65535,U:0-65535 $TARGET --rate=750 | tee blunder.masscan
```

```SHELL
sudo nmap -vvv -Pn -sCV -T5 --reason -p80 -oN BLUNDER.NMAP <TARGET>
```

**SPIDER THE HOST WITH BURP**
- *ENABLE INTERCEPT SERVER RESPONSE*
- *ADD THE SITE TO SCOPE AND FILTER TO ONLY SHOW THE WEBSITE IN BURP*

**VIEW SOURCE CODE OF WEBSITE**
USE FIND FUNCTION TO FIND COMMENT AND OTHER KEYWORD LIKE PASS , KEY , TOKEN

**CHECK FOR DIRECTORY LISTING**

**BASH FOO TO SCRAP LINK FROM A WEBPAGE**
```SHELL
curl -s <target> | grep -Eo '(href|src)=".*"' | sed -r 's/(href|src)=//g' | tr -d '"' | sort
```
grep -E = extended regex , o = only-the-occurance which is the string after href and src
sed -r = extended regex , s for subsitute href and src to nothing 
tr -d = delete the character
sort the whole thing 

**GITHUB ENUMERATION**
-  GO TO THE CMS OR OTHER SOFTWARE IF THE TARGET IS USING ONE , AND SEARCH FOR FILES IN THE PROJECT EX: DATABASE , ADMIN,PASSWORD,TOKEN
- CHECK THE 
