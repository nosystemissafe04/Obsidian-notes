
## 🗂 Windows Informative 

```dataviewjs
const pages = dv.pages("#windows-info")
    .where(page => page.file.name != "")
    .sort(page => page.file.folder);

function splitFolder(folder) {
    if (!folder) return ["(root)", ""];
    const parts = folder.split("/");
    return [parts[0], parts.slice(1).join("/")];
}

dv.table(
    ["Note", "Top-level Folder", "Subfolder", "Created"],
    pages.map(page => {
        const [top, sub] = splitFolder(page.file.folder);
        return [
            page.file.link,
            top,
            sub || "(none)",
            dv.date(page.file.cday)
        ];
    })
);
```


## 📂📤 Windows File-Transfers

```dataviewjs
const pages = dv.pages("#windows-transfer")
    .where(page => page.file.name != "")
    .sort(page => page.file.folder);

function splitFolder(folder) {
    if (!folder) return ["(root)", ""];
    const parts = folder.split("/");
    return [parts[0], parts.slice(1).join("/")];
}

dv.table(
    ["Note", "Top-level Folder", "Subfolder", "Created"],
    pages.map(page => {
        const [top, sub] = splitFolder(page.file.folder);
        return [
            page.file.link,
            top,
            sub || "(none)",
            dv.date(page.file.cday)
        ];
    })
);
```


## 🛡️🔓 Windows Bypass

```dataviewjs
const pages = dv.pages("#windows-bypass")
    .where(page => page.file.name != "")
    .sort(page => page.file.folder);

function splitFolder(folder) {
    if (!folder) return ["(root)", ""];
    const parts = folder.split("/");
    return [parts[0], parts.slice(1).join("/")];
}

dv.table(
    ["Note", "Top-level Folder", "Subfolder", "Created"],
    pages.map(page => {
        const [top, sub] = splitFolder(page.file.folder);
        return [
            page.file.link,
            top,
            sub || "(none)",
            dv.date(page.file.cday)
        ];
    })
);
```


## ⚔️🔥 Windows Attacks

```dataviewjs
const pages = dv.pages("#windows-attacks")
    .where(page => page.file.name != "")
    .sort(page => page.file.folder);

function splitFolder(folder) {
    if (!folder) return ["(root)", ""];
    const parts = folder.split("/");
    return [parts[0], parts.slice(1).join("/")];
}

dv.table(
    ["Note", "Top-Level Folder", "Subfolder", "Created"],
    pages.map(page => {
        const [top, sub] = splitFolder(page.file.folder);
        return [
            page.file.link,
            top,
            sub || "(none)",
            dv.date(page.file.cday)
        ];
    })
);
```
