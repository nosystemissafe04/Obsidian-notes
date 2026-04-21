```SHELL
sudo masscan -e tun0 -p0-65535,U:0-65535 <target> --rate=750 | tee scan-output
```