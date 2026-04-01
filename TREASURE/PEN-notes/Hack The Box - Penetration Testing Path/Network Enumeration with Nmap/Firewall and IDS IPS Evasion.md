#### ACK Scan
```bash
sudo nmap 10.129.2.28 -p 21,22,25 -sA -Pn -n --disable-arp-ping --packet-trace
```
we will get filtered or closed ports in this scan it is only to test things like if the packet is dropped or rejected if it is rejected . we will get port unreachable . if we get RST flag back we assume that port is accessible 
#### Detect IDS/IPS
these are passive monitoring system and hard todetect . we can use decoy IP to aggresivly scan the network if the ip is blocked we asssume some security measures are there in the network . we can use VERTUAL PRIVATE NETWORK . to scan the target and as a real alternative to findout ips ids 


#### Decoys
```bash
sudo nmap 10.129.2.28 -p 80 -sS -Pn -n --disable-arp-ping --packet-trace -D RND:5
```

- ##### Spoofing Source IP
```bash
sudo nmap 10.129.2.28 -n -Pn -p 445 -O -S 10.129.2.200 -e tun0
```

- ##### Spoofing Source Port

- ##### Spoofing MAC address

#### DNS Proxying
The DNS queries are made over the `UDP port 53`. The `TCP port 53` was previously only used for the so-called "`Zone transfers`" between the DNS servers or data transfer larger than 512 bytes. More and more, this is changing due to IPv6 and DNSSEC expansions. These changes cause many DNS requests to be made via TCP port 53.

However, `Nmap` still gives us a way to specify DNS servers ourselves (`--dns-server <ns>,<ns>`). This method could be fundamental to us if we are in a demilitarized zone (`DMZ`). The company's DNS servers are usually more trusted than those from the Internet. So, for example, we could use them to interact with the hosts of the internal network. As another example, we can use `TCP port 53` as a source port (`--source-port`) for our scans. If the administrator uses the firewall to control this port and does not filter IDS/IPS properly, our TCP packets will be trusted and passed through.

```bash
sudo nmap 10.129.2.28 -p50000 -sS -Pn -n --disable-arp-ping --packet-trace --source-port 53
```

poorly configured IDS/IPS 

```bash
 ncat -nv --source-port 53 10.129.2.28 50000
```

