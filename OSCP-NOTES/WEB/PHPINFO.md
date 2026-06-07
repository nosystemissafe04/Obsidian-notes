### phpinfo() is GOLD — Mine it Hard

This is your biggest lead. Check for:

```
# Critical things to look for in phpinfo():
allow_url_include = On        ← RFI is possible if this is ON
allow_url_fopen   = On        ← needed for remote file ops
disable_functions             ← what's blocked for RCE
open_basedir                  ← file access restrictions
SERVER["DOCUMENT_ROOT"]       ← web root path
SCRIPT_FILENAME               ← absolute path
session.save_path             ← where sessions are stored
```