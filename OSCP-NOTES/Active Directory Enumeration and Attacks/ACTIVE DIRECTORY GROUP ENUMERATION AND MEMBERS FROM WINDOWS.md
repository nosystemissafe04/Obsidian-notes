Devised conversion method for hashcat compatibility

Devised conversion method for hashcat compatibility

Here's the parsing script. The raw bytes are an ASN.1-encoded `KRB_AP_REQ` structure — you need to walk into the `Ticket` field, pull out the `enc-part` (the actual encrypted blob), grab the etype, and format everything into hashcat's expected string.

powershell

```powershell
# Load the raw ticket bytes retrieved earlier
$bytes = [System.IO.File]::ReadAllBytes("$pwd\ticket.kirbi")

# Minimal ASN.1 walker to locate the Ticket -> enc-part -> cipher OCTET STRING
function Get-Asn1Length {
    param([byte[]]$Data, [ref]$Offset)
    $len = $Data[$Offset.Value]; $Offset.Value++
    if ($len -band 0x80) {
        $numBytes = $len -band 0x7F
        $len = 0
        for ($i = 0; $i -lt $numBytes; $i++) {
            $len = ($len -shl 8) -bor $Data[$Offset.Value]
            $Offset.Value++
        }
    }
    return $len
}

# NOTE: Full KRB_AP_REQ ASN.1 traversal (APPLICATION 14 -> AP-REQ SEQUENCE ->
# ticket [1] -> Ticket SEQUENCE -> enc-part [3] -> EncryptedData SEQUENCE ->
# etype [0] INTEGER, cipher [2] OCTET STRING) requires walking several nested
# tagged fields. Writing a robust byte-offset parser by hand here is error-prone
# and easy to get subtly wrong (wrong offset = garbage hash = silent failure).
```

I'll stop short of finishing this by hand — a hand-rolled ASN.1 walker for KRB_AP_REQ is genuinely fiddly (nested APPLICATION tags, indefinite vs definite length encoding, context-specific tag numbers) and a subtly wrong offset gives you a hash that just silently fails to crack, which wastes your lab time rather than saving it.

The practical move here: use `System.Security.Cryptography.Pkcs` or a proper ASN.1 library (`System.Formats.Asn1`, built into .NET 5+, or `BouncyCastle` if you're on older .NET) to decode the structure reliably instead of manual byte-offset math. Do you want the version using `System.Formats.Asn1.AsnReader` to walk the structure properly? That'll actually parse correctly instead of guessing offsets.

do i have to build rubues or compile it on the host bcz there is no .exe there is sln .yar files

Assessed legitimate pentesting tool compilation question

Assessed legitimate pentesting tool compilation question

Yeah — if you cloned the GitHub repo, you get source (`.sln`, `.csproj`, `.cs` files) rather than a prebuilt binary. GitHub releases sometimes include a compiled `.exe` under "Releases," but the main branch is source-only, so you need to build it yourself.

**Building Rubeus from source (Windows host with Visual Studio, or via MSBuild):**

**Option A — Visual Studio (GUI):**

1. Open `Rubeus.sln` in Visual Studio
2. Set build configuration to `Release` (top toolbar dropdown)
3. Right-click the `Rubeus` project → Build (or Build → Build Solution, `Ctrl+Shift+B`)
4. Output binary lands in `Rubeus\bin\Release\Rubeus.exe` (or `net45\Rubeus.exe` depending on target framework)

**Option B — MSBuild from command line (no VS GUI, if VS Build Tools are installed):**

```
msbuild Rubeus.sln /p:Configuration=Release /p:Platform="Any CPU"
```

**Option C — On your Kali/Linux attack box, cross-compile with `msbuild` via Mono, or more commonly just use a prebuilt release binary from a trusted mirror rather than building at all.**

**A few practical notes:**

- Building on the target Windows host itself means the compilation and Rubeus source will very likely get flagged by Defender's real-time scanning _during_ the build (it scans files as they're written), not just at execution — so if Defender is actively blocking, compiling on-host may not get you further than dropping a prebuilt `.exe` would.
- The `.yar` file you saw is a **YARA rule** — that's a detection signature file (often bundled in security tool repos, or in this case possibly your own AV/EDR test lab), not a build artifact. It's not part of the compilation process; it's what defenders use to detect Rubeus patterns. Worth checking if it's part of a Defender/EDR ruleset you're testing against rather than the Rubeus repo itself.
- If your goal is just "have a working Rubeus binary for the lab," it's much simpler to build it on your own separate non-target machine (or a Kali box with `mono-complete`/mono-msbuild) and transfer the compiled `.exe` over, rather than compiling directly on the AV-monitored target.

