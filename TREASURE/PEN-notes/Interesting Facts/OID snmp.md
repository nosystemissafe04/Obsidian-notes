## 🌳 Why Are There 3 Root OID Arcs?

The **OID namespace is a global tree**, and all OIDs begin with one of **three top-level arcs**:

### 1. `0`: **itu-t** (formerly `ccitt`)

- Used by the **International Telecommunication Union**.
    
- Standards primarily related to telecom (e.g., X.500, X.400, ASN.1).
    
- Example: `0.9.2342.19200300.100.1.1` → _user ID attribute in LDAP_.
    

---

### 2. `1`: **iso**

- Used by the **International Organization for Standardization**.
    
- Covers a wide range of ISO standards, including industry, security, and country codes.
    
- Example: `1.3.6.1.2.1.1.1` → _SNMP sysDescr_, under ISO → org → dod → internet → mgmt → mib-2.
    

---

### 3. `2`: **joint-iso-itu-t** (formerly `joint-iso-ccitt`)

- Used for **collaborative standards** between ISO and ITU-T.
    
- Example: `2.5.4.3` → _common name (CN)_ in X.509 certificates.
    

---

## ⚙ Why These 3?

This structure allows:

- **Clear authority separation**: Each root arc is managed by a different standards organization or collaboration.
    
- **Efficient encoding**: Top arcs `0`, `1`, and `2` (with subarcs `0–39`) are designed so they can be encoded in **1 byte** in ASN.1 BER/DER formats (see X.690).
    
- **Scalability**: Each root node owns a vast subtree, and delegation allows further distributed management.
    

---

## 🧠 TL;DR

There are **3 root nodes** because:

- They reflect **authority divisions** (ITU, ISO, joint).
    
- It's a design choice for **global uniqueness and optimized encoding**.
    
- This structure ensures **consistent registration** of OIDs in a globally recognized way.
    

---

Would you like a **visual tree diagram** showing how a real SNMP OID like `1.3.6.1.2.1` fits into this structure?