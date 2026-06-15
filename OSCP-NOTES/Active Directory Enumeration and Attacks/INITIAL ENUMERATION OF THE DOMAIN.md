**POINTS TO LOOK FOR IN THIS PHASE**

- AD Users - enumerate valid user accounts we can target for password spraying 

- AD Joined Computers - computers including *domain controllers* , *file servers* , *SQL Servers* , *web servers* , *mail servers* , *database servers*

- key services - kerberos , Netbios , LDAP , DNS

- vulnerable hosts and services - anything that can be quick win ( an esy host to exploit and gain foothold)

**FOR INITIALS WE DID MONITOR NETWORK TRAFFIC TO GET TO KNOW ABOUT WHAT IS HAPPEININNG WE FOUND ARP AND MDNS PACKETS , WE FOUND SOME HOST**

USED TOOLS HERE 
- TCPDUMP
- WIRESHARK (GUI)
- NET-CREDS 
- NETMINER
- PKTMON.EXE(WINDOWS 10 BUILTIN)

AND THE ONE WHICH I DIDNT EXPECT TO SEE HERE **RESPONDER** TO ANALYZE NETWORK TRAFFIC 

[Responder](https://github.com/lgandx/Responder-Windows) is a tool built to listen, analyze, and poison `LLMNR`, `NBT-NS`, and `MDNS` requests and responses.

```BASH
sudo responder -I ens224 -A
```

