after nmap scan there was no anonymous access 
targetted web app , dirbusted - found a route `site` 
vulnerable to rfi executed wwwolf webshell , laudanum and other webshells are not working there 
executed nishang invokepowershelltcp script and executed it to get reverse shell
after some enumeration found a directory which is running a script every 5 min as admin 
replaced the task with my custom binary and got admin 

**but there is another path to it for escalation** 

we found `phpmyadmin` which is being accessed by localhost only 
used chisel to port forward , then accessed it on browser now i have the mysql access 

*we could also port forward to mysql directly , and then access it but phpmyadmin have graphical interface which makes it easy to navigate*

### 1.1 Check FILE Privilege

```sql
-- Check if current MySQL user has FILE privilege
SELECT * FROM information_schema.USER_PRIVILEGES 
WHERE PRIVILEGE_TYPE = 'FILE';

-- Check current user
SELECT user();
SELECT current_user();
```

### 1.2 Check secure_file_priv (Critical)

sql

```sql
SHOW VARIABLES LIKE 'secure_file_priv';
```

|Result|Meaning|
|---|---|
|Empty string `""`|No restriction — write anywhere ✅|
|`NULL`|File operations disabled ❌|
|`/some/path/`|Can only write to that path|

### 1.3 Verify Write Access with Test File

sql

```sql
-- Write a test file to confirm write works
SELECT 'test' INTO OUTFILE 'C:\\Windows\\Temp\\test.txt';
```

Then on target:

cmd

```cmd
type C:\Windows\Temp\test.txt
-- output: test ✅
```

---

## Phase 2 — Enumerate Scheduled Tasks

### 2.1 List All Tasks and Their Binaries

cmd

```cmd
schtasks /query /fo LIST /v | findstr /i "TaskName\|Task To Run\|Run As User\|Next Run"
```

