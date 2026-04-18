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

**sending mail via command line**
```shell
sudo swaks --to $(cat emails.txt | tr '\n' ',' | sed s/,$//g) --from support@sneakymail.htb --header "Subject: [ACTION REQUIRED] PLEASE REGISTER YOUR ACCOUNT" --body "the registration link <attacker-ip/route-to-phish>" --server <target-ip>
```