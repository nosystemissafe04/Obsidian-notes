## 1. Context & Assumptions

- **Scenario**: _Assumed breach_
    
- **Access**:
    
    - Valid domain credentials: `stephanie`
        
    - Domain: `corp.com`
        
    - Client machine: `Windows 11 (CLIENT75)`
        
- **Connection Method**:
    
    - Use **RDP** (via `xfreerdp`) instead of WinRM/PowerShell remoting
        
    - Avoids **Kerberos Double-Hop issue**
        

### RDP Connection Command

`xfreerdp /u:stephanie /d:corp.com /v:192.168.50.75`

⚠️ **Best Practice**  
When you have valid AD credentials, **prefer RDP** over PowerShell remoting to prevent authentication delegation issues.

---

## 2. Enumerating Domain Users (`net user`)

### List All Domain Users

`net user /domain`

**Example Output (Partial):**

- Administrator
    
- dave
    
- iis_service
    
- jeff
    
- **jeffadmin**
    
- pete
    
- stephanie
    
- krbtgt
    

📌 **Enumeration Insight**  
Usernames with prefixes/suffixes like `admin`, `svc`, or `service` often indicate **privileged or service accounts**.

---

### Enumerate a Specific User

`net user jeffadmin /domain`

**Key Findings:**

- Member of:
    
    - `Domain Admins`
        
    - `Administrators`
        
- Password does not expire
    
- Account active
    

🔥 **Security Impact**  
Compromising `jeffadmin` = **Full domain compromise**

---

## 3. Enumerating Domain Groups (`net group`)

### List All Domain Groups

`net group /domain`

**Group Types Observed:**

- Default groups (e.g., Domain Users, Domain Admins)
    
- **Custom groups**:
    
    - Sales Department
        
    - Development Department
        
    - Management Department
        

---

### Enumerate Members of a Specific Group

`net group "Sales Department" /domain`

**Members:**

- pete
    
- stephanie
    

📌 **Why This Matters**

- Reveals **organizational structure**
    
- Helps identify **departmental access**
    
- Useful for lateral movement planning
    

---

# 4. Active Directory Enumeration Using PowerShell & .NET

---

## 4.1 Why Not Use `Get-ADUser`?

- Requires **RSAT**
    
- RSAT usually:
    
    - Installed only on **Domain Controllers**
        
    - Requires **admin privileges**
        
- Rarely available on standard client machines
    

➡️ Alternative: **.NET classes + LDAP via ADSI**

---

## 4.2 LDAP Fundamentals (Core Theory)

- **LDAP** = protocol used to communicate with AD
    
- AD enumeration = **LDAP queries**
    
- LDAP is not AD-exclusive (used by other directory services)
    

---

### LDAP Path Format

`LDAP://HostName[:PortNumber][/DistinguishedName]`

**Components:**

1. **HostName**
    
    - Domain name, hostname, or IP
        
    - Best choice: **Primary Domain Controller (PDC)**
        
2. **PortNumber**
    
    - Optional (auto-selected unless non-standard)
        
3. **Distinguished Name (DN)**
    
    - Unique identifier of an AD object
        

---

## 4.3 Understanding Distinguished Names (DN)

### Example DN

`CN=Stephanie,CN=Users,DC=corp,DC=com`

### DN Components

- **DC (Domain Component)**
    
    - Represents domain hierarchy (`corp.com`)
        
- **CN (Common Name)**
    
    - Object or container name
        

📌 **Reading Order**  
Right → Left (top of LDAP tree → object)

---

### DN Scope Tip

- Using only:
    

`DC=corp,DC=com`

➡️ Searches the **entire domain**

- Adding containers (e.g., `CN=Users`)  
    ➡️ Restricts search scope
    

---

## 5. Finding the Primary Domain Controller (PDC)

### .NET Namespace Used

`System.DirectoryServices.ActiveDirectory`

### Domain Class Method

`[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()`

**Important Property:**

- `PdcRoleOwner`
    

---

### Extract PDC Dynamically

```powershell
$domainObj = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()
$PDC = $domainObj.PdcRoleOwner.Name 
$PDC
```


**Example Output:**

`DC1.corp.com`

---

## 8. Getting the Distinguished Name via ADSI

### Retrieve DN Automatically

`([adsi]'').distinguishedName`

**Output:**

`DC=corp,DC=com`

✔️ Correct LDAP-compatible format  
✔️ More reliable than manual parsing

---

## 9. Building the Full LDAP Path (Final Script)

### Final PowerShell Script

`$PDC = [System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().PdcRoleOwner.Name $DN = ([adsi]'').distinguishedName $LDAP = "LDAP://$PDC/$DN" $LDAP`

### Output

`LDAP://DC1.corp.com/DC=corp,DC=com`

---

## 10. Key Takeaways

- Legacy tools (`net user`, `net group`) are:
    
    - Fast
        
    - Low-noise
        
    - Ideal for initial enumeration
        
- PowerShell + .NET:
    
    - Works without RSAT
        
    - Requires only **basic user privileges**
        
    - Fully **dynamic and reusable**
        
- LDAP path construction is foundational for:
    
    - Advanced enumeration
        
    - Custom AD tooling
        
    - Understanding tools like BloodHound