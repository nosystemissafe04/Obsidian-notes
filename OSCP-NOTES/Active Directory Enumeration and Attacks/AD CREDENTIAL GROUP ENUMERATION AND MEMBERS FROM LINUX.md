From Linux, enumerating Domain Admins group membership as an authenticated low-priv user, several standard tools work:

**Impacket (`lookupsid.py` or `psexec`-adjacent tools aren't needed — use these):**

bash

```bash
# Using net-tool style query via rpcclient (Samba suite)
rpcclient -U 'domain.local/lowpriv%password' 10.10.10.10 -c "querygroupmem 0x200"
```

More directly, the cleanest approach:

**Using `bloodyAD` (LDAP-native, lightweight, no admin needed):**

bash

```bash
bloodyAD --host 10.10.10.10 -d domain.local -u lowpriv -p 'password' get search --filter "(cn=Domain Admins)" --attr member
```

**Using `ldapsearch` directly:**

bash

```bash
ldapsearch -x -H ldap://10.10.10.10 -D "lowpriv@domain.local" -w 'password' \
  -b "dc=domain,dc=local" "(cn=Domain Admins)" member
```

**Using `net rpc` (Samba tools):**

bash

```bash
net rpc group members "Domain Admins" -U "domain.local/lowpriv%password" -S 10.10.10.10
```

**Using Impacket's `GetADUsers.py` for broader context (all users + last logon, useful for correlating with adminCount):**

bash

```bash
impacket-GetADUsers -all -dc-ip 10.10.10.10 domain.local/lowpriv:password
```

**Using `windapsearch` (purpose-built for this exact enumeration):**

bash

```bash
python3 windapsearch.py --dc-ip 10.10.10.10 -u lowpriv@domain.local -p 'password' --da
```

The `--da` flag specifically pulls Domain Admins membership — this is probably your fastest single command.

**Or BloodHound's collector (`bloodhound-python`) if you want the full picture (group memberships, ACLs, sessions, trust relationships) rather than just one group:**

bash

```bash
bloodhound-python -u lowpriv -p 'password' -d domain.local -ns 10.10.10.10 -c All
```

Then analyze in BloodHound GUI for `Domain Admins` node → member edges, plus any nested groups or ACL-based paths to DA that a simple group query would miss.

`windapsearch --da` or the `rpcclient`/`net rpc` route are your quickest wins if you just need the member list fast.