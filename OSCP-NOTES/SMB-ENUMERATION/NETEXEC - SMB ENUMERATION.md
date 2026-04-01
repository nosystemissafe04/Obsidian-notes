```BASH
nxc smb dc1.scrm.local -u 'ksimpson' -p 'ksimpson' -k --rid-brute
```

```BASH
nxc smb dc1.scrm.local -u 'ksimpson' -p 'ksimpson' -k --users
```

```BASH
nxc smb dc1.scrm.local -u 'ksimpson' -p 'ksimpson' -k --local-groups
```

```bash
nxc smb dc1.scrm.local -u 'ksimpson' -p 'ksimpson' -k --disk
```

- registered user session will give u
```bash
nxc smb dc1.scrm.local -u 'ksimpson' -p 'ksimpson' -k --reg-sessions
```
# Enumerate Guest Logon

- null or anonymous login is different then guest login 
- in anonymous we dont specify any username and password or use anonymous as username and password , but in guest we can use any string for username and password to check 

```bash
nxc smb 10.10.10.178 -u 'a' -p '' 
nxc smb 10.10.10.178 -u 'a' -p '' --shares
```

