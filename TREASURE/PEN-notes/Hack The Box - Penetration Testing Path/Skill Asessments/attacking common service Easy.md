on easy lab there are 
	21 ftp
	25 smtp
	80 http
	443 https
	587 smtps
	3306 mysql
	3389 rdp

first i found the email address with smtp via a script which can bruteforce email addr via RCPT method 
now i have the user which i can use to bruteforce ftp . 
hydra is used to bruteforce ftp with 48 threads . i also tried to bruteforce smtp but didnt get it done . 
now i have creds i connected to the ftp server . i found 2 docs there suggesting these creds are also used on https 
i also checked http  there was xampp server running
i logged in on https via creds
found there is upload functionality i thought that maybe i can upload revshell and get the shell and its done php is used on the web . so treid that but failed then got into forum and found that we can also upload webshell or revshell via mysql . where the secure_file_priv variable was empty 
logged in to mysql with the same creds 
uploaded php webshell 
now all i need to is use the specified webroot and found the path via googling uploaded shell and the mistake i was doing is i was invoking the shell on https no http where the actual xampp server is running . then found out that only dir and whoami command are working via url?cmd=command . 
again gone to forum found out that we can also dump the flag with select load_file  now all i need is to find the path 
i treid but failed i used help from forum again and found out that admin desktop have the flag then used load_file to load the flag but again failed then i treid more command on arg on the url andi it worked 

again on forum i found there are other methods tooo to upload the shell . 
with ftp we can upload the shell to the webroot .

amazing box 


