**FIRST MASSSCAN AND THEN NMAP MASSCAN WILL SCAN IT FAST A HUGE NUMBER OF PORTS**
```SHELL
sudo masscan -e tun0 -p0-65535,U:0-65535 $TARGET --rate=750 | tee blunder.masscan
```

```SHELL
sudo nmap -vvv -Pn -sCV -T5 --reason -p80 -oN BLUNDER.NMAP <TARGET>
```

