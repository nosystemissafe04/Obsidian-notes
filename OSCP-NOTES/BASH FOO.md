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
`$` end of the line then subsitute with this `//` `g` global
