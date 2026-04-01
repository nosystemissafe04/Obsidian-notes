It is recommended to perform a quick port scan first, which gives us a small overview of the available ports. This causes significantly less traffic,which is advantageous for us because otherwise we can be discovered and blocked by the security mechanisms
after the quick port scan we can enumrate all ports (-p-) with version detection in the background to save time suppose we have port 80 open we can start web enumeration and put the service and all tcp port scanning in the background to save time 
```bash
sudo nmap 10.129.2.28 -p- -sV
```

```bash
sudo nmap 10.129.2.28 -p- -sV --stats-every=5s
```
gives status of scans

```bash
sudo nmap 10.129.2.28 -p- -sV -v 
```
We can also increase the `verbosity level` (`-v` / `-vv`), which will show us the open ports directly when `Nmap` detects them.

**nbstat.nse and smb-os-discovery are the scripts which can help you idnentify hostname of the target if netbios and smb ports are open**
**and we can also use -A flag or -sC to run default scripts to know about the target but can take more time** 

sometimes nmap will not show us the information bcz it does not know how to handle that information . banner grabbing is done by default in nmap but sometime after a successful three-way handshake, the server often sends a banner for identification. This serves to let the client know which service it is working with. At the network level, this happens with a `PSH` flag in the TCP header. However, it can happen that some services do not immediately provide such information. It is also possible to remove or manipulate the banners from the respective services.
If we `manually` connect to the SMTP server using `nc`, grab the banner, and intercept the network traffic using `tcpdump`, we can see what `Nmap` did not show us.

**it is highly recommended that we should do manul recon on service which are of our interest we dont have to rely on tools solely **



