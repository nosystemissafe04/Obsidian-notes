```SHELL
sudo rm {*.md,*.txt,......regex}
```

**display where the tab is used in the data **
```shell
vim => :set list
```

**translate or delete character**
replace newline with comma 
```shell
cat emails.txt | tr '\n' ',' | sed s/,$//g
```
`$` end of the line then subsitute with this its enclosed in those slashes so nothing `//` `g` global

**sending mail via command line for phishing**
```shell
sudo swaks --to $(cat emails.txt | tr '\n' ',' | sed s/,$//g) --from support@sneakymail.htb --header "Subject: [ACTION REQUIRED] PLEASE REGISTER YOUR ACCOUNT" --body "the registration link <attacker-ip/route-to-phish>" --server <target-ip>
```

**hURL = hexadecimal and url encoder and decoder**
```shell
hurl --url <encoded command>
```

**FINDING ALL THE USERS ON THE SYSTEM VIA /etc/passwd file**
```shell
cat /etc/passwd | awk -F : 'print{$1, $7}' | grep -v /usr/sbin/nologin
```
