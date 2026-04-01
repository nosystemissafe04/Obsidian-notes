`Server Message Block` (`SMB`) is a client-server protocol that regulates access to files and entire directories and other network resources such as printers, routers, or interfaces released for the network

In IP networks, SMB uses TCP protocol for this purpose, which provides for a three-way handshake between client and server before a connection is finally established. The specifications of the TCP protocol also govern the subsequent transport of data. We can take a look at some examples [here](https://winprotocoldoc.blob.core.windows.net/productionwindowsarchives/MS-SMB2/%5bMS-SMB2%5d.pdf#%5B%7B%22num%22%3A920%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C69%2C738%2C0%5D)

An SMB server can provide arbitrary parts of its local file system as shares. Therefore the hierarchy visible to a client is partially independent of the structure on the server. Access rights are defined by `Access Control Lists` (`ACL`). They can be controlled in a fine-grained manner based on attributes such as `execute`, `read`, and `full access` for individual users or user groups. The ACLs are defined based on the shares and therefore do not correspond to the rights assigned locally on the server.

## Samba

As mentioned earlier, there is an alternative variant to the SMB server, called Samba, developed for Unix-based operating system. Samba implements the `Common Internet File System` (`CIFS`) network protocol. [CIFS](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cifs/934c2faa-54af-4526-ac74-6a24d126724e) is a "dialect" of SMB. In other words, CIFS is a very specific implementation of the SMB protocol, which in turn was created by Microsoft. This allows Samba to communicate with newer Windows systems. Therefore, it usually is referred to as `SMB / CIFS`. However, CIFS is the extension of the SMB protocol. So when we pass SMB commands over Samba to an older NetBIOS service, it usually connects to the Samba server over TCP ports `137`, `138`, `139`, but CIFS uses TCP port `445` only. There are several versions of SMB, including outdated versions that are still used in specific infrastructures.

|**SMB Version**|**Supported**|**Features**|
|---|---|---|
|CIFS|Windows NT 4.0|Communication via NetBIOS interface|
|SMB 1.0|Windows 2000|Direct connection via TCP|
|SMB 2.0|Windows Vista, Windows Server 2008|Performance upgrades, improved message signing, caching feature|
|SMB 2.1|Windows 7, Windows Server 2008 R2|Locking mechanisms|
|SMB 3.0|Windows 8, Windows Server 2012|Multichannel connections, end-to-end encryption, remote storage access|
|SMB 3.0.2|Windows 8.1, Windows Server 2012 R2||
|SMB 3.1.1|Windows 10, Windows Server 2016|Integrity checking, AES-128 encryption|
With version 3, the Samba server gained the ability to be a full member of an Active Directory domain. With version 4, Samba even provides an Active Directory domain controller. It contains several so-called daemons for this purpose - which are Unix background programs. The SMB server daemon (`smbd`) belonging to Samba provides the first two functionalities, while the NetBIOS message block daemon (`nmbd`) implements the last two functionalities. The SMB service controls these two background programs.


We know that Samba is suitable for both Linux and Windows systems. In a network, each host participates in the same `workgroup`. A workgroup is a group name that identifies an arbitrary collection of computers and their resources on an SMB network. There can be multiple workgroups on the network at any given time.

IBM developed an `application programming interface` (`API`) for networking computers called the `Network Basic Input/Output System` (`NetBIOS`). The NetBIOS API provided a blueprint for an application to connect and share data with other computers. In a NetBIOS environment, when a machine goes online, it needs a name, which is done through the so-called `name registration` procedure. Either each host reserves its hostname on the network, or the [NetBIOS Name Server](https://networkencyclopedia.com/netbios-name-server-nbns/) (`NBNS`) is used for this purpose. It also has been enhanced to [Windows Internet Name Service](https://networkencyclopedia.com/windows-internet-name-service-wins/) (`WINS`).

## Default Configuration

As we can imagine, Samba offers a wide range of [settings](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) that we can configure. 

#### Default Configuration

```bash
0xxNosystemisSafe@htb[/htb]$ cat /etc/samba/smb.conf | grep -v "#\|\;" 

[global]
   workgroup = DEV.INFREIGHT.HTB
   server string = DEVSMB
   log file = /var/log/samba/log.%m
   max log size = 1000
   logging = file
   panic action = /usr/share/samba/panic-action %d

   server role = standalone server
   obey pam restrictions = yes
   unix password sync = yes

   passwd program = /usr/bin/passwd %u
   passwd chat = *Enter\snew\s*\spassword:* %n\n *Retype\snew\s*\spassword:* %n\n *password\supdated\ssuccessfully* .

   pam password change = yes
   map to guest = bad user
   usershare allow guests = yes

[printers]
   comment = All Printers
   browseable = no
   path = /var/spool/samba
   printable = yes
   guest ok = no
   read only = yes
   create mask = 0700

[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
```

We see global settings and two shares that are intended for printers. The global settings are the configuration of the available SMB server that is used for all shares. In the individual shares, however, the global settings can be overwritten, which can be configured with high probability even incorrectly. Let us look at some of the settings to understand how the shares are configured in Samba.

|**Setting**|**Description**|
|---|---|
|`[sharename]`|The name of the network share.|
|`workgroup = WORKGROUP/DOMAIN`|Workgroup that will appear when clients query.|
|`path = /path/here/`|The directory to which user is to be given access.|
|`server string = STRING`|The string that will show up when a connection is initiated.|
|`unix password sync = yes`|Synchronize the UNIX password with the SMB password?|
|`usershare allow guests = yes`|Allow non-authenticated users to access defined share?|
|`map to guest = bad user`|What to do when a user login request doesn't match a valid UNIX user?|
|`browseable = yes`|Should this share be shown in the list of available shares?|
|`guest ok = yes`|Allow connecting to the service without using a password?|
|`read only = yes`|Allow users to read files only?|
|`create mask = 0700`|What permissions need to be set for newly created files?|

## Dangerous Settings

Some of the above settings already bring some sensitive options. However, suppose we question the settings listed below and ask ourselves what the employees could gain from them, as well as attackers. In that case, we will see what advantages and disadvantages the settings bring with them. Let us take the setting `browseable = yes` as an example. If we as administrators adopt this setting, the company's employees will have the comfort of being able to look at the individual folders with the contents. Many folders are eventually used for better organization and structure. If the employee can browse through the shares, the attacker will also be able to do so after successful access.

|**Setting**|**Description**|
|---|---|
|`browseable = yes`|Allow listing available shares in the current share?|
|`read only = no`|Forbid the creation and modification of files?|
|`writable = yes`|Allow users to create and modify files?|
|`guest ok = yes`|Allow connecting to the service without using a password?|
|`enable privileges = yes`|Honor privileges assigned to specific SID?|
|`create mask = 0777`|What permissions must be assigned to the newly created files?|
|`directory mask = 0777`|What permissions must be assigned to the newly created directories?|
|`logon script = script.sh`|What script needs to be executed on the user's login?|
|`magic script = script.sh`|Which script should be executed when the script gets closed?|
|`magic output = script.out`|Where the output of the magic script needs to be stored?|

Let us create a share called `[notes]` and a few others and see how the settings affect our enumeration process. We will use all of the above settings and apply them to this share. For example, this setting is often applied, if only for testing purposes. If it is then an internal subnet of a small team in a large department, this setting is often retained or forgotten to be reset. This leads to the fact that we can browse through all the shares and, with high probability, even download and inspect them.

```bash
...SNIP...

[notes]
	comment = CheckIT
	path = /mnt/notes/

	browseable = yes
	read only = no
	writable = yes
	guest ok = yes

	enable privileges = yes
	create mask = 0777
	directory mask = 0777
```

It is highly recommended to look at the man pages for Samba and configure it ourselves and experiment with the settings. We will then discover potential aspects that will be interesting for us as a penetration tester. In addition, the more familiar we become with the Samba server and SMB, the easier it will be to find our way around the environment and use it for our purposes. Once we have adjusted `/etc/samba/smb.conf` to our needs, we have to restart the service on the server.

Now we can display a list (`-L`) of the server's shares with the `smbclient` command from our host. We use the so-called `null session` (`-N`) or `no-pass`, which is `anonymous` access without the input of existing users or valid passwords.

![[Pasted image 20240923175721.png]]

print and IPC are default shares 

Once we have discovered interesting files or folders, we can download them using the `get` command. Smbclient also allows us to execute local system commands using an exclamation mark at the beginning (`!<cmd>`) without interrupting the connection.

![[Pasted image 20240923180256.png]]

From the administrative point of view, we can check these connections using `smbstatus`. Apart from the Samba version, we can also see who, from which host, and which share the client is connected. This is especially important once we have entered a subnet (perhaps even an isolated one) that the others can still access.

![[Pasted image 20240923180801.png]]

For example, with domain-level security, the samba server acts as a member of a Windows domain. Each domain has at least one domain controller, usually a Windows NT server providing password authentication. This domain controller provides the workgroup with a definitive password server. The domain controllers keep track of users and passwords in their own `NTDS.dit` and `Security Authentication Module` (`SAM`) and authenticate each user when they log in for the first time and wish to access another machine's share.

### Footprinting the Service 
```bash
sudo nmap 10.129.14.128 -sV -sC -p139,445
```
always good to manully do the footprinting part to get more info .
#### Doubt ->[[TREASURE/PEN-notes/Hack The Box - Penetration Testing Path/Footprinting/Doubts#2024-09-23 18 36|Doubts]]

![[Pasted image 20240923192239.png]]
We can see from the results that it is not very much that Nmap provided us with here. Therefore, we should resort to other tools that allow us to interact manually with the SMB and send specific requests for the information. **One of the handy tools for this is `rpcclient`. This is a tool to perform MS-RPC functions.**

below is the section of a blog post which define `rpc` , `msrpc`,`rpcclient commands `, `AD enumeration` and supporting concept like `named pipes` , `IPC` and `IPC$` share in `SMB` .  

# ![juggernaut-sec explanation](https://juggernaut-sec.com/ad-recon-msrpc-over-smb/#Initial%20Enumeration%20-%20Nmap%20Scan) 
## MSRPC | RPC 
RPC - remote procedure call is a communication protocol which is used to request a service or other processes from a program located on another computer in a network as if the call were local to that computer . MSRPC is a microsoft implementation of RPC protocol

- an RPC is initiated by the client , which sends a request to a remote server to execute a specified procedure with supplied parameter 
- The RPC endpoint mapper can be accessed through TCP and UDP port 135 
- SMB ( To know all about named pipes and interprocess communication [[The Linux Programming Interface-Michael Kerrisk 1.pdf#page=921&offset=147,640|The Linux Programming Interface-Michael Kerrisk 1, 43: Interprocess Communication Overview ]]
- Named pipes and FIFO [[The Linux Programming Interface-Michael Kerrisk 1.pdf#page=933&offset=147,640|The Linux Programming Interface-Michael Kerrisk 1, 44: Pipes and FIFOs ]]
- [**named pipes**](https://www.youtube.com/watch?v=dhFkwGRSVGk) **named pipes in C ** 
- ![named pipes in C ](https://www.youtube.com/watch?v=2hba3etpoJg)
- using a null or authenticated session (TCP 139 and 445)
- as a web service listening on TCP port 593. Additionally, it is common to find RPC ports open on 49xxx, which are known as the “randomly allocated high TCP ports”.

**As mentioned above, RPC can utilize named pipes if SMB is open. This is HUGE for enumeration/exploitation as different named pipes allow for different operations.**
#### **MSRPC Over SMB – Named Pipes for Enumeration and Exploitation**

Since SMB is virtually ALWAYS open on a Windows host, it is highly-likely that the most common way that MSRPC will be leveraged for enumeration is over SMB named pipes (through the ![IPC$ share](https://www.youtube.com/watch?v=QOHyB94zG54&t=42s)). 
This is how most tools are setup to interact with RPC.

There are quite a few different named pipes utilized by MSRPC over SMB, they include the following:

- **/\pipe/\lsarpc** — Local Security Authority (LSA) – enumerate privileges, trust relationships, SIDs, policies and more.
- **/\pipe/\samr** — Local SAM Database – enumerate domain/local users, domain/local groups and more.
- **/\pipe/\svcctl** — Service Control Manager – remotely create, start, and stop services to execute commands
- **/\pipe/\atsvc** — Task Scheduler – remotely create scheduled tasks to execute commands
- **/\pipe/\epmapper** — Distributed Component Object Model (DCOM) supporting Windows Management Instrumentation (WMI) – remote command execution via WMI
- **/\pipe/\winreg** — Remote Registry Service – used to access the system registry

or our enumeration, we will be focusing primarily on two tools: **rpcclient** and **enum4linux**.

These tools allow us to gather a lot of really good information about the host and domain such as usernames, groups, password policy, etc. due to querying MSRPC over named pipes.

### **NetBIOS (Network Basic Input Output System) – Port 139**

Network Basic Input/Output System is an API that provides services related to the session layer of the OSI model.

The primary purpose of NetBIOS is to allow applications on separate computers to communicate over a local area network (LAN).

In modern networks, NetBIOS runs over TCP/IP via the NetBIOS over TCP/IP (NBT) protocol. As a result, each computer in the network will have both an IP address and a NetBIOS name that is up to 15 characters long and usually, separate from the computer name.

NetBIOS provides three distinct services over three different ports; however, when it comes to MSRPC over SMB, **we are most interested in the session service for connection-oriented communication (port: 139/tcp).** *This is because some techniques / tools utilize NetBIOS for RPC enumeration over port 139 similar to how port 445 is utilized in MSRPC over SMB.*

#### ROLE OF SMB
On modern Windows systems, SMB can run directly over TCP/IP on port 445. On other systems, we may find that some services and applications are using port 139. This means that SMB is running with NetBIOS over TCP/IP.

Various versions of SMB have been released over the years and have been made backwards-compatible. This means that devices with newer versions of Windows can easily communicate with devices that have an older Microsoft operating system installed.

### **SMB Default Administrative Shares**

Another thing to note about MSRPC over SMB are the default administrative shares, and what they are used for. Most notably, the **IPC$** share.

> Administrative shares are hidden network shares that allow system administrators to have remote access to every disk volume on a network-connected system. These shares may not be permanently deleted but may be disabled. Administrative shares cannot be accessed by users without administrative privileges.

In total, there are three default (hidden) administrative shares:

- **ADMIN$** — Used during remote administration of a computer.
- **C$** — Every disk volume on the system is shared as an administrative share.
- **IPC$** — A resource that shares the named pipes that are essential for communication between programs, such as remote administration of a computer or when viewing shared resources.

## its highly recommended to read the blog post by juggernaut [[#MSRPC RPC]] very detailed explanation about how someone can leverage SMB to enumrate the whole AD with msrpc or rpc 

# Back to HACK THE BOX 
The [Remote Procedure Call](https://www.geeksforgeeks.org/remote-procedure-call-rpc-in-operating-system/) (`RPC`) is a concept and, therefore, also a central tool to realize operational and work-sharing structures in networks and client-server architectures. The communication process via RPC includes passing parameters and the return of a function value

```bash
rpcclient -U "" 10.129.14.128

or

rpcclient 172.16.1.200 -N
```

testing if anonymous access is allowed or not . in our case it is allowed 

The `rpcclient` offers us many different requests with which we can execute specific functions on the SMB server to get information. A complete list of all these functions can be found on the [man page](https://www.samba.org/samba/docs/current/man-html/rpcclient.1.html) of the rpcclient.

| **Query** | **Description** |
| ---- | ---- |
| `srvinfo` | Server information. |
| `enumdomains` | Enumerate all domains that are deployed in the network. |
| `querydominfo` | Provides domain, server, and user information of deployed domains. |
| `netshareenumall` | Enumerates all available shares. |
| `netsharegetinfo <share>` | Provides information about a specific share. |
| `enumdomusers` | Enumerates all domain users. |
| `queryuser <RID>` | Provides information about a specific user. |
| `netfilegetsec <sharename> <file>` | provide access control list of a file in a share or get file security  |

```bash
rpcclient $> srvinfo

        DEVSMB         Wk Sv PrQ Unx NT SNT DEVSM
        platform_id     :       500
        os version      :       6.1
        server type     :       0x809a03
		
		
rpcclient $> enumdomains

name:[DEVSMB] idx:[0x0]
name:[Builtin] idx:[0x1]


rpcclient $> querydominfo

Domain:         DEVOPS
Server:         DEVSMB
Comment:        DEVSM
Total Users:    2
Total Groups:   0
Total Aliases:  0
Sequence No:    1632361158
Force Logoff:   -1
Domain Server State:    0x1
Server Role:    ROLE_DOMAIN_PDC
Unknown 3:      0x1


rpcclient $> netshareenumall

netname: print$
        remark: Printer Drivers
        path:   C:\var\lib\samba\printers
        password:
netname: home
        remark: INFREIGHT Samba
        path:   C:\home\
        password:
netname: dev
        remark: DEVenv
        path:   C:\home\sambauser\dev\
        password:
netname: notes
        remark: CheckIT
        path:   C:\mnt\notes\
        password:
netname: IPC$
        remark: IPC Service (DEVSM)
        path:   C:\tmp
        password:
		
		
rpcclient $> netsharegetinfo notes

netname: notes
        remark: CheckIT
        path:   C:\mnt\notes\
        password:
        type:   0x0
        perms:  0
        max_uses:       -1
        num_uses:       1
revision: 1
type: 0x8004: SEC_DESC_DACL_PRESENT SEC_DESC_SELF_RELATIVE 
DACL
        ACL     Num ACEs:       1       revision:       2
        ---
        ACE
                type: ACCESS ALLOWED (0) flags: 0x00 
                Specific bits: 0x1ff
                Permissions: 0x101f01ff: Generic all access SYNCHRONIZE_ACCESS WRITE_OWNER_ACCESS WRITE_DAC_ACCESS READ_CONTROL_ACCESS DELETE_ACCESS 
                SID: S-1-1-0
```

These examples show us what information can be leaked to anonymous users. Once an `anonymous` user has access to a network service, it only takes one mistake to give them too many permissions or too much visibility to put the entire network at significant risk.

Most importantly, anonymous access to such services can also lead to the discovery of other users, who can be attacked with brute-forcing in the most aggressive case

Let us see how we can enumerate users using the `rpcclient`.

```bash
enumdomusers

user:[mrb3n] rid:[0x3e8]
user:[cry0l1t3] rid:[0x3e9]


rpcclient $> queryuser 0x3e9

        User Name   :   cry0l1t3
        Full Name   :   cry0l1t3
        Home Drive  :   \\devsmb\cry0l1t3
        Dir Drive   :
        Profile Path:   \\devsmb\cry0l1t3\profile
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      Do, 01 Jan 1970 01:00:00 CET
        Logoff Time              :      Mi, 06 Feb 2036 16:06:39 CET
        Kickoff Time             :      Mi, 06 Feb 2036 16:06:39 CET
        Password last set Time   :      Mi, 22 Sep 2021 17:50:56 CEST
        Password can change Time :      Mi, 22 Sep 2021 17:50:56 CEST
        Password must change Time:      Do, 14 Sep 30828 04:48:05 CEST
        unknown_2[0..31]...
        user_rid :      0x3e9
        group_rid:      0x201
        acb_info :      0x00000014
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000000
        padding1[0..7]...
        logon_hrs[0..21]...


rpcclient $> queryuser 0x3e8

        User Name   :   mrb3n
        Full Name   :
        Home Drive  :   \\devsmb\mrb3n
        Dir Drive   :
        Profile Path:   \\devsmb\mrb3n\profile
        Logon Script:
        Description :
        Workstations:
        Comment     :
        Remote Dial :
        Logon Time               :      Do, 01 Jan 1970 01:00:00 CET
        Logoff Time              :      Mi, 06 Feb 2036 16:06:39 CET
        Kickoff Time             :      Mi, 06 Feb 2036 16:06:39 CET
        Password last set Time   :      Mi, 22 Sep 2021 17:47:59 CEST
        Password can change Time :      Mi, 22 Sep 2021 17:47:59 CEST
        Password must change Time:      Do, 14 Sep 30828 04:48:05 CEST
        unknown_2[0..31]...
        user_rid :      0x3e8
        group_rid:      0x201
        acb_info :      0x00000010
        fields_present: 0x00ffffff
        logon_divs:     168
        bad_password_count:     0x00000000
        logon_count:    0x00000000
        padding1[0..7]...
        logon_hrs[0..21]...
```

**the domain , user and group enumeration is done by the above blog post** [juggernaut blog ](https://juggernaut-sec.com/ad-recon-msrpc-over-smb/#User_Enumeration)
We can then use the results to identify the group's RID, which we can then use to retrieve information from the entire group.

**group enum by** [juggernaut](https://juggernaut-sec.com/ad-recon-msrpc-over-smb/#Group_Enumeration) 
```shell-session
querygroup 0x201

        Group Name:     None
        Description:    Ordinary Users
        Group Attribute:7
        Num Members:2
```


However, it can also happen that not all commands are available to us, and we have certain restrictions based on the user. However, the query `queryuser <RID>` is mostly allowed based on the RID. So we can use the rpcclient to brute force the RIDs to get information. Because we may not know who has been assigned which RID, we know that we will get information about it as soon as we query an assigned RID. There are several ways and tools we can use for this. To stay with the tool, we can create a `For-loop` using `Bash` where we send a command to the service using rpcclient and filter out the results.

```bash
for i in $(seq 500 1100);do rpcclient -N -U "" 10.129.14.128 -c "queryuser 0x$(printf '%x\n' $i)" | grep "User Name\|user_rid\|group_rid" && echo "";done

        User Name   :   sambauser
        user_rid :      0x1f5
        group_rid:      0x201
		
        User Name   :   mrb3n
        user_rid :      0x3e8
        group_rid:      0x201
		
        User Name   :   cry0l1t3
        user_rid :      0x3e9
        group_rid:      0x201
```

An alternative to this would be a Python script from [Impacket](https://github.com/SecureAuthCorp/impacket) called [samrdump.py](https://github.com/SecureAuthCorp/impacket/blob/master/examples/samrdump.py).

```bash
0xxNosystemisSafe@htb[/htb]$ samrdump.py 10.129.14.128

Impacket v0.9.22 - Copyright 2020 SecureAuth Corporation

[*] Retrieving endpoint list from 10.129.14.128
Found domain(s):
 . DEVSMB
 . Builtin
[*] Looking up users in domain DEVSMB
Found user: mrb3n, uid = 1000
Found user: cry0l1t3, uid = 1001
mrb3n (1000)/FullName: 
mrb3n (1000)/UserComment: 
mrb3n (1000)/PrimaryGroupId: 513
mrb3n (1000)/BadPasswordCount: 0
mrb3n (1000)/LogonCount: 0
mrb3n (1000)/PasswordLastSet: 2021-09-22 17:47:59
mrb3n (1000)/PasswordDoesNotExpire: False
mrb3n (1000)/AccountIsDisabled: False
mrb3n (1000)/ScriptPath: 
cry0l1t3 (1001)/FullName: cry0l1t3
cry0l1t3 (1001)/UserComment: 
cry0l1t3 (1001)/PrimaryGroupId: 513
cry0l1t3 (1001)/BadPasswordCount: 0
cry0l1t3 (1001)/LogonCount: 0
cry0l1t3 (1001)/PasswordLastSet: 2021-09-22 17:50:56
cry0l1t3 (1001)/PasswordDoesNotExpire: False
cry0l1t3 (1001)/AccountIsDisabled: False
cry0l1t3 (1001)/ScriptPath: 
[*] Received 2 entries.
```

The information we have already obtained with `rpcclient` can also be obtained using other tools. For example, the [SMBMap](https://github.com/ShawnDEvans/smbmap) and [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec) tools are also widely used and helpful for the enumeration of SMB services.

#### SMBmap


```bash
0xxNosystemisSafe@htb[/htb]$ smbmap -H 10.129.14.128

[+] Finding open SMB ports....
[+] User SMB session established on 10.129.14.128...
[+] IP: 10.129.14.128:445       Name: 10.129.14.128                                     
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        home                                                    NO ACCESS       INFREIGHT Samba
        dev                                                     NO ACCESS       DEVenv
        notes                                                   NO ACCESS       CheckIT
        IPC$                                                    NO ACCESS       IPC Service (DEVSM)
```

#### CrackMapExec

```bash
0xxNosystemisSafe@htb[/htb]$ crackmapexec smb 10.129.14.128 --shares -u '' -p ''

SMB         10.129.14.128   445    DEVSMB           [*] Windows 6.1 Build 0 (name:DEVSMB) (domain:) (signing:False) (SMBv1:False)
SMB         10.129.14.128   445    DEVSMB           [+] \: 
SMB         10.129.14.128   445    DEVSMB           [+] Enumerated shares
SMB         10.129.14.128   445    DEVSMB           Share           Permissions     Remark
SMB         10.129.14.128   445    DEVSMB           -----           -----------     ------
SMB         10.129.14.128   445    DEVSMB           print$                          Printer Drivers
SMB         10.129.14.128   445    DEVSMB           home                            INFREIGHT Samba
SMB         10.129.14.128   445    DEVSMB           dev                             DEVenv
SMB         10.129.14.128   445    DEVSMB           notes           READ,WRITE      CheckIT
SMB         10.129.14.128   445    DEVSMB           IPC$                            IPC Service (DEVSM)
```

Another tool worth mentioning is the so-called [enum4linux-ng](https://github.com/cddmp/enum4linux-ng), which is based on an older tool, enum4linux. This tool automates many of the queries, **but not all**, and can return a large amount of information.

We need to use more than two tools for enumeration. Because it can happen that due to the programming of the tools, we get different information that we have to check manually. Therefore, we should never rely only on automated tools where we do not know precisely how they were written.

**my methodology is centered in manual recon notusing automated tools will likely be beneficial for us we will understand more about the target .** 