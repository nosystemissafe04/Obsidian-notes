**Native .NET / DirectorySearcher (no admin needed, no AV signature issue):**

powershell

```powershell
Add-Type -AssemblyName System.DirectoryServices
$searcher = New-Object System.DirectoryServices.DirectorySearcher
$searcher.Filter = "(&(objectCategory=group)(cn=Domain Admins))"
$group = $searcher.FindOne()
$groupEntry = $group.GetDirectoryEntry()
$groupEntry.member | ForEach-Object { $_ }
```

**Using `net.exe` (built-in, zero footprint, no LDAP query at all):**

```
net group "Domain Admins" /domain
```

This is the fastest single-line option and works from any domain-joined context — it's a standard Windows command, not a security tool, so it won't trigger anything.

**Using `dsquery` (if RSAT tools are present):**

```
dsquery group -name "Domain Admins" | dsget group -members -expand
```

**PowerView equivalent (if you get it loaded):**

powershell

```powershell
Get-DomainGroupMember -Identity "Domain Admins" -Recurse
```

The `-Recurse` flag matters here — it expands nested group memberships, since Domain Admins often contains other groups rather than just direct user accounts, and a non-recursive query will miss those.

**Also worth checking while you're at it** — accounts with `adminCount=1` (from our earlier conversation) will show you _current and former_ privileged members, which is broader than just current Domain Admins group membership and often surfaces accounts that were admin at some point and may still have leftover permissions:

```
net user /domain
```

then cross-reference against the adminCount LDAP filter I gave you earlier.

`net group "Domain Admins" /domain` is your quickest starting point given you just have standard domain user rights — no elevated permissions or special tooling needed for any of this.