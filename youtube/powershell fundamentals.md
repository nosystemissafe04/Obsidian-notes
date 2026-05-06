powershell is a scripting language 
cross platform task automation 
configuration management framework 
run on windows linux and macos 

main feature which is not is bash is it returns .net objects 
it is built on .net common language runtime 
all input and output are .net objects 

functions classes modules

powershell scripts can work with powershell modules like azure sql exchange aws vmware and google cloud 

powershell desired state configuration dsc a management framwork in powershell , as code 

username:password:UID:GID:comment:home_dir:shell

/bin/false

- It is literally just a program that **immediately exits with code 1** (failure)
- No message, no output, nothing — just exits
- Also used to say **"this is not a real user"**

/usr/sbin/nologin

- Also **blocks interactive login** like `/bin/false`
- BUT it **prints a message** before exiting:

```
This account is currently not available.
```

Every object in PowerShell has a `.GetType()` method:

```powershell
Get-Process firefox | Select-Object Name, Id, CPU
```

```powershell
# Step 1 — run Get-Process and check its type
$processes = Get-Process
$processes.GetType()

# Output:
# IsPublic IsSerial Name     BaseType
# -------- -------- ----     --------
# True     True     Object[] System.Array   ← ITS AN ARRAY!
```

powershell

```powershell
# Step 2 — how many items in the array?
$processes.Count
# or
$processes.Length
```