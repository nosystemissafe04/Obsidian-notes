# Interacting with Common Services

---

Vulnerabilities are commonly discovered by people who use and understand technology, a protocol, or a service. As we evolve in this field, we will find different services to interact with, and we will need to evolve and learn new technology constantly.

To be successful at attacking a service, we need to know its purpose, how to interact with it, what tools we can use, and what we can do with it. This section will focus on common services and how we can interact with them.

---

## File Share Services

A file sharing service is a type of service that provides, mediates, and monitors the transfer of computer files. Years ago, businesses commonly used only internal services for file sharing, such as SMB, NFS, FTP, TFTP, SFTP, but as cloud adoption grows, most companies now also have third-party cloud services such as Dropbox, Google Drive, OneDrive, SharePoint, or other forms of file storage such as AWS S3, Azure Blob Storage, or Google Cloud Storage. We will be exposed to a mixture of internal and external file-sharing services, and we need to be familiar with them.

This section will focus on internal services, but this may apply to cloud storage synced locally to servers and workstations.

---

## Server Message Block (SMB)

SMB is commonly used in Windows networks, and we will often find share folders in a Windows network. We can interact with SMB using the GUI, CLI, or tools. Let us cover some common ways of interacting with SMB using Windows & Linux.

#### Windows

There are different ways we can interact with a shared folder using Windows, and we will explore a couple of them. On Windows GUI, we can press `[WINKEY] + [R]` to open the Run dialog box and type the file share location, e.g.: `\\192.168.220.129\Finance\`

![text](https://academy.hackthebox.com/storage/modules/116/windows_run_sharefolder2.jpg)

Suppose the shared folder allows anonymous authentication, or we are authenticated with a user who has privilege over that shared folder. In that case, we will not receive any form of authentication request, and it will display the content of the shared folder.

![image](https://academy.hackthebox.com/storage/modules/116/finance_share_folder2.jpg)

If we do not have access, we will receive an authentication request.

![text](https://academy.hackthebox.com/storage/modules/116/auth_request_share_folder2.jpg)

Windows has two command-line shells: the [Command shell](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands) and [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/overview). Each shell is a software program that provides direct communication between us and the operating system or application, providing an environment to automate IT operations.

Let's discuss some commands to interact with file share using Command Shell (`CMD`) and `PowerShell`. The command [dir](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/dir) displays a list of a directory's files and subdirectories.

#### Windows CMD - DIR

  Interacting with Common Services

```cmd-session
C:\htb> dir \\192.168.220.129\Finance\

Volume in drive \\192.168.220.129\Finance has no label.
Volume Serial Number is ABCD-EFAA

Directory of \\192.168.220.129\Finance

02/23/2022  11:35 AM    <DIR>          Contracts
               0 File(s)          4,096 bytes
               1 Dir(s)  15,207,469,056 bytes free
```

The command [net use](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/gg651155(v=ws.11)) connects a computer to or disconnects a computer from a shared resource or displays information about computer connections. We can connect to a file share with the following command and map its content to the drive letter `n`.

#### Windows CMD - Net Use

  Interacting with Common Services

```cmd-session
C:\htb> net use n: \\192.168.220.129\Finance

The command completed successfully.
```

We can also provide a username and password to authenticate to the share.

  Interacting with Common Services

```cmd-session
C:\htb> net use n: \\192.168.220.129\Finance /user:plaintext Password123

The command completed successfully.
```

With the shared folder mapped as the `n` drive, we can execute Windows commands as if this shared folder is on our local computer. Let's find how many files the shared folder and its subdirectories contain.

#### Windows CMD - DIR

  Interacting with Common Services

```cmd-session
C:\htb> dir n: /a-d /s /b | find /c ":\"

29302
```

We found 29,302 files. Let's walk through the command:

  Interacting with Common Services

```shell-session
dir n: /a-d /s /b | find /c ":\"
```

|**Syntax**|**Description**|
|---|---|
|`dir`|Application|
|`n:`|Directory or drive to search|
|`/a-d`|`/a` is the attribute and `-d` means not directories|
|`/s`|Displays files in a specified directory and all subdirectories (Recursive) |
|`/b`|Uses bare format (no heading information or summary data other then file paths ) |

The following command `| find /c ":\\"` process the output of `dir n: /a-d /s /b` to count how many files exist in the directory and subdirectories. You can use `dir /?` to see the full help. Searching through 29,302 files is time consuming, scripting and command line utilities can help us speed up the search. With `dir` we can search for specific names in files such as:

- cred
- password
- users
- secrets
- key
- Common File Extensions for source code such as: .cs, .c, .go, .java, .php, .asp, .aspx, .html.

```cmd-session
C:\htb>dir n:\*cred* /s /b

