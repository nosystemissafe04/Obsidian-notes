ipconfig
- `ipconfig`
- `ipconfig /all` 
	- allows to view every network interface connected to the machine , we can find out 
		- ipv4
		- ipv6
		- MAC addr
		- DNS
		- subnetmask 
			- to know which network the interface is connected to 
		- there can be more than one interface , knowing the subnet will allow us to know which subset of that network we are connected in 

ARP
- `arp -a`
	- address resolution protocol 
	- works on local resolution of mac address to there ip , using arp table the above command wil list all the content of arp table , 

ROUTE
- `route print`
	- tell us about routing table which packet will be forwarded to which gateway , as we discussed , there can be more then one network interface card or a client connected to multiple networks , or subnets or vpns 
	-  the computer can send the data packet directly to the destination address using its own network interface without forwarding it to a gateway is called **on-link** it can be wired or wireless 

NETSTAT
- `netstat -anl`
	- what ports are the machine listening on , we can find a lot of usefull info on services running on a machine on higher range ports and then enumerating those to find any path to escalate 
	- ipv4 , ipv6,tcp,udp 
	- with PID specified we can enumerate further to find out which program is running or daemon in linux nominclature 
	- some ports are only accessible on local network , we need to port forward to reach the service 