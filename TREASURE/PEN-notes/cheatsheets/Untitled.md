Here's a comprehensive excerpt of the provided learning material, formatted for clarity and designed to be preserved as a note, drawing on all relevant information and our conversation history.

***

# LPI Learning Material - Key Concepts Overview

This document summarizes key information, concepts, and utilities from the LPI Learning Material (LPIC-1 102, Version 5.0). It focuses on the core knowledge areas and practical tools discussed across various topics.

The source titled "All notes 7/17/2025" does not contain any descriptive content beyond its title.

---

## TOPIC 105: SHELLS AND SHELL SCRIPTING

The shell serves as the **interface between the user and the kernel** of the operating system, interpreting commands entered by the user. Bash (Bourne Again Shell) is the de facto standard shell for most Linux distributions.

### 105.1 Customize and Use the Shell Environment

This section covers different shell types, variable management, and the use of aliases and functions to customize the shell environment.

#### Shell Types & Execution
*   **Interactive vs. Non-Interactive and Login vs. Non-Login Shells** are distinct types.
*   When using `su` or `sudo`, it's important to consider if the **target user's environment is needed**.
    *   `sudo su root` or `sudo su` starts an **interactive non-login shell** as root.
    *   `sudo -s` or `sudo -u root -s` starts a **non-login shell** as root.

#### Variables: Assignment and Reference
Variables are fundamental to the shell environment, used by the shell and other programs.
*   **Naming Rules**:
    *   Variables **cannot start with a number**.
    *   They **may not contain spaces**; underscores are conventionally used instead (e.g., `my_distro=zorinos`).
    *   Variables can contain alphanumeric characters (a-z, A-Z, 0-9) and most other characters (`?`, `!`, `*`, `.`, `/`).
*   **Value Assignment & Quoting**:
    *   Values must be **enclosed in quotes if they contain single spaces** (e.g., `distro="zorin 12.4"`).
    *   Values must also be quoted if they contain **redirection characters (`<`, `>`) or the pipe symbol (`|`)**.
    *   **Double quotes** are mandatory when referencing a variable whose value includes initial or extra spaces, to prevent field splitting and pathname expansion (e.g., `echo "$lizard"`).
    *   If a variable's reference contains a closing exclamation mark, it **must be the last character** in the string to avoid Bash interpreting it as a history event.
    *   Any backslashes must be **escaped with another backslash**.
*   **Variable Types**:
    *   **Local or Shell Variables**: Exist only within the current shell session.
        *   Can be made **readonly** when created (e.g., `readonly reptile=tortoise`) or after creation (e.g., `reptile=tortoise; readonly reptile`).
        *   **NOTE**: To list all readonly variables in the current session, use `readonly` or `readonly -p`.
        *   The `set` command outputs all currently assigned shell variables and functions; it's recommended to pipe its output to a pager like `less` (`set | less`).
    *   **Global or Environment Variables**: Passed to child processes. Declared using `export`.
        *   Example: `export suse=rpm-based`.
*   **Special Variables** (Environment variables that control shell behavior):
    *   `DISPLAY`: Normally `0` for the computer's display. An empty value means no X Window System.
    *   `HISTCONTROL`: Controls which commands are saved to `HISTFILE`. Values include `ignorespace`, `ignoredups`, `ignoreboth`.
    *   `HISTSIZE`: Sets the number of commands stored in memory for the shell session.
    *   `HISTFILESIZE`: Sets the number of commands saved in `HISTFILE` at the start and end of the session.
    *   `HISTFILE`: The file that stores commands, typically `~/.bash_history`.
        *   **NOTE**: To view `HISTFILE` contents, use `history` or `history <number>`.
    *   `HOME`: Stores the absolute path of the current user’s home directory.

#### Aliases and Functions
Both aliases and functions are important shell features that encapsulate recurrent blocks of code, forming part of the shell environment.
*   **Functions**:
    *   Can use **local variables**.
    *   Can use **environment variables**.
    *   Are **not escapable with `\`**.
    *   Can be **recursive**.
    *   Are **very productive when used with positional parameters**.
    *   To make a function available, the file containing it must be **sourced** (e.g., `. funed`).
    *   **Positional parameters** (`$1`, `$2`, etc.) can be passed to functions. For parameters greater than nine, use curly braces (e.g., `${10}`).
    *   **Read-only functions** are those whose contents cannot be modified. Use `readonly -f <function_name>` to make them readonly, and `readonly -f` to list them.
*   **Aliases**:
    *   Can use **local variables**.
    *   Can use **environment variables**.
    *   **Can be escaped with `\`**.
    *   Are **not recursive**.
    *   Are **not productive when used with positional parameters**.
    *   To list all aliases in the system, use the `alias` command.
    *   Example: `alias logg='ls -1 ~/Music/*ogg'`.

#### Used Files, Terms, and Utilities (from Topic 105)
*   Files: `~/.profile`, `~/.bashrc`, `~/.bash_logout`
*   Terms: `function`, `alias`
*   Utilities: `set`, `history`, `echo`, `printenv`, `declare`, `export`, `unset`, `source` (or `.`), `ps`, `chmod`, `su`.

---

## TOPIC 105.2: Customize or Write Simple Scripts

Shell scripts are text files containing commands used to **automate custom tasks** for users or systems. They can group complex instructions that are too involved for aliases or functions and are maintained like conventional programs.

### 105.2 Lesson 1

This lesson focuses on the structure, execution, variables, and output methods within shell scripts.

*   **Script Structure and Execution**:
    *   The first line of a script is the **shebang (`#!`)**, indicating the interpreter (e.g., `#!/bin/bash`).
    *   Lines starting with `#` (except the shebang) are ignored as **comments**, as are blank lines.
    *   Multiple commands can be placed on the **same line separated by semicolons** (`;`). A newline character also serves as a command separator.
    *   **Command substitution** allows storing the output of a command in a variable using either **backticks** (`` `command` ``) or the **`$()` syntax** (e.g., `OS=`uname -o`` or `OS=$(uname -o)`).
    *   The **length of a variable** (quantity of characters) is returned by prepending a hash `#` before the variable name, requiring curly braces (e.g., `echo ${#OS}`).
    *   **Arithmetic expressions** can also use command substitution.
    *   The `read` command can be used inside a script to **ask the user for input** during execution, storing the value in a specified variable or `REPLY` by default. The `-p` option can display a prompt directly (e.g., `read -p "Your name:" NAME`).
*   **Conditional Execution**:
    *   The `if` construct executes commands based on a conditional expression (e.g., `if [ -x /bin/bash ] ; then ... fi`).
    *   The `else` instruction is optional and defines commands to execute if the condition is false.
    *   `if` structures **must always end with `fi`**.
    *   The `case` construct allows for pattern matching against a variable's value.
        *   Each list of patterns and associated commands must be terminated with `;;`, `; &`, or `;& &`.
        *   The `esac` instruction terminates the `case` construct.
        *   **TIP**: `shopt -s nocasematch` enables case-insensitive pattern matching for `case` and other conditional commands. This setting affects only the current session and sub-shells.
*   **Loop Constructs**: Scripts often automate repetitive tasks using loops.
    *   The `for` construct iterates through a list of items, assigning each item to a variable and executing commands (e.g., `for VARNAME in LIST; do COMMANDS; done`). The `IFS` environment variable defines the delimiting characters for the list.
    *   The `until` construct repeatedly executes a command sequence **until a test command terminates with status 0 (success)**. It requires actions within the loop to ensure a valid stop criterion, to prevent indefinite execution.
    *   The `while` construct is similar to `until`, but it keeps repeating the commands **if the test command terminates with status 0 (success)**.
