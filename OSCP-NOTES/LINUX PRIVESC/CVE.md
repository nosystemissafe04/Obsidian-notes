```SHELL
sudo masscan -e tun0 -p0-65535,U:0-65535 $TARGET --rate=750 | tee blunder.masscan
```