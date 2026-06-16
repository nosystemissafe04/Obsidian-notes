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

**PINGING ACTIVE HOST ON THE NETWORK WITH FPING**

Where fping shines is in its ability to issue ICMP packets against a list of multiple hosts at once and its scriptability. Also, it works in a round-robin fashion, querying hosts in a cyclical manner instead of waiting for multiple requests to a single host to return before moving on.

Here we'll start `fping` with a few flags: `a` to show targets that are alive, `s` to print stats at the end of the scan, `g` to generate a target list from the CIDR network, and `q` to not show per-target results.

```BASH
fping -asgq 172.16.5.0/23
```

 We can combine the successful results and the information we gleaned from our passive checks into a list for a more detailed scan with Nmap

**NMAP SCANNING**
 it would be wise of us to focus on standard protocols typically seen accompanying AD services, such as DNS, SMB, LDAP, and Kerberos name a few. Below is a quick example of a simple Nmap scan.

```BASH
sudo nmap -v -A -iL hosts.txt -oN /home/htb-student/Documents/host-enum
```

**KERBRUTE - INTERNAL AD USERNAME ENUMERATION**
 It takes advantage of the fact that Kerberos pre-authentication failures often will not trigger logs or alerts
 - We will use Kerbrute in conjunction with the `jsmith.txt` or `jsmith2.txt`user lists from [Insidetrust](https://github.com/insidetrust/statistically-likely-usernames). This repository contains many different user lists that can be extremely useful when attempting to enumerate users when starting from an unauthenticated perspective.
 -  We can point Kerbrute at the DC we found earlier and feed it a wordlist.
 - To get started with Kerbrute, we can download [precompiled binaries](https://github.com/ropnop/kerbrute/releases/latest)

```SHELL
kerbrute userenum -d INLANEFREIGHT.LOCAL --dc 172.16.5.5 jsmith.txt -o valid_ad_users
```

## ENUMERATING THE PASSWORD POLICY FROM LINUX - CREDENTIALED

- password policy can also be obtained remotely using tools such as [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) or `rpcclient`.
```SHELL
crackmapexec smb 172.16.5.5 -u avazquez -p Password123 --pass-pol
```
OR 
```SHELL
nxc smb 172.16.5.5 -u avazquez -p Password123 --pass-pol
```

#### Enumerating the Password Policy - from Linux - SMB NULL Sessions
- SMB NULL sessions allow an unauthenticated attacker to retrieve information from the domain, such as a complete listing of users, groups, computers, user account attributes, and the domain password policy
- When creating a domain in earlier versions of Windows Server, anonymous access was granted to certain shares, which allowed for domain enumeration. An SMB NULL session can be enumerated easily. For enumeration, we can use tools such as `enum4linux`, `CrackMapExec`, `rpcclient`, etc.

```shell
rpcclient -U "" -N 172.16.5.5
rpcclient $> querydominfo
```

