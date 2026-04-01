### whoami Command

- whoami
	- `whoami /priv`
		- Token impersonation via specific privileges 
	- `whoami /all` 
	- `whoami /groups` 
		- sometimes we might be in admin groups check this low hanging fruit

### net Command

- `net user` 
		- can tell us about all the users , if we are an service user , we can laterally move to another user then escalate **OR** we can directly target an admin account , *(we are talking about local accounts here)* 
	- `net user \<username\>`
		- specific user enumeration , **mostly we can use this information to determine which user is part of which group**
		- `net localgroup \<localgroup\>`
			- if we know the local group name we can use the command to find out what users belong to this group , 
			- this way we can visualize information easily 
			- `net localgroup` 
				- this command sometimes works sometimes not 
		- specific user may have specific priviledges , which we might not know until we escalate 