*   **Script Output**:
    *   The `echo` command displays simple text strings. With the `-e` option, it can display special characters using **escaped sequences** (e.g., `\t` for tabulation, `\n` for newline). Quotes are necessary with `-e`.
    *   The `printf` command provides more control over output formatting, using **C programming language format specifiers** (e.g., `%s`, `%d`). Variables are placed outside the text pattern, which is useful for displaying distinct output formats (e.g., CSV).
*   **Elaborate Example (sync.sh)**: Demonstrates a script to synchronize files.
    *   Uses `set -ef` to immediately exit on non-zero status (`-e`) and disable filename globbing (`-f`).
    *   `mapfile -t LIST < $FILE` reads lines from a file into an array, removing trailing newline characters (`-t`).
    *   Uses `rsync` for selective copying: `-q` (quiet), `-a` (archive mode), `--delete` (deletes destination items not in source).

#### Used Files, Terms, and Utilities (from Topic 105.2)
*   Terms: `shebang`, `positional parameter`, `command substitution`, `arithmetic expression`, `conditional execution`, `loop constructs`, `script output`, `mapfile`.
*   Utilities: `read`, `echo`, `printf`, `if`, `case`, `for`, `until`, `while`, `set`, `rsync`.

---

## TOPIC 106: User Interfaces and Desktops

This topic explores the X Window System, graphical desktop environments, and accessibility features in Linux.

### 106.1 Install and Configure X11

This lesson covers the configuration of the X server.

*   **X Server Configuration**:
    *   The primary configuration file for an X server is `/etc/X11/xorg.conf`. Modern Linux distributions often configure the X server automatically at runtime.
    *   The `xorg.conf` file is divided into `Section` stanzas (e.g., `Section "InputDevice"`) and terminated by `EndSection`.
    *   The `setxkbmap` command can modify a keyboard’s layout during a running X session, but this setting is temporary. For permanent changes, modify `/etc/X11/xorg.conf.d/00-keyboard.conf`.
    *   The `xdpyinfo` command displays information about a running X server instance, including the display name, version, extensions, and screen details.
    *   A permanent `/etc/X11/xorg.conf` file can be generated if needed.

### 106.2 Graphical Desktops

This section discusses desktop environments and remote access protocols.

*   **Desktop Environments**:
    *   Provide a **window manager** that matches the look and feel of its **widget toolkit** (visual elements like buttons).
    *   **Xfce and LXDE** are recommended for low-cost, single-board computers with limited processing power due to their efficiency.
    *   **freedesktop.org** maintains specifications for desktop interoperability, including **Directories locations** for settings and **Desktop entries** (`.desktop` files) for applications.
*   **Remote Desktop Protocols**:
    *   **Virtual Network Computing (VNC)** is a platform-independent tool for viewing and controlling remote desktops, using the **Remote Frame Buffer (RFB) protocol**. It transmits local keyboard/mouse events and sends back screen updates. Multiple VNC servers can run on one machine, each requiring an exclusive TCP port (conventionally starting from 5900).
    *   The **Remote Desktop Protocol (RDP)** is natively supported by both Windows and Linux.

### 106.3 Accessibility

This lesson introduces features designed to make Linux systems more accessible.

*   **Assistive Technologies & Features**:
    *   **Mouse Keys** allow users to control the mouse pointer using the numerical keypad.
    *   The `onboard` package provides a **simple on-screen keyboard** that can be installed and used in any desktop environment.
    *   Mouse pointer behavior, such as the double-click time interval, can be adjusted for users who find clicking difficult.
    *   **Orca** is a screen reader that generates synthesized voice to report screen events and read text. It also works with **refreshable braille displays**.
    *   **Sticky keys** allow users to type keyboard shortcuts one key at a time (e.g., pressing Shift five times can activate it). This helps users unable to press multiple keys simultaneously.
    *   In KDE, the **KMouseTool** application can help users with repetitive strain injuries by clicking the mouse whenever the cursor pauses briefly.
    *   Setting a **large screen font size** in the desktop configuration can make text easier to read for people with visual impairments.

#### Used Files, Terms, and Utilities (from Topic 106)
*   Files: `/etc/X11/xorg.conf`, `/etc/X11/xorg.conf.d/00-keyboard.conf`.
*   Terms: `X Window System`, `X Server`, `Wayland`, `Desktop Environment`, `Widgets`, `XDMCP`, `VNC`, `RFB`, `RDP`, `Mouse Keys`, `On-Screen Keyboard`, `Sticky/Repeat keys`, `Slow/Bounce/Toggle keys`, `Braille Display`, `Screen Magnifier`, `Screen Reader`, `Gestures`, `Voice recognition`, `High Contrast/Large Print Desktop Themes`.
*   Utilities: `setxkbmap`, `xdpyinfo`.

---

## TOPIC 107: Administrative Tasks

This topic focuses on managing users and groups, automating tasks, and configuring localization.

### 107.1 Manage User and Group Accounts and Related System Files

This lesson covers the fundamentals of user and group management in Linux.

*   **User and Group Management**:
    *   While modern Linux offers graphical interfaces, **command-line tools are essential for advanced management**.
    *   **`useradd` command options**:
        *   `-c`: Create a new user account with **custom comments** (e.g., full name).
        *   `-d`: Create a new user account with a **custom home directory**.
        *   `-e`: Set a specific **account expiration date**.
        *   `-f`: Set the number of days after password expiry during which the account will be disabled if the password is not updated.
        *   `-g`: Create a new user account with a specific **primary Group ID (GID)**.
    *   **`usermod` command options**:
        *   `-c`: Add a brief **comment** to an existing user account.
        *   Requires **root privileges**.
    *   **`passwd` command options**:
        *   `-d`: **Delete a user's password** (effectively disabling the user).
        *   `-e`: **Force the user to change their password** at next login.
        *   `-i`: Set the number of **days of inactivity after password expiry** before the account is disabled.
*   **User and Group Database Files**: These files should **not be edited directly**; use provided tools.
    *   `/etc/passwd`: A **world-readable file** containing basic user information, with seven colon-delimited fields: Username, Password (`x` if shadow passwords), User ID (UID), Group ID (GID), GECOS (optional comment), Home Directory, Login Shell.
    *   `/etc/group`: Contains basic group information, with four colon-delimited fields: Group Name, Group Password (`x` if shadow passwords), Group ID (GID), Member List (comma-delimited list of users, excluding primary members).
    *   `/etc/shadow`: Readable only by root, contains **encrypted user passwords** and password aging information, with nine colon-delimited fields. Includes the **Account Expiration Date**.
    *   `/etc/gshadow`: Readable only by root, contains **encrypted group passwords**, with four colon-delimited fields. Includes Group Administrators and Group Members.
*   **`/etc/login.defs` File**: Specifies **configuration parameters controlling user and group creation**, and provides default values for related commands. Directives include `UID_MIN`/`UID_MAX` and `GID_MIN`/`GID_MAX`.
*   **Filtering Databases**:
    *   The `grep` command or a combination of `cat` and `grep` can be used to search these files (e.g., `grep emma /etc/passwd`).
    *   The **`getent` command** displays entries from databases supported by the **Name Service Switch (NSS) libraries**. It requires a database name (e.g., `passwd`, `group`) and an optional lookup key. It does not require root authority.
        *   **NOTE**: `getent` can only access databases configured in the `/etc/nsswitch.conf` file.

