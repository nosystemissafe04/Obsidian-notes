### Scan time impact:

- **Without `-Pn` (default)**:  
    Nmap first checks if the host is up (ping sweep). If a host does not respond to this, **it skips scanning that host entirely**.
    
    - This **saves time** if a host is **down or firewalled**, since Nmap doesn't waste time scanning it.
        
    - If the host **blocks ping** (common in secure setups), Nmap might wrongly **assume it's down**.
        
- **With `-Pn`**:  
    Nmap **always** proceeds with the port scan, regardless of ping reply. So:
    
    - If the host is up, `-Pn` is safe and **eliminates any time spent on discovery**.
        
    - But if you're scanning **many IPs**, `-Pn` will make Nmap scan even **the unreachable ones**, wasting time.