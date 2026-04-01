NMAP stands for network mapper as the name suggests it help us to know what device are there in a network what is special about this tool is that we can dig deep into the network hosts like what are the ports open , closed or filtered and what are services running on a host on a particular port and what is the version of that service and we can scan for vulnerability in a service . there is a lot to study in this tool and network manager or n.sec use this tool as well as cyber.sec professional   

How nmap scans a slight overview  

Scanning a website or a server on the internet might seem abstract since it's running on a distant server. However, the process of scanning a website involves sending network requests to the server and analyzing the responses. Let me break down the process in simpler terms:  

IP Address: 

 Every website on the internet is hosted on a server with a unique IP address. This IP address is used to identify the server's location on the internet.  

Domain Name: We usually access websites using domain names (like www.example.com) instead of IP addresses. Domain names are translated into IP addresses using a system called DNS (Domain Name System).  

Network Packets: 

 When you initiate a scan using a tool like Nmap, it sends out a series of network packets to the IP address associated with the website's domain name.  

Port Scanning: Nmap sends these packets to different ports on the server. Ports are like doors on a computer that services (like web servers, email servers, etc.) use to communicate with the outside world. Different services listen on different ports.  

Responses: 

 Depending on the configuration of the server, it might respond differently to these packets. If a port is open and a service is running, the server might respond positively. If a port is closed, the response might indicate that. If a port is filtered, the server might not respond at all.  

Service Detection: Nmap also tries to determine the services running on the open ports by analyzing the responses. Different services have different ways of responding to network probes.  

Vulnerability Checks: 

 Nmap might use scripts or techniques to perform basic vulnerability checks on the identified services. These checks are often based on known vulnerabilities associated with specific services and versions.  

Data Collection:  

Nmap compiles all the information it receives into a report, which includes details about open ports, services, operating system, and potential vulnerabilities.  

To put it simply, scanning a website involves sending and receiving messages over the internet. Just like you can send a message to someone over the internet and get a response, scanning tools like Nmap send messages to servers and analyze the responses to gather information about the services running on those servers. This information can be used to assess potential vulnerabilities and security risks.  

What it means  

When you scan a server, you're not just scanning the website itself but also the various services and software running on that server. A website is typically hosted on a server that might be running several other services in addition to the web server. These services could include email servers, database servers, file servers, and more. 

Here's a breakdown of what you might discover by scanning a server hosting a website: 

Web Server Information: 

 You can find out what web server software is being used (e.g., Apache, Nginx, Microsoft IIS) and potentially its version. This information can be helpful in understanding the technology stack of the website. 

Open Ports: 

 The server might have multiple ports open, each associated with a different service. For example, port 80 is commonly used for HTTP (web) traffic, port 443 for HTTPS (secure web) traffic, port 25 for email, etc. 

Service Versions: 

 By analyzing the responses from open ports, you might determine the versions of the services running. This is valuable because certain versions might have known vulnerabilities that could be exploited by attackers. 

Operating System:  

Through certain techniques, you might be able to identify the operating system of the server. This can provide insights into the server's potential vulnerabilities based on the known vulnerabilities of that operating system. 

Vulnerability Assessment:  

Based on the information gathered, you might perform basic vulnerability checks using tools like Nmap's NSE scripts. These checks can help identify common vulnerabilities associated with the services detected. 

Configuration Issues:  

Some scans might reveal configuration issues or misconfigurations that could potentially lead to security vulnerabilities. 

Network Topology: 

 In some cases, scanning might provide information about the network structure and how various devices are connected. 

When we try to find the info about a website using whois we get the info about the domain registrant and other info of that website but when we try to execute whois on a ip of that website it shows us a netrange which means that all the ip's in this range are owned by that server and some more information about the server like  which company owns it and what organisation it belongs  




So every ip in a server represent a website there is a concept of vertual hosting or shared hosting and this type of infrastructure of sharing the same resources by multiple websites of single server is called shared hosting if the server only contain single website in it is called dedicated hosting which is not seen so often but there is a advantages or disadvantages of its own if dedicated hosting is used the website or admin have full control over a server and can inhance the performance and security of the server   

When you run the whois command followed by an IP address, it provides information about the IP address's ownership and allocation. This information can include details about the organization that owns the IP address range, contact information, and sometimes even information about the network's technical details. 

In the context of hosting multiple websites on a single server, you might observe that the range of IP addresses returned by the whois command points to the same organization or hosting provider. This can indicate that the organization is using a range of IP addresses for their server infrastructure, and each IP within that range is potentially assigned to a different website or service hosted on the same physical server. 

This type of setup is commonly used in shared hosting environments where resources of a single server are divided among multiple websites. Each website is assigned a specific domain name and IP address, but they all share the same physical server resources. 

When you scan one IP address within that range, you might be able to gather insights not only about that specific IP but also about the server infrastructure as a whole, potentially identifying other websites hosted on the same server, common services, and more. 

However, it's important to note that the exact relationship between IP addresses and hosted websites can be complex, and there could be variations in different hosting environments and configurations. Also, the information provided by whois might not always be up-to-date or accurate. Always approach this kind of analysis with caution and consider other factors as well. 

We can find out the site that are hosted on a server with certificate parsing  

We will continue it someday lets moveon


**nmap different result based on priviledge even after allowing pings on the box itself **
![[Pasted image 20250925234633.png]]