### 107.2 Automate System Administration Tasks by Scheduling Jobs

This lesson covers scheduling one-time and recurring tasks using `at`, `cron`, and `systemd` timers.

*   **`cron` (Recurring Jobs)**:
    *   **System crontabs** (e.g., in `/etc/cron.d/`) require an **additional mandatory field for the user account** that will run the job, making it seven fields in total (minute, hour, day of month, month, day of week, user, command).
    *   Multiple values for time fields can be specified using `*`, `,`, `-`, and `/` operators. Month and day of week can be indicated by their first three letters.
    *   **Special Shortcuts for Time Specifications** in crontab files:
        *   `@hourly`: `0 * * * *`
        *   `@daily`: `0 0 * * *`
        *   `@weekly`: `0 0 * * 0`
        *   `@monthly`: `0 0 1 * *`
        *   `@annually` or `@yearly`: `0 0 1 1 *`
    *   **NOTE**: `anacron` is suitable for systems that can be powered off (e.g., desktops, laptops); jobs run the next time the machine is powered on if missed. It's used by root and is out of LPIC-1 scope.
*   **`at` (One-Time Jobs)**:
    *   The `at` command is used to schedule a job to run **only once at a specific time** in the future.
    *   **Key options**:
        *   `-c`: Print the commands of a specific job ID.
        *   `-d`: Delete jobs based on their job ID (alias for `atrm`).
        *   `-f`: Read the job from a file instead of standard input.
        *   `-l`: List pending jobs (alias for `atq`).
        *   `-m`: Send mail to the user at the end of the job, even if there was no output.
        *   `-q`: Specify a queue (single letter `a` to `z` or `A` to `Z`); capital letters are treated as batch jobs.
    *   **Time Specifications for `at`**:
        *   Keywords: `midnight`, `noon`, `teatime` (4 pm), `now` followed by a plus sign (`+`) and a time period (minutes, hours, days, weeks).
        *   Suffixes: `today` or `tomorrow`.
        *   Examples: `at 07:15 AM Jan 01`, `at now +5 minutes`.

### 107.3 Localisation and Internationalisation

This section covers setting time zones, language, and character encoding in Linux.

*   **Time Zones**:
    *   The `timedatectl` command can be used to **check the general status of time and date**, including local time, universal time, RTC time, time zone, and system clock synchronization.
    *   The **default time zone** for the system is kept in `/etc/timezone` (not used by all distros), either by its full descriptive name (e.g., `America/Sao_Paulo`) or UTC offset (e.g., `Etc/GMT+3`).
    *   The `tzselect` command provides an **interactive method to guide the user** towards the correct time zone definition.
    *   The `/etc/localtime` file contains data used by the operating system to adjust its clock. It is usually a **symbolic link to the actual data file** within `/usr/share/zoneinfo/`. Keeping `/usr/share/zoneinfo/` files up-to-date is important as daylight saving definitions may change.
*   **Language and Character Encoding**:
    *   Modern operating systems need a **reference character encoding standard** to represent any written text regardless of the spoken language.
    *   **ASCII** was the first widely used standard but had a limited range based on the English alphabet.
    *   **UTF-8** is the Unicode Standard recommended for adoption by default to ensure compatibility across computer platforms.
    *   The `LANG` variable holds the character encoding intended for the system (e.g., `pt_BR.UTF-8`).
    *   The `locale` command shows all defined variables in the current locale configuration.
    *   The `LC_ALL` variable can be used to **temporarily override all other locale settings** (e.g., `env LC_ALL=en_US.UTF-8 date`). It is not mandatory to set the same locale for all variables.
*   **Encoding Conversion**:
    *   The **`iconv` command** converts files from one character encoding to another.
    *   Syntax: `iconv -f <from_encoding> -t <to_encoding> <input_file> > <output_file>` or using `-o <output_file>`.
    *   `iconv -l` or `--list` lists all supported encodings.
    *   Appending `//TRANSLIT` to the target encoding (`-t ASCII//TRANSLIT`) will transliterate characters not represented in the target character set into similar-looking characters instead of question marks.

#### Used Files, Terms, and Utilities (from Topic 107)
*   Files: `/etc/passwd`, `/etc/group`, `/etc/shadow`, `/etc/gshadow`, `/etc/login.defs`, `/etc/timezone`, `/etc/localtime`, `/usr/share/zoneinfo/`.
*   Terms: `user account`, `group account`, `GID`, `UID`, `GECOS`, `shadow passwords`, `NSS`, `crontab`, `cron job`, `at job`, `systemd timer`, `time zone`, `Daylight Savings Time`, `character encoding`, `locale`, `UTF-8`, `ASCII`.
*   Utilities: `useradd`, `usermod`, `passwd`, `groupadd`, `groupdel`, `gpasswd`, `getent`, `crontab`, `at`, `atq`, `atrm`, `date`, `hwclock`, `timedatectl`, `tzselect`, `iconv`, `locale`.

---

## TOPIC 108: Essential System Services

This topic delves into maintaining system time, system logging, mail transfer agents, and printer management.

### 108.1 Maintain System Time

This lesson covers accurate timekeeping, hardware clocks, and network time synchronization.

*   **System Clock Management**:
    *   **Accurate timekeeping is crucial** for modern computing, especially in network environments.
    *   The `date` command displays or changes the system clock.
        *   `-u` displays UTC time.
        *   `+%s` displays **Unix time** (number of seconds since Epoch: January 1st, 1970 UTC).
        *   **NOTE**: A **future issue for 32-bit Linux systems** will occur on January 19, 2038, when 32 bits become insufficient to store Unix time.
        *   `--date='@<TIMESTAMP>'` or `--date="<DATE_STRING>"` specifies a time to display or parse. `--debug` can verify parsing.
        *   `timedatectl` is the **recommended tool for modern Linux systems (systemd-based)** to check and set time, including NTP synchronization status. It displays local, universal, RTC time, and time zone.
        *   **Legacy commands** for setting time (not recommended on systemd systems): `date --set` or `-s`.
*   **Hardware Clock Management**:
    *   The `hwclock` command views or changes the time maintained on the real-time clock (RTC). Requires elevated privileges.
    *   It can show **"Calculated Hardware Clock drift"** indicating deviation from system time.
    *   `hwclock --systohc` sets the hardware clock from the system clock.
    *   `hwclock --hctosys` sets the system clock from the hardware clock.
*   **Network Time Protocol (NTP)**:
    *   **NTP** synchronizes internet-connected computer systems to highly precise **reference clocks** (atomic clocks). If system time differs, NTP incrementally speeds up or slows down the clock.
    *   **Key NTP terms**:
        *   **Offset**: The absolute difference between system time and NTP time.
        *   **Step**: A single, significant change to system time (if offset > 128ms).
        *   **Slew**: Gradual changes to system time (if offset < 128ms).
        *   **Insane Time**: If the offset is > 17 minutes, the NTP daemon will not make changes, requiring manual intervention.
    *   The **`ntpd` daemon** runs in the background, allowing a machine to consume and provide time. It operates on **TCP Port 123**.
    *   **`pool.ntp.org`** provides a group of servers for network time synchronization that share the load.
    *   `ntpdate` is used for **initial setup when clocks are severely de-synchronized** (>17 minutes offset).
    *   **`ntpq`** monitors `ntpd` operations and status.
    *   **`chrony`** is an alternative NTP implementation, with `chronyd` as its daemon and `chronyc` as its command-line interface.
        *   `chronyc tracking` provides detailed synchronization information (Reference ID, Stratum, Skew, Root delay, Leap status).
        *   `chronyc sources` lists the configured NTP servers.
        *   Servers are configured in `/etc/chrony.conf`, often by uncommenting default `pool.ntp.org` entries.

