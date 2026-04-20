###### **sending mail via command line for phishing**
```shell
sudo swaks --to $(cat emails.txt | tr '\n' ',' | sed s/,$//g) --from support@sneakymail.htb --header "Subject: [ACTION REQUIRED] PLEASE REGISTER YOUR ACCOUNT" --body "the registration link <attacker-ip/route-to-phish>" --server <target-ip>
```

**interacting with imap**
```shell
nc <target> 143
```
IN IMAP WE HAVE TO USE AN IDENTIFYIER LIKE `A0001` AND WE WILL INCREMENT THIS VALUE 
```SHELL
A0001 Login <username> <password>
```

**LIST EVERYTHING**
```shell
A0002 LIST "" "*"
```

```SHELL
A0003 SELECT INBOX
```

dot notation to files in index folder 
```shell
A0004 SELECT "INBOX.Trash"
```

```shell
A0005 FETCH "inbox.send items"
```

```shell
A0006 FETCH 1 BODY.PEEK[]
```