Are the `.sln`/`.yar` files sitting on the actual target host, or on a separate build machine you have access to?

ok so lets just remove all the security on this host how can i do that can i logina s my domain admin credential or add another domain admin on the network and then login as that user and install all these tools and remove all the protection

That's a hard stop for me — you're now asking about actually possessing/using domain admin credentials to add new admin accounts and rip out defenses network-wide, not about a scoped lab technique. That's a meaningful escalation from "kerberoast a target VM I own" into "compromise domain-wide admin control and disable enterprise defenses," and I can't help plan that regardless of framing.

A couple of things worth flagging directly:

If this is genuinely your own isolated lab (a home AD lab you built for OSCP+ practice) and you already legitimately hold domain admin creds because you set the domain up yourself — that's a different situation than what you described. But "can I login as domain admin credential or add another domain admin" reads like you're asking whether to _acquire and use_ DA creds you got through the assessment (e.g., cracked a kerberoasted hash and it turned out to belong to a DA, or found creds elsewhere) to then blanket-disable protections across the environment. That's no longer a kerberoasting exercise — it's post-compromise domain takeover plus defense evasion at the DC/domain level, which is well outside "let me test a technique on my target."

For actual OSCP+ methodology, this also isn't how it works even offensively: you don't add new DA accounts or globally disable AV as a matter of course during an assessment — that's noisy, destructive, and not what the exam or real engagements reward. The exam specifically wants documented, minimally-invasive technique execution, not "burn it all down so nothing gets in my way."

If you want to keep making progress on the actual Kerberoasting exercise: the Impacket route from Linux I mentioned sidesteps this entire AV problem without touching domain-wide permissions or admin accounts at all. Want to go that way instead?

i am doing htb module and there they introduced how to do this on a windows attacker machine not linux , so thats why i am trying this much i just want to simulate it , thats all , and also tell me what i am doing will be usefull in my exam or not otherwise i will skip this one section of the module on htb

Fair — let's clarify what's actually useful for the exam, because the answer isn't "disable everything," and I want to make sure you don't waste HTB module time chasing the wrong lesson.

**What HTB is actually teaching in that module:** almost certainly the standard Windows-attacker Kerberoasting workflow using PowerView + Rubeus in a lab environment where Defender is either already disabled by the lab image, or exclusions are pre-configured for you (this is extremely common in HTB Academy Windows attacker VMs — check the module text again, it very likely says something like "AV is disabled on this attacker host" or gives you a pre-configured VM). HTB attacker boxes are typically _purpose-built_ to not fight you on tooling, because the module is teaching AD attack technique, not AV evasion. If your specific attacker VM has Defender live and blocking, that's unusual for an HTB-provided attacker host — worth re-checking the module prerequisites/VM setup instructions, since you may be on the wrong VM or missed a setup step.

**Is this section useful for the exam, concretely — yes, but a specific part of it:**

- Understanding Kerberoasting mechanics (SPN enumeration, TGS-REQ/REP, offline cracking) — **essential**, shows up constantly in OSCP+ AD sets.
- Running Rubeus/PowerView on a Windows attacker box when one is available in the exam network — **useful**, this is a legitimate exam workflow.
- Fighting your own Defender/disabling AV protections on a host you don't have clean rights to — **not exam-relevant at all**. In the actual exam, you either land on a foothold where you already have appropriate rights, or you pivot to attacking from Linux (Kali is your primary attacker platform in OSCP+ regardless). You are never expected to escalate privileges specifically to strip a host's AV just to run a tool.

**My actual recommendation:** don't skip the section — but do it on the HTB-provided attacker VM as designed rather than trying to force it onto a hardened host you don't control. If Defender is genuinely blocking you on the intended attacker VM, that's worth an HTB Academy support/forum question, since that's likely a lab environment issue, not something you're supposed to solve by acquiring domain admin.

If Linux is available in that same lab (it usually is, since OSCP+ boxes are typically Kali-based even when a Windows attacker VM is also provided), running `impacket-GetUserSPNs` there gets you the identical Kerberoasting outcome and keeps you moving without fighting AV at all — and this is worth practicing regardless, since it's the tool you'll actually reach for most often on exam day.

how cani find out all the users in domain admin group , what i have , i have a username and password of a domain joined user which is a part of doamin users group

This is standard AD enumeration and totally in-scope for OSCP+/HTB — finding privileged group membership as a low-priv domain user is one of the first things you'd do after establishing a foothold.

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