### 108.2 System Logging

This section covers managing system logs, including `rsyslog` and `systemd-journald`.

*   **Logs and Logging Facilities**:
    *   Logs are essential for system administration, registering system and network events chronologically for troubleshooting, security, and statistics.
    *   **Reliable Event Logging Protocol (RELP)** extends syslog for reliable message delivery.
    *   **`rsyslog`** is the de facto standard logging facility in major distributions. It uses a client-server model and its daemon is `rsyslogd`.
    *   **Log Types**: Generally found in `/var/log/` and classified as system logs or service/program logs.
        *   `/var/log/auth.log`: Authentication activities.
        *   `/var/log/syslog`: Centralized file for most `rsyslogd` logs.
        *   `/var/log/kern.log`: Kernel messages.
        *   `/var/log/messages`: Informative messages not related to the kernel; default remote client log destination.
*   **Viewing Log Files**:
    *   **Plain-text logs**: Use pagers like `less` or `more`. For gzip-compressed logs, use `zless` or `zmore`.
    *   **Filtering**: `grep` is used to search for specific strings.
    *   **Binary log files** require special commands to parse:
        *   `/var/log/wtmp`: User login records, view with `who` or `w`.
        *   `/var/log/btmp`: Failed login attempts, view with `utmpdump` or `last -f`.
        *   `/var/log/faillog`: Failed login attempts, view with `faillog`.
        *   `/var/log/lastlog`: User's last login information, view with `lastlog`.
*   **`rsyslog` Configuration (`/etc/rsyslog.conf`)**:
    *   Divided into `MODULES`, `GLOBAL DIRECTIVES`, and `RULES`.
    *   **RULES** define how messages are filtered and routed based on **facilities** (source subsystem, e.g., `kern`, `user`, `mail`, `daemon`, `auth`, `cron`, `local0-7`) and **priorities/severity levels** (e.g., `emerg` (0), `alert` (1), `crit` (2), `err` (3), `warn` (4), `notice` (5), `info` (6), `debug` (7)).
    *   The minus sign (`-`) before a log file path (e.g., `-/var/log/syslog`) prevents excessive disk writes.
