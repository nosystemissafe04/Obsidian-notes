**regular-exp** ^regex
```SHELL
sudo rm {*.md,*.txt,......regex}
```

###### **display where the tab is used in the data **
```shell
vim => :set list
```

###### **replace newline with comma**
translate or delete character
```shell
cat emails.txt | tr '\n' ',' | sed s/,$//g
```
`$` end of the line then subsitute with this its enclosed in those slashes so nothing `//` `g` global

###### **sending mail via command line for phishing**
```shell
sudo swaks --to $(cat emails.txt | tr '\n' ',' | sed s/,$//g) --from support@sneakymail.htb --header "Subject: [ACTION REQUIRED] PLEASE REGISTER YOUR ACCOUNT" --body "the registration link <attacker-ip/route-to-phish>" --server <target-ip>
```

###### **hURL = hexadecimal and url encoder and decoder**
```shell
hurl --url <encoded command>
```

###### **FINDING ALL THE USERS ON THE SYSTEM VIA /etc/passwd file**
```shell
cat /etc/passwd | awk -F : 'print{$1, $7}' | grep -v /usr/sbin/nologin
```

**finding all the files in the current folder**
INSTEAD OF GOING INTO EVERY DIR AND FINDING WHATS IN THEM WE CAN USE TREE OR FIND COMMAND TO GET THE SNAPSHOT OF WHATS IN THERE 
```SHELL
find . -type f 2>/dev/null
```

USE GREP TO EXCLUDE FILE EXTENSION WHICH ARE NOT USEFULL IN ENUMERATION MAKE IT CLEAN
```SHELL
find . -type f 2>/dev/null | grep -v "*.whl"
```

```shell
tree . 
```

###### **printing the process tree with ps**
```shell
ps auxwwf
```
`a`= all process
`u` = userlist
`w` = wide output add one more to get extra wide
`f` = full format

###### **FINDING THE HASH TYPE TO CRACK IT**

WE CAN USE HASHID AND OTHER TOOLS INCLUDING ONLINE ONE , BUT THE BEST I CAN FIND IS JUST GREP THE STARTING STRING OF THE HASH PIPED BY HASHCAT EXAMPLEHASHED ARG

```SHELL
hashcat --example-hashes | grep <STARTING-STRINGS-OF-HASH> -B1
```
SIMILARLY WE CAN PIPE THE OUTPUT TO VIM OR NVIM AND THEN SEARCH THERE 

###### **REMEMBER THERE IS A --USER FLAG IN HASHCAT**
```SHELL
HASHCAT -M MODE HASH WORDLIST --USER --FORCE
```

**how to find **











