SYSTEMINFO
- HOSTNAME
- OPERATING SYSTEM 
- MANUFACTURE 
- OWNER 
- ARCHITECHTURE 
- A TON OF INFO 
- `systeminfo | findstr /B /C "OS Name" /C:"OS Version" /C:"System Type"`^oneliner
- **finding public exploit and generating one , we need this info to match the criteria of the machine prior to running the exploit **

HOSTNAME
- `hostname`

QUICK FIX ENGINEERING 
- `wmic qfe`
	- extract patching 
	- kbid (knowledge base ID) 
	- hotfixid
	- who installed it 
	- the date of installation 
- `wmic qfe get Caption,Description,HotFixID,InstalledOn`^oneliner
	- quick one liner 

DRIVES
- `wmic logicaldisk`
- [ ] `wmic logicaldisk get caption,description,providername`^oneliner