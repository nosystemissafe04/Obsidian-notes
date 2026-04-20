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
- CHECK THE VERSION IN GITHUB AND RELEASES WITH FIND FUNCTION TO FIND HOW OLD IT IS AND FINDING OUT IF THERE ARE ANY PUBLIC EXPLOIT
- READ THE CHANGELOG TO FIND ANY FIXES ON UPGRADING THE VERSION WE HAVE WE CAN FIND A LOT OF INFO HERE , VULNERABILITY BEING FIXED IN THE UPGRADE 
- TO READ ABOUT WHAT WAS PATCHED , GO TO ISSUES AND CHANGE `OPEN` TO `CLOSED` ISSUE TO FIND THE THE FIXES HERE WE WILL FIND BLOG POSTS OF SECURITY RESEARCHERS AND PROOF OF CONCEPT
- TO FIND OUT OUR VERSION USE THE DATE OF PUBLISH OF AN UPGRADE TO FIND THE TIME FRAME OF LTS OF THAT VERSION
- GO TO `PULL REQUESTS` A DEVELOPER RAISES A PULL REQUEST TO CHANGE OR FIX SOMETHING OR CHANGE THE CODE FOR FIXING SOMEHTING THEY CAN RAISE A PULL REQUEST AND IF THE OG DEV  APPROVES IT , IT WILL BE COMMITTED , SOMETIMES YOU CAN GET WRITEUPS OF DIFFERENT VULNS 
- SIMILARLY CHANGE `OPEN` TO `CLOSED` PULL REQUESTS 
 
**FOUND A POC TO BYPASS BRUTEFORCE ACCOUNT LOCKOUT**

USING `sys` PYTHON MODULE TO GET THE WORDLIST FROM COMMAND LINE 
```PYTHON
import sys
with open(sys.argv[1]) as f:
	password=f.read().splitlines()
```
splitlines() = it will split the wordlist into list
the exploit will use over wordlists , which is password here 

**generating a wordlist with cewl**
```shell
sudo cewl <target-url> > wordlist.cewl
```

**benchmarking our bruteforce with time**
```shell
sudo time python3 poc.py <wordlist>
```

**exploiting a upload functionality**

*A LOT OF TIME WE SEE THE UPLOAD SANITIZATION BYPASS IS THE THE ATTACKER WILL USE THE MAGIC BYTES TO SPOOF THE FILE AS THE ONES WHICH ONES ARE ALLOWD LIKE JPEG AND PNG 
WHAT WE CAN DO IS DOWNLOAD THE A JPEG OR PNG OR WHATEVER IS SUPPORTED AND OPEN THAT IN VIM OR LESS AND COPY TEH FIRST BYTES OF THAT FILE TO GET THE MAGIC BYTE*

![[Pasted image 20260421030425.png]]

SOME TIMES BCZ OF ENCODING ISSUES WE MAY FAILTO DO THIS , THE OLD SCHOOL TECHNIQUE IS TO COPY IT FROM GOOGLE AND EDIT IT AND THEN REDIRECT THE STREAM DATA TO FILE , THIS WAY WE WILL NOT GET ENCODING ISSUES

*WE CAN ALSO GOOGLE SEARCH IT , JPEG MAGIC BYTES OR JPEG FILE SIGNATURE *

REPLACE `SPACE`  WITH `\x` ON THE MAGIC BYTE 

*RENAME THE JPEG FILE MOST LIKELY IT WILL BE SANITIZING OVER FILENAME WE CAN UPLOAD PHP FILE WITH `EXPLOIT.PHP.JPEG`*

**WHAT IS .htaccess**
means `hypertext access` its a per directory apache configuraton file . apache read it automatically when serving files from that directory . it lets you control apache behavior without touching the man server config 

###### 1. URL Rewriting

```apache
RewriteEngine On
RewriteRule ^(.*)$ index.php [QSA,L]
```

Routes all requests through index.php — used by Laravel, WordPress, CodeIgniter etc.

---

###### 2. Blocking/Allowing Access

```apache
# Block everyone
Deny from all

# Allow only specific IP
Allow from 192.168.1.1
```

---

###### 3. Enabling/Disabling PHP in a Directory

```apache
# Disable PHP execution in uploads folder
php_flag engine off

# This is a security measure — stops uploaded PHP files from executing
```

This is why many boxes have PHP disabled in `/uploads` — and why attackers try to overwrite `.htaccess` to turn it back on.

---

###### 4. Forcing File Types

```apache
# Treat all files as PHP regardless of extension
AddType application/x-httpd-php .jpg .png .txt
```

This is a dangerous one — if an attacker writes this to `.htaccess` in the uploads directory, your uploaded image becomes executable PHP.

---

###### 5. Password Protection

```apache
AuthType Basic
AuthName "Restricted"
AuthUserFile /etc/apache2/.htpasswd
Require valid-user
```

---

###### 6. Custom Error Pages

apache

```apache
ErrorDocument 404 /errors/notfound.html
```