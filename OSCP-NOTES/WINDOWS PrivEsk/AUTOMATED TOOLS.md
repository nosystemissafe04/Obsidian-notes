**WinPEAS** - [https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite/tree/master/winPEAS](https://github.com/carlospolop/privilege-escalation-awesome-scripts-suite/tree/master/winPEAS)

**Windows PrivEsc Checklist** - [https://book.hacktricks.xyz/windows/checklist-windows-privilege-escalation](https://book.hacktricks.xyz/windows/checklist-windows-privilege-escalation)

**Sherlock** - [https://github.com/rasta-mouse/Sherlock](https://github.com/rasta-mouse/Sherlock)

**Watson** - [https://github.com/rasta-mouse/Watson](https://github.com/rasta-mouse/Watson)

**PowerUp** - [https://github.com/PowerShellMafia/PowerSploit/tree/master/Privesc](https://github.com/PowerShellMafia/PowerSploit/tree/master/Privesc)

**JAWS** - [https://github.com/411Hall/JAWS](https://github.com/411Hall/JAWS)

**Windows Exploit Suggester** - [https://github.com/AonCyberLabs/Windows-Exploit-Suggester](https://github.com/AonCyberLabs/Windows-Exploit-Suggester)

**Metasploit Local Exploit Suggester** - [https://blog.rapid7.com/2015/08/11/metasploit-local-exploit-suggester-do-less-get-more/](https://blog.rapid7.com/2015/08/11/metasploit-local-exploit-suggester-do-less-get-more/)

**Seatbelt** - [https://github.com/GhostPack/Seatbelt](https://github.com/GhostPack/Seatbelt)

**SharpUp** - [https://github.com/GhostPack/SharpUp](https://github.com/GhostPack/SharpUp)

why these many tools , we need to know the process but it makes it tedious , 
we are going to use these tools , but for oscp they are not allowed to be used or maybe there is more to it 

every tool have some kind of dependency , what if one does not work , 
use another route 
we have these many and many more 
like if we have metasploit shell we can use metasploit local exploit suggester 
otherwise then we just need a sysinfo output and we can use windwos exploit suggester and paste
that into this tools which we can use to find more paths thats the least we can do with the box if nothing works just use that 

LIKE I FOUND THIS NEW TOOL

- **WESNG** - https://github.com/bitsadmin/wesng
	- USED PYTHON FTP SERVER(pyftpdlib -port -write) TO GET THE DATA OF SYSTEMINFO , (BCZ COPY PASTING WAS NOT WORKING BCZ OF FORMATTING INSSUE I FACED )
	- updated this tool `./wesng.py --update`
	- ran `./wesng.py systeminfo.txt > found-vuln`
	- `cat found-vuln | grep "CVE:" | awk -F'-' '{print $2"-"$3} > found-CVE'`
	- `for i in $(cat found-CVE);do searchsploit -cve $i | tee output.txt;done`

this is as low as you can go manually for finding vulns , and if we are using searchsploit we will not get accurate result for that perticular operating system maybe we need something more stable scripting for this to work in our favor but it was enjoyable to do this far 







