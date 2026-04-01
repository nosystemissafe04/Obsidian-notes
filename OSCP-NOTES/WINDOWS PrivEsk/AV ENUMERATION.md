CMD
- SC - SERVICE CONTROL
	-  used to query services on windows 
	- `sc query windefend`
		- queried windows defender which is named as windefend 
		- `sc query`
			- this command will give all the services running on that machine ,we are not specifying the service we want to look at 
		- `sc queryex type=service`
			- The meaning of queryex is query+extended so we will get extended output more fields then query the defualt is set to type=service so just querying `sc queryex` will also give the same but more detailed output then sc query 

so this is the initial enumeration of services like antivirous and other programs which may hinder in our exploitation , we can get good info from about the type and version and can find out ways to bypass that or is there any kind of know vuln which can be exploited  

**sometimes it may not show the info you needed so find another route , like we may not find the version and application status from our priviledge about running services** 


- netsh - firewall
	- `netsh advfirewall firewall dump`
netsh advfirewall firewall dump outputs a complete, scriptable dump of the current Windows Firewall with Advanced Security configuration, while netsh firewall show state (legacy) shows a brief, human-readable status of the legacy firewall state such as profile on/off and a list of currently open ports.
	- `netsh firewall show state`
	- `netsh firewall show config`
		-  if we are using legacy cmd for filrewall enum then we can find out what ports are there which are filtered via firewall , like 4444 is very common one , if it is filtered , we can maybe use another port like 443 or 53 , finding about which ones are allowed for inbound connection can help us bypass the firewall 