n:\Contracts\private\credentials.txt


C:\htb>dir n:\*secret* /s /b

n:\Contracts\private\secret.txt
```

If we want to search for a specific word within a text file, we can use [findstr](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/findstr).

#### Windows CMD - Findstr


```cmd-session
c:\htb>findstr /s /i cred n:\*.*

n:\Contracts\private\secret.txt:file with all credentials
n:\Contracts\private\credentials.txt:admin:SecureCredentials!
```

/i = means insensitive does not matter if lowercase or uppercase

We can find more `findstr` examples [here](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/findstr#examples).

#### Windows PowerShell

PowerShell was designed to extend the capabilities of the Command shell to run PowerShell commands called `cmdlets`. Cmdlets are similar to Windows commands but provide a more extensible scripting language. **We can run both Windows commands and PowerShell cmdlets in PowerShell, but the Command shell can only run Windows commands and not PowerShell cmdlets**. Let's replicate the same commands now using Powershell.

#### Windows PowerShell

  Interacting with Common Services

```powershell-session
PS C:\htb> Get-ChildItem \\192.168.220.129\Finance\

    Directory: \\192.168.220.129\Finance

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         2/23/2022   3:27 PM                Contracts
```

Instead of `net use`, we can use `New-PSDrive` in PowerShell.

[[Windows File Transfer Methods#Another method for mounting]] => *we can see that mounting a drive can also be used when doing file transfer although i experienced that when i do mount a drive and then try to copy or move something it fails . and i recently discovered that when you use ftp for file transfer it is possible that file will be changed so check the md5 hash digest of the file you have transferred* 

```powershell-session
PS C:\htb> New-PSDrive -Name "N" -Root "\\192.168.220.129\Finance" -PSProvider "FileSystem"

Name           Used (GB)     Free (GB) Provider      Root                                               CurrentLocation
----           ---------     --------- --------      ----                                               ---------------
N                                      FileSystem    \\192.168.220.129\Finance
```

To provide a username and password with Powershell, we need to create a [PSCredential object](https://docs.microsoft.com/en-us/dotnet/api/system.management.automation.pscredential). It offers a centralized way to manage usernames, passwords, and credentials.

#### Windows PowerShell - PSCredential Object

  Interacting with Common Services

```powershell-session
PS C:\htb> $username = 'plaintext'
PS C:\htb> $password = 'Password123'
PS C:\htb> $secpassword = ConvertTo-SecureString $password -AsPlainText -Force
PS C:\htb> $cred = New-Object System.Management.Automation.PSCredential $username, $secpassword
PS C:\htb> New-PSDrive -Name "N" -Root "\\192.168.220.129\Finance" -PSProvider "FileSystem" -Credential $cred

Name           Used (GB)     Free (GB) Provider      Root                                                              CurrentLocation
----           ---------     --------- --------      ----                                                              ---------------
N                                      FileSystem    \\192.168.220.129\Finance
```

[[Credentials and Remoting#]] => ***here i explained credentials in detail in powershell . we can also use get-credential command to create a object of pscredential class similar to what we are doing manually above . but in some scenerio we found that it is not possible to use this command bcz it pops up a dailog box for entering username and password . for example evil-winrm which uses powershell remoting but it will not pop up a dialog box for entering username and password when issueing this command . it will be usefull to learn how to create a object manually***  

In PowerShell, we can use the command `Get-ChildItem` or the short variant `gci` instead of the command `dir`.

#### Windows PowerShell - GCI

  Interacting with Common Services

```powershell-session
PS C:\htb> N:
PS N:\> (Get-ChildItem -File -Recurse | Measure-Object).Count

29302
```

We can use the property `-Include` to find specific items from the directory specified by the Path parameter.

  Interacting with Common Services

```powershell-session
PS C:\htb> Get-ChildItem -Recurse -Path N:\ -Include *cred* -File

    Directory: N:\Contracts\private

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         2/23/2022   4:36 PM             25 credentials.txt
```

you can also use -name parameter which is equivalent to /b in dir command in cmd

The `Select-String` cmdlet uses regular expression matching to search for text patterns in input strings and files. We can use `Select-String` similar to `grep` in UNIX or `findstr.exe` in Windows.

#### Windows PowerShell - Select-String

  Interacting with Common Services

```powershell-session
PS C:\htb> Get-ChildItem -Recurse -Path N:\ | Select-String "cred" -List

N:\Contracts\private\secret.txt:1:file with all credentials
N:\Contracts\private\credentials.txt:1:admin:SecureCredentials!
```

CLI enables IT operations to automate routine tasks like user account management, nightly backups, or interaction with many files. We can perform operations more efficiently by using scripts than the user interface or GUI.