*   **Manual Entries into System Log**: The `logger` command appends messages to `/var/log/syslog`. The `-t` option can supply a tag for the message.
*   **Centralized Logging**: `rsyslog` can send messages to remote servers. **Templates** (e.g., `$template RemoteLogs,"/var/log/remotehosts/%HOSTNAME%/%$NOW%.%syslogseverity-text%.log"`) define dynamic log filenames using **properties** (like `%HOSTNAME%`, `%syslogseverity-text%`, `%NOW%`) enclosed in percent signs.
*   **Log Rotation (`logrotate`)**: Manages and archives log files to prevent them from growing too large.
    *   Run daily via `/etc/cron.daily/logrotate`.
    *   Reads configuration from `/etc/logrotate.conf` (global options) and `/etc/logrotate.d/` (package-specific configs).
    *   **Common directives**: `weekly` (rotate weekly), `rotate N` (keep N rotations), `create` (create new empty log after rotation), `compress` (compress old logs, default gzip), `missingok` (no error if log missing), `notifempty` (don't rotate if empty), `delaycompress` (postpone compression to next cycle), `sharedscripts` (run `prerotate`/`postrotate` scripts once per pattern).
*   **Kernel Ring Buffer**: The `dmesg` command prints the contents of the kernel ring buffer, typically used with `grep`.
*   **`systemd-journald` (Standard Logging Service)**:
    *   Centralizes all logs, does not require log rotation, and logs can be disabled, loaded in RAM, or made persistent.
    *   Receives logging information from various sources including kernel messages, service stdout/stderr, and audit records.
    *   The journal is a **binary file**, not plain text, and must be queried using the `journalctl` command.
    *   **`journalctl` Querying**: Requires root or `sudo`.
        *   `journalctl`: prints entire journal chronologically.
        *   `-r`: prints messages in reverse chronological order.
        *   `-e`: jumps to the end of the journal.
        *   `-n <value>` or `--lines=<value>`: prints the most recent N lines (default 10).
        *   `-k` or `--dmesg`: equivalent to the `dmesg` command (kernel entries).
        *   **Navigation**: `PageUp`, `PageDown`, arrow keys for movement; `>` to end, `<` to beginning.
        *   **Searching**: `/` for forward search, `?` for backward search. `N` for next match, `Shift + N` for previous.
        *   **Filtering**:
            *   **Boot number**: `--list-boots` lists available boots (0 for current, -1 for previous). `-b` or `--boot` shows messages from a specific boot; requires persistent journal for previous boots.
            *   **Priority (`-p`)**: Filters by severity level (e.g., `journalctl -p err`). Higher priority messages are also included by default (e.g., `err` includes `crit`, `alert`, `emerg`). Can specify a range (e.g., `journalctl -p warning..crit` or `journalctl -p 4..2`).
            *   **Time interval**: `--since` and `--until` with `YYYY-MM-DD HH:MM:SS` format. Keywords like `yesterday`, `today`, `tomorrow`, `now` are also accepted.
            *   **Program**: `journalctl /path/to/executable`.
            *   **Unit (`-u`)**: Shows messages for a specified `systemd` unit (e.g., `journalctl -u ssh.service`).
            *   **Fields**: Filter by specific journal fields using `<field-name>=<value>` (e.g., `PRIORITY=3`, `SYSLOG_FACILITY=1`, `_PID=1`, `_BOOT_ID=<ID>`, `_TRANSPORT=<type>`). `_TRANSPORT` types include `audit`, `driver`, `syslog`, `journal`, `stdout`, `kernel`. Fields can be combined for logical AND, or with `+` for logical OR.
    *   **Manual Entries in System Journal**: The `systemd-cat` command sends standard input, output, and error to the journal. The `-p` option specifies a priority level.
        *   **NOTE**: Journal entries with an **emergency priority level are printed in bold red** on most systems.
    *   **Persistent Journal Storage**:
        *   Journaling can be turned off, kept in memory (volatile, `/run/log/journal/`, lost on reboot), or made persistent on disk (`/var/log/journal/`).
        *   The `/etc/systemd/journald.conf` file controls storage behavior via the `Storage=` option, with values `volatile`, `persistent`, `auto` (default), or `none`.
        *   Restart `systemd-journald` (e.g., `sudo systemctl restart systemd-journald`) for changes to take effect.
        *   Journal files use `.journal` or `.journal~` suffixes; corrupted files are renamed with `~`.
    *   **Deleting Old Journal Data (Journal Size)**:
        *   `journalctl --disk-usage` shows total disk space occupied by journal files.
        *   Systemd logs default to a maximum of **10% of filesystem size (max 4GiB)**. Old logs are removed to stay within this limit.
        *   Configuration options in `/etc/systemd/journald.conf` for managing size limits: `SystemMaxUse=`, `RuntimeMaxUse=`, `SystemKeepFree=`, `RuntimeKeepFree=`, `SystemMaxFileSize=`, `RuntimeMaxFileSize=`, `SystemMaxFiles=`, `RuntimeMaxFiles=`.
        *   **Vacuuming**: Manual cleaning of **archived journal files**.
            *   `--vacuum-time=<time>`: Deletes messages older than the specified timeframe (e.g., `1months`).
            *   `--vacuum-size=<size>`: Deletes files until total size is below specified value (e.g., `100Mib`).
            *   `--vacuum-files=<number>`: Limits the number of archived files.
            *   `--rotate` (SIGUSR2): Requests immediate rotation of journal files, deleting active logs.
            *   `--flush` (SIGUSR1): Requests flushing journal files from `/run/` to `/var/` for persistence.
            *   `--sync` (SIGRTMIN+1): Requests all unwritten log data to be written to disk.
        *   **Retrieving Journal Data from a Rescue System**:
            *   `journalctl -D </path/to/dir>` or `--directory=`: Specifies an alternative directory where `journalctl` will search for journal files.
            *   `--merge` (`-m`): Merges entries from all available journals.
            *   `--file`: Shows entries in a specific journal file.
            *   `--root`: Specifies an alternative root directory to search for journal files.
        *   **Forwarding Log Data to a Traditional Syslog Daemon**: Messages can be forwarded to `/run/systemd/journal/syslog` using `ForwardToSyslog=yes` in `journald.conf`. A syslog daemon can also read directly if `Storage` is not `none`. Other forwarding options include `ForwardToKMsg`, `ForwardToConsole`, `ForwardToWall`.

#### Used Files, Terms, and Utilities (from Topic 108.2)
*   Files: `/etc/rsyslog.conf`, `/var/log/`, `/etc/logrotate.conf`, `/etc/logrotate.d/`, `/etc/systemd/journald.conf`, `/var/log/journal/`, `/run/log/journal/`.
*   Terms: `logs`, `rsyslogd`, `RELP`, `log types`, `facilities`, `priorities`, `rules`, `daemon`, `log rotation`, `kernel ring buffer`, `systemd-journald`, `journal`, `units`, `targets`, `persistent storage`, `volatile storage`, `vacuuming`, `boot ID`, `field filtering`, `property replacer`.
*   Utilities: `logger`, `logrotate`, `journalctl`, `systemd-cat`, `systemctl`, `less`, `more`, `zless`, `zmore`, `grep`, `head`, `tail`, `dmesg`, `who`, `w`, `utmpdump`, `last`, `faillog`.

### 108.3 Mail Transfer Agent (MTA) Basics

This lesson introduces the fundamentals of Mail Transfer Agents and email management.

*   **Mail Transfer Agent (MTA) Functions**:
    *   Maintain the **outbox queue** for messages to be sent.
    *   Communicate with remote MTAs using **SMTP (Simple Mail Transfer Protocol)** over TCP/IP.
    *   Maintain an **individual inbox for every local account**, typically storing messages in the **mbox format** (a single text file).
*   **Mail Delivery**:
    *   The sender's MTA queries the **DNS service for the corresponding MX record** to find the destination MTA's IP address. If multiple MX records exist, they are contacted by priority.
    *   **Security Concern**: An **open relay** MTA blindly relays email, allowing unknown users to impersonate others and send harmful emails. It's recommended to accept connections only from authorized domains and implement secure authentication.
*   **Email Sending Commands**:
    *   **SMTP commands** can be used directly for sending (e.g., `HELO`, `MAIL FROM`, `RCPT TO`, `DATA`, `QUIT`). A period (`.`) on a line by itself ends the message.
    *   The **`sendmail` command** (part of the sendmail MTA but often emulated by others like Postfix) is used for composing new messages, allowing manual entry of email headers in a user-friendly way.
    *   The **`mailq` command** (executed by root) shows all non-delivered messages. `sendmail -q` immediately processes the mail queue.
    *   Incoming messages are stored in `/var/spool/mail/<user>` or `/var/mail/<user>`.
    *   The **`mail` command** is a Mail User Agent (MUA) for sending emails; use `-s` for the subject. Message body can be provided via here-line redirection, file content, or piped command output. `Ctrl + D` ends the message if typed directly.
*   **Delivery Customization (Aliases)**:
    *   Aliases are configured in files like `/etc/aliases` or `/etc/aliases.db`.
    *   The `newaliases` command compiles the alias database.
    *   Alias destinations can include: another user, a file (e.g., `/dev/null`), a pipe to a command (e.g., `| /path/to/script.sh`), or an include file (`:include:/var/local/destinations`).
*   **Email Clients (MUAs)**: It is recommended to use email client programs (e.g., Thunderbird, Evolution, KMail) to read mailboxes, as they parse the files and offer additional features.

#### Used Files, Terms, and Utilities (from Topic 108.3)
*   Files: `~/.forward` (implied by content but not explicitly cited), `/etc/aliases`, `/etc/aliases.db`, `/var/spool/mail/`.
*   Terms: `MTA`, `SMTP`, `MUA`, `mbox format`, `open relay`, `email alias`, `email forwarding`, `outbox queue`, `inbox`.
*   Utilities: `sendmail`, `mail`, `mailq`, `newaliases`, `postfix`, `sendmail`, `exim` (general awareness).

### 108.4 Manage Printers and Printing

This lesson covers printing in Linux using CUPS and related commands.

*   **CUPS (Common Unix Printing System)**:
    *   A widely-used platform for printing to local and remote printers. It supersedes the legacy LPD protocol but provides backward compatibility.
    *   **CUPS Configuration Files**:
        *   `/etc/cups/cupsd.conf`: The primary configuration file for the CUPS service, controlling access to its web interface.
        *   `/etc/cups/printers.conf`: Contains definitions for each configured printer and its print queue, enclosed in `<Printer></Printer>` stanzas. **WARNING**: Do not modify this file at the command line while CUPS is running.
        *   `/etc/cups/ppd/`: A directory holding **PostScript Printer Description (PPD) files** (`.ppd` extension) that define a printer's operating capabilities.
*   **CUPS Web Interface (`http://localhost:631`)**: Provides administrative links for installing and managing printers, including network printers.
    *   The "Printers" tab lists all managed printers and their status, deriving information from `/etc/cups/printers.conf`.
    *   When adding a printer, CUPS can often automatically determine the correct PPD file based on the device URI, especially with the "everywhere" model option.
    *   **`lpinfo`**: A deprecated command that can query locally installed PPD files to see what is available, using `--make-and-model` and `-m` options.
*   **Printing Documents**:
    *   The `lpr` command sends a document to a print queue.
        *   `lpr <file>` sends to the default printer.
        *   `lpr -P <printer_name> <file>` sends to a specific printer.
        *   `lpr -o <option>` applies **document layout modifications**. Common options include `landscape`, `two-sided-long-edge`/`two-sided-short-edge`, `media=<size>` (e.g., `A4`, `Letter`), `collate` (true/false), `page-ranges` (e.g., `5-7,9,15`), `fit-to-page`, `outputorder` (normal/reverse).
        *   `-#N` prints multiple copies (where `N` is the number of copies).
*   **Managing Print Jobs**: Each print job receives a job ID from CUPS.
    *   **`lpq`**: Views print jobs submitted by the current user. Use `-a` to show all printer queues managed by CUPS.
    *   **`lprm`**: Deletes print jobs by their job ID (e.g., `lprm 20`). `lprm -` deletes all jobs in a print queue.
    *   **`cancel`**: An alternative command to cancel print jobs by ID (e.g., `cancel ACCOUNTING-LASERJET-20`).
    *   **`lpmove`**: Moves a print job from one queue to another (e.g., `sudo lpmove FRONT-DESK-2 ACCOUNTING-LASERJET`). This typically requires elevated privileges.
    *   `lpstat -p -d` can be used to verify printer status, including whether it's enabled or disabled.
    *   To disable a printer (and pause new jobs): `cupsdisable <printer_name>` [implied by guided exercises].
    *   To remove a printer: `sudo lpadmin -x <printer_name>`.

#### Used Files, Terms, and Utilities (from Topic 108.4)
*   Files: `/etc/cups/`, `/etc/cups/cupsd.conf`, `/etc/cups/printers.conf`, `/etc/cups/ppd/`.
*   Terms: `CUPS`, `print queue`, `PPD file`, `PostScript Printer Description`, `device URI`, `IPP`, `print job ID`.
*   Utilities: `lpr`, `lprm`, `lpq`, `lpadmin`, `lpoptions`, `lpstat`, `cancel`, `lpmove`, `cupsenable`, `cupsaccept`.

---

## TOPIC 109: Networking Fundamentals

This topic covers internet protocols, persistent network configuration, and basic network troubleshooting.

### 109.1 Fundamentals of Internet Protocols

This lesson covers core internet protocols like IP, TCP, UDP, and ICMP, along with IPv4 and IPv6.

*   **IP (Internet Protocol)**:
    *   The values 127.x.x.x are reserved for **loopback addresses** (e.g., `127.0.0.1`), used for tests and internal communication. Addresses above 224 are not used as host addresses but for multicast and other purposes.
    *   **TTL (Time To Live)** is an important field in an IP packet that defines its lifetime. It's a counter decremented by each gateway/router (or "hop"). If the counter reaches 0, the packet is discarded.
*   **Transport Protocols**: Services use a transport protocol (TCP or UDP) based on their requirements.
    *   **Transmission Control Protocol (TCP)**: A **connection-oriented** transport protocol that ensures all packets are delivered properly, verifying integrity, order, and handling re-transmission. Applications do not need to implement data flow control.
    *   **User Datagram Protocol (UDP)**: Establishes a connection but **does not control data transmission** (no checks for lost or out-of-order packages). Applications are responsible for necessary controls. UDP allows for **better performance** in data flow.
*   **Internet Control Message Protocol (ICMP)**: Used for error reporting and network diagnostics.
*   **IPv6**: Offers more functionality than IPv4.
    *   **Multicast addresses** (an IPv6 address type) are used to send packets to all interfaces belonging to a group of hosts.
    *   **Neighbor Discovery Protocol (NDP)** is part of IPv6 and can discover information like other nodes, duplicate addresses, routes, DNS servers, and gateways.

### 109.2 Persistent Network Configuration

This lesson focuses on configuring network interfaces using NetworkManager and systemd-networkd.

*   **Network Interface Configuration**:
    *   Every node in a TCP/IP network must configure its network adapter to enable communication.
    *   The `ip a` command (or `nmcli device`) can be used to display information about network interfaces. These commands do not modify settings and can be run by unprivileged users.
    *   Linux uses a **naming convention for network interfaces** (e.g., `en` for Ethernet, `wl` for WLAN, `ww` for WWAN, followed by suffixes indicating physical location).
    *   The `ifup` and `ifdown` commands manage network interfaces. Interfaces are typically listed in `/etc/network/interfaces` with `auto` and `iface` lines.
        *   **WARNING**: Network configuration methods used by `ifup`/`ifdown` are **not standardized across all Linux distributions** (e.g., CentOS uses a different directory and format).
*   **Local and Remote Names**:
    *   The **static hostname** of a system is defined in `/etc/hostname` and set at boot. It should ideally be ASCII lowercase, without spaces or dots.
    *   The `hostnamectl` command can set the static hostname (e.g., `hostnamectl set-hostname storage`) and display detailed hostname information.
    *   The `/etc/hosts` file is used to **resolve names to IP addresses** (both IPv4 and IPv6) locally. It's commonly used for critical infrastructure or situations where DNS is not feasible.
    *   The `/etc/nsswitch.conf` file configures the **order in which name resolution is done** for various databases (e.g., `hosts: dns [!UNAVAIL=return] files`). A `#` indicates a comment.
    *   The `/etc/resolv.conf` file configures host resolution via **DNS**.
        *   **`nameserver`**: Specifies the IPv4 or IPv6 address of DNS servers (up to three).
        *   **`search`**: Allows short form searches by appending a list of domains (up to six).
        *   **`domain`**: Sets the local domain name; similar to `search` but mutually exclusive (last one in the file is used).
        *   **`options`**: Sets resolver behavior, such as `timeout`.
        *   **NOTE**: Manual edits to `/etc/resolv.conf` may be **overwritten by network configuration tools** like NetworkManager.
*   **Dynamic Network Infrastructure Management**:
    *   Modern Linux distributions use tools like **NetworkManager** and **`systemd-networkd`** for comprehensive management of dynamic and heterogeneous network connections.
    *   **NetworkManager Command Line Interface (`nmcli`)**:
        *   `nmcli general`: Shows overall connectivity status (`STATE`, `CONNECTIVITY`, `WIFI-HW`, `WWAN-HW`).
        *   `nmcli device wifi list`: Scans for available Wi-Fi networks.
        *   `nmcli device wifi connect <SSID> [password <PASSWORD>] [hidden yes]`: Connects to a Wi-Fi network.
        *   `nmcli connection down <name>`: Deactivates a network connection.
    *   **`systemd-networkd`**: Uses network configuration files in `/etc/systemd/network/` (e.g., `30-lan.network`).
        *   The `[Match]` section can specify interfaces by `Name=` (supporting shell-style globs like `en*` for all Ethernet interfaces) or `MACAddress=`.
    *   The `wpa_passphrase` command can be used to generate WPA pre-shared keys, accepting the passphrase as an argument directly after the SSID.

### 109.3 Basic Network Troubleshooting

This lesson covers tools and techniques for configuring and debugging network problems.

*   **Network Configuration and Troubleshooting Tools**:
    *   The **`ip` command** is a modern and powerful utility for viewing and configuring network interfaces, addresses, and routing tables. Its subcommands have their own man pages (e.g., `man ip-link`, `man ip-route`), and `ip <subcommand> help` provides built-in help.
    *   **Legacy network tools** (still in common use but superseded by `ip` and `ss`): `ifconfig`, `netstat`, `route`.
    *   **`ip link`**: Displays link layer information about network interfaces (e.g., `lo`, `enp0s3`). It can also configure spanning tree options for bridge types.
    *   **`ip route`**: Displays the kernel's routing table. It shows destinations, interfaces, routing protocols, scope, and metric.
        *   The routing table can be **backed up and restored** using `ip route save > <file>` and `ip route restore < <file>`.
    *   **`ip neighbour`**: Displays the ARP cache.
    *   **Packet Sniffers**: Tools like `tcpdump` and `wireshark` are useful for troubleshooting by viewing and recording packets on a network interface.
*   **Testing Connections**:
    *   **`ping`** (IPv4) and **`ping6`** (IPv6): Send ICMP echo requests to test host reachability. The `-c` option specifies the number of packets. Note that firewalls or ACLs may block ICMP, so a host might be reachable even if ping fails.
    *   **`traceroute`** (IPv4) and **`traceroute6`** (IPv6): Trace the route packets take to a destination. By default, they send UDP packets to high-numbered ports. Output shows router interfaces (hops), round trip times, and IP addresses/DNS names. An asterisk (`*`) indicates a missed response.
        *   Requires root access for certain options.
        *   `-I`: Uses ICMP echo requests instead of UDP (often more effective).
        *   `-T -p <port>`: Uses TCP to a specified port (useful if ICMP is blocked).
        *   `-i <interface>`: Forces `traceroute` to use a different interface.
        *   `--mtu`: Can report MTU (Maximum Transmission Unit) sizes along the path.
    *   **`tracepath`** (IPv4) and **`tracepath6`** (IPv6): Similar to `traceroute` but specifically designed to find the **smallest MTU** along a path. It sends large UDP datagrams and can detect path MTU.
    *   The `nc` program (**netcat**) can send or receive arbitrary data over TCP or UDP network connections.
    *   The `ss` command displays **socket information**, including `Recv-Q` (packets received but not processed) and `Send-Q` (sent but not acknowledged packets).

### 109.4 Configure Client Side DNS

This lesson explains how to configure client-side DNS resolution and use related command-line tools.

*   **Name Resolution Fundamentals**:
    *   **Name resolution services** translate easy-to-remember names (like hostnames) into numbers (like IP addresses) and vice versa.
    *   **DNS Classes**:
        *   **`IN`**: For internet addresses using the TCP/IP stack (most common).
        *   `CH`: For ChaosNet (obsolete).
        *   `HS`: For Hesiod (old service for storing user/group entries in DNS).
*   **Configuration Files for Name Resolution**:
    *   `/etc/nsswitch.conf`: Configures the **order of name lookup methods** for various databases (e.g., `passwd`, `group`, `hosts`, `services`). It defines which sources (like `files`, `dns`, `nis`) are tried and under what conditions. Comments start with `#`.
    *   `/etc/resolv.conf`: Configures **host resolution via DNS**.
        *   `nameserver`: Specifies IPv4 or IPv6 addresses of DNS servers (up to three).
        *   `search`: Defines a list of domains to try when a short hostname is provided (e.g., `search lpi.org`).
        *   `domain`: Sets the local domain name, similar to `search` but mutually exclusive.
        *   `options`: Configures resolver behavior (e.g., `timeout:3`).
        *   **NOTE**: This file can be automatically generated by network management tools like NetworkManager, which might overwrite manual changes.
    *   `/etc/hosts`: Maps **IP addresses to hostnames** and vice versa. It's used for local resolution, especially for hosts not handled by DNS (e.g., loopback addresses).
*   **Name Resolution Tools**:
    *   **`getent`**: Displays entries from databases configured by the Name Service Switch (NSS) libraries. It can query for different data types (e.g., `hosts`, `group`) and can specify a source using `-s` (e.g., `getent -s files hosts learning.lpi.org`).
    *   **`host`**: A simple program for **DNS lookups**.
        *   Without options: returns A, AAAA, and MX records for a name, or PTR for an IP.
        *   `-t <record_type>`: specifies the type of DNS record to retrieve (e.g., `NS`, `SOA`, `MX`).
        *   Can query a specific name server by providing its IP/hostname as the last argument.
    *   **`dig`**: A more **verbose tool for querying DNS servers**, typically used for troubleshooting DNS server configurations.
        *   By default, it queries for A records.
        *   Output is divided into sections: Header, Question, Answer, Authority, Additional.
        *   `-t <record_type>`: Specifies the type of DNS record (e.g., `SOA`, `MX`).
        *   **Options (`+<option_name>`)** can fine-tune output and queries:
            *   `+short`: Suppresses all output except the result.
            *   `+noall +answer +question`: Displays only the query and response sections.
            *   `+nocookie`: Disables specific EDNS extensions.
        *   Defaults for `dig` can be overridden by creating a `.digrc` file in the home directory.

#### Used Files, Terms, and Utilities (from Topic 109.4)
*   Files: `/etc/hosts`, `/etc/resolv.conf`, `/etc/nsswitch.conf`.
*   Terms: `name resolution`, `DNS`, `DNS classes (IN, HS, CH)`, `nameserver`, `search domain`, `domain`, `TTL`, `query`, `record types (A, AAAA, MX, NS, SOA, PTR)`.
*   Utilities: `host`, `dig`, `getent`.

---

## TOPIC 110: SECURITY

This topic covers security administration, host security, and data encryption.

### 110.1 Perform Security Administration Tasks

This lesson focuses on managing security aspects such as file permissions, passwords, open ports, user limits, and privilege escalation.

*   **File Permissions (SUID and SGID)**:
    *   **SUID (Set User ID)** and **SGID (Set Group ID)** are special permissions that allow an executable file to run with the permissions of its owner (SUID) or group (SGID) instead of the user running it.
    *   The `find` command is used to locate files with these permissions:
        *   `find -perm <numeric/symbolic_value>`: finds files with **only** the specified permission.
        *   `find -perm -<numeric/symbolic_value>`: finds files having the specified permission **and other permissions** (e.g., `find /usr/bin -perm -4000` for SUID).
        *   `find -perm /<numeric/symbolic_value>`: finds files having **either** of the specified permissions (e.g., `find /usr/bin -perm /6000` for SUID or SGID).
    *   **Sticky Bit**: A third special permission, mostly used on directories (like `/tmp`), to prevent users from deleting or moving files other than their own, even if they have write permission to the directory.
        *   Set with `chmod +t <directory>` or `chmod 1xxx <directory>` (e.g., `chmod 1755 ~/temporal`).
        *   Found with `find -perm -1000` or `find -perm /1000`.
*   **Password Management and Aging**:
    *   The `chage` command allows changing a user's password expiry information (e.g., minimum/maximum days between changes, warning period, expiration date).
*   **Discovering Open Ports**:
    *   **`lsof` (list open files)**: A powerful utility that can list open network files (sockets) for a host and port (e.g., `lsof -i@192.168.1.55:22`).
    *   **`fuser`**: Finds processes accessing files, including network ports/sockets. Use with `-n <protocol>` (e.g., `tcp`, `udp`) and the port number (e.g., `fuser -vn tcp 80` for Apache's default port).
    *   **`netstat`**: Lists network connections, routing tables, interface statistics. Used to list listening UDP sockets (`netstat -lu`).
    *   **`nmap` (network mapper)**: A port scanner used to discover open ports on a host or range of hosts.
        *   Can scan multiple hosts, host ranges (e.g., `192.168.1.3-20`), or subnets (e.g., `192.168.1.*` or `192.168.1.0/24`).
        *   Can exclude specific hosts using `--exclude`.
        *   `-F`: Runs a fast scan on the 100 most common ports.
        *   `-v`: Provides verbose output (use `-vv` for more).
        *   Scan all ports: `nmap -p 1-65535 localhost` or `nmap -p- localhost`.
*   **Limits on User Logins, Processes, and Memory Usage**:
    *   The **`ulimit` command** displays or sets resource limits for the shell and its child processes.
    *   `ulimit -a`: Displays all current limits.
    *   `-S`: Displays or sets **soft limits** (current enforced limits).
    *   `-H`: Displays or sets **hard limits** (maximum allowed limits, can only be increased by root).
    *   Resource options include: `-u` (max number of user processes), `-m` (max resident set size (RSS)).
    *   Limits can be set to a number, `soft`, `hard`, or `unlimited`.
*   **Dealing with Logged-in Users**:
    *   `who`: Shows currently logged-in users.
    *   `w`: Shows who is logged in and what they are doing.
    *   `last`: Shows a listing of last logged-in users and system reboots, pulling information from `/var/log/wtmp`. Can filter by username.
*   **Privilege Escalation (`su` and `sudo`)**:
    *   The `/etc/sudoers` file configures `sudo` access, specifying which users or groups can run commands as other users (typically root).
    *   Format example: `root ALL=(ALL:ALL) ALL` means root can login from any host, as any user or group, and run any command. Group names are prefixed with `%` (e.g., `%sudo`).

### 110.2 Setup Host Security

This lesson covers improving authentication, using superdaemons, checking services, and TCP wrappers.

*   **Authentication Security with Shadow Passwords**:
    *   Basic user account data is in `/etc/passwd`. The password hash is stored in `/etc/shadow` for improved security.
    *   **`passwd -u <user>`** unlocks a user account.
    *   **`chage -E <date>`** can set or remove account expiration dates (e.g., `chage -E -1 mary` to set to never) .
*   **Superdaemons (`xinetd`)**:
    *   `xinetd` is a superdaemon that controls access to network services **on demand**, leaving a service inactive until it's explicitly called. This reduces the attack surface.
    *   Configuration files for services are typically in `/etc/xinetd.d/`.
    *   Key configuration options within a service block: `service <name/port>`, `disable = yes/no` (to temporarily disable/enable).
*   **Checking Services for Unnecessary Daemons**: It is important to disable network services not in use to improve security. (The sources don't detail the command for this, but `systemctl list-units --type=service` is a common method outside the provided excerpts).
*   **TCP Wrappers**: Act as a **simple firewall** to control access to network services. Configuration files are `hosts.allow` and `hosts.deny` [implied by context but not explicitly stated or shown in excerpts].

### 110.3 Securing Data with Encryption 

This topic covers using OpenSSH for secure remote access and GnuPG for data encryption and digital signatures.

#### OpenSSH Client Configuration and Usage 

*   **SSH (Secure Shell)**: A protocol designed for **secure remote login sessions** and encrypted information exchange, authenticating both hosts and users. It replaced insecure solutions like `telnet`, `rlogin`, or `FTP`. OpenSSH is a free and open-source implementation, with version 2.0 being the recommended current version.
*   **Key Pair Generation**:
    *   The `ssh-keygen` command generates public/private key pairs (e.g., `ssh-keygen -t ecdsa`). The **private key** (e.g., `id_ecdsa`) and **public key** (e.g., `id_ecdsa.pub`) are typically stored in the `~/.ssh/` directory.
    *   **NOTE**: In **asymmetric cryptography** (public-key cryptography), keys are mathematically related so that data encrypted by one can only be decrypted by the other.
    *   The `-b` option can specify the key size in bits (e.g., `ssh-keygen -t ecdsa -b 521`).
*   **Authentication**:
    *   The public key must be **added to the `~/.ssh/authorized_keys` file on the remote host** for the user you want to log in as. This can be done via `scp` or by piping the public key's content over SSH (e.g., `cat id_ecdsa.pub | ssh user@remote 'cat >> .ssh/authorized_keys'`).
    *   If no passphrase is used during key creation, automatic login occurs, but this can be insecure if the private key is compromised.
    *   The **`ssh-agent` (SSH authentication agent)** is a daemon that holds private keys in memory, combining security with convenience by avoiding repeated passphrase entries during a session.
*   **Public-Key Algorithms**:
    *   **RSA**: Secure and widely used, minimum key size 1024 bits (default 2048).
    *   **DSA**: Considered insecure and **deprecated as of OpenSSH 7.0**. DSA keys must be exactly 1024 bits.
*   **OpenSSH Server Host Keys**: Server host keys (private and public) are stored in `/etc/ssh/` (e.g., `ssh_host_rsa_key`, `ssh_host_rsa_key.pub`). A **fingerprint** is a cryptographic hash of a public key, used for simplified key management.
*   **SSH Port Tunnels (Port Forwarding)**:
    *   A powerful forwarding facility that tunnels and encrypts traffic from a source port through an SSH process to a destination host and port.
    *   Provides important advantages like securing otherwise unencrypted protocols.
    *   Example: `ssh -L 8585:www.gnu.org:80 -Nf user@remote` forwards local port 8585 to `www.gnu.org:80` via the remote SSH server.
        *   `-N`: Prevents execution of remote commands (only port forwarding).
        *   `-f`: Sends `ssh` to the background after authentication.

#### GnuPG Configuration, Usage, and Revocation 

*   **GnuPG (GNU Privacy Guard)**: An excellent tool for **encrypting/decrypting and digitally signing/verifying files and emails**. It uses public key cryptography.
*   **GnuPG Configuration (`~/.gnupg/`)**:
    *   Generate a key pair using `gpg --gen-key`. This process prompts for a user ID (name and email) and a strong passphrase.
    *   The `~/.gnupg/` directory contains important files:
        *   `openpgp-revocs.d`: Stores the **revocation certificate** (highly restricted permissions).
        *   `private-keys-v1.d`: Stores **private keys** (highly restricted permissions).
        *   `pubring.kbx`: The **public keyring**.
        *   `trustdb.gpg`: The **trust database**.
*   **Key Distribution**:
    *   Export a public key to a file using `gpg --export <USER-ID> > <file.pub.key>`.
    *   The `-a` or `--armor` option creates **ASCII armored output**, which can be safely emailed (instead of binary).
    *   Public keys are sent to recipients (e.g., via `scp`) so they can encrypt messages for you.
    *   **Key servers** are used for **global public key distribution**.
*   **Key Revocation**:
    *   To revoke a private key, first **create a revocation certificate** using `gpg --gen-revoke <USER-ID>`. Select a reason (e.g., "Key has been compromised"). Save it as an ASCII armored file (e.g., `revocation_file.asc`).
 output.
*   **Decrypting Files**:
    *   `gpg --decrypt <encrypted_file>` will decrypt the message (requires the private key's passphrase).
    *   The `--output <new_file>` option can save the decrypted content to a new file.
*   **Signing and Verifying Files**:
    *   `gpg --sign <file>` creates a detached signature file (e.g., `file.sig`).
    *   `gpg --clearsign <file>` creates a cleartext signature (the original file content is still readable, with the signature embedded).
    *   `gpg --verify <signed_file.sig>` verifies the signature.
*   **`gpg-agent`**: A daemon that manages private keys for GnuPG, started on demand by `gpg`.

#### Used Files, Terms, and Utilities (from Topic 110.3)
*   Files: `~/.ssh/id_rsa`, `~/.ssh/id_rsa.pub`, `~/.ssh/id_dsa`, `~/.ssh/id_dsa.pub`, `~/.ssh/id_ecdsa`, `~/.ssh/id_ecdsa.pub`, `~/.ssh/id_ed25519`, `~/.ssh/id_ed25519.pub`, `/etc/ssh/ssh_host_rsa_key`, `/etc/ssh/ssh_host_rsa_key.pub`, `/etc/ssh/ssh_host_dsa_key`, `/etc/ssh/ssh_host_dsa_key.pub`, `/etc/ssh/ssh_host_g/trustdb.gpg`.
*   Terms: `encryption`, `decryption`, `digital signature`, `public key cryptography`, `private key`, `public key`, `key pair`, `SSH`, `OpenSSH`, `SSH agent`, `RSA`, `DSA`, `ECDSA`, `Ed25519`, `host key`, `fingerprint`, `port tunnel`, `port forwarding`, `X11 tunnels`, `GnuPG`, `key revocation`, `USER-ID`, `KEY-ID`, `ASCII armored output`, `keyservers`, `gpg-agent`, `mbox format`.
*   Utilities: `ssh`, `ssh-keygen`, `ssh-agent`, `ssh-add`, `gpg`, `gpg-agent`, `scp`, `cat`, `lynx`.

---