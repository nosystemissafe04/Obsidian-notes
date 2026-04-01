When Nmap sends a packet, it takes some time (`Round-Trip-Time` - `RTT`) to receive a response from the scanned port.
default 100ms 
`--min-rate` and `--max-rate` 
min-rate will tell nmap at least the specified amount of packets should be send in 1 second it will speed up the scan 
max rate will tell nmap that it will not send more than this much packets as specified in 1 second 

we can use this to range the packet sending speed as per our need 
```bash
sudo nmap 192.168.1.1 --min-rate 300 --max-rate 500
```
![[recording-multitrack-2024-09-17T06-34-21-513Z.wav]]
another way to get extra speed in you scans is with timing templates
![[Pasted image 20240917121925.png]]

