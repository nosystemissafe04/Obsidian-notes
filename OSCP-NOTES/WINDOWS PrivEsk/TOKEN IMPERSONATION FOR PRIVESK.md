Token impersonation are temporary keys used to access system networks , its cookies for computer 

# What is an Impersonation Token?
- In Windows, an **impersonation token** is a type of access token that allows a thread to execute using the security context of another user, typically to temporarily adopt that user's privileges. 

### Primary Token
- This is distinct from a **primary token**, which is associated with a user session or process.

	#### Process level
	- **Primary tokens** are tied to processes and represent the actual user logged into that session.

	#### Thread level
	- **Impersonation tokens** are applied at the thread level, enabling a thread to "impersonate" another user, often a user connected over the network or in a client-server interaction.

There are different levels of impersonation tokens based on the extent of privilege the thread can exercise on behalf of the impersonated user:
1. **Anonymous**: The thread cannot identify or act as the client
2. **Identification**: The thread can get the client's identity but cannot impersonate.
3. **Impersonation**: The thread can impersonate the client's security context on the local system.
4. **Delegation**: The thread can impersonate the client locally and on remote systems (most powerful).


##### Two type of Tokens
- delegate - for logging into machine like for RDP 
- impersonate - used for non interactive access like network drive windows logon scripts 

***so first and foremost what priviledge do we have as the current user*** 

##### `whoami /priv` 

see ![[Privileges level and user account access Level#3️⃣ **Privileges / User Rights**]]
##### COMMANDS TO QUERY PRIVILEDGE INFORMATION 

- `whoami /priv`
- `getprivs` (meterpreter)

other then these commands we dont have any other option 

##### GETSYSTEM
- `getsystem`
- in metasploit we can use this command to **escalate priviledge** it will attack in 2 ways we can run all of them , and we can use individual ones too 
