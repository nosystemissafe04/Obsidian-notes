## **GREP Commands**

|Category|Command|Description|
|---|---|---|
|**Basic Search**|grep "pattern" file.txt|Search for pattern in file|
|**Basic Search**|grep -i "pattern" file.txt|Case-insensitive search|
|**Basic Search**|grep -r "pattern" /path/to/directory|Recursive search in directory|
|**Basic Search**|grep -v "pattern" file.txt|Invert match (exclude pattern)|
|**Options**|grep -n "pattern" file.txt|Show line numbers|
|**Options**|grep -c "pattern" file.txt|Count matching lines|
|**Options**|grep -l "pattern" *.txt|List filenames with matches|
|**Options**|grep -w "word" file.txt|Match whole words only|
|**Options**|grep -o "pattern" file.txt|Show only matched parts|
|**Context**|grep -A 3 "pattern" file.txt|Show 3 lines after match|
|**Context**|grep -B 3 "pattern" file.txt|Show 3 lines before match|
|**Context**|grep -C 3 "pattern" file.txt|Show 3 lines before and after|
|**Multiple**|grep -e "pattern1" -e "pattern2" file.txt|Multiple patterns|
|**Regex**|grep -E "^[0-9]+" file.txt|Lines starting with numbers|

## **SED Commands**

|Category|Command|Description|
|---|---|---|
|**Substitution**|sed 's/old/new/' file.txt|Replace first occurrence per line|
|**Substitution**|sed 's/old/new/g' file.txt|Replace all occurrences globally|
|**Substitution**|sed 's/old/new/2' file.txt|Replace second occurrence per line|
|**Substitution**|sed 's/old/new/gi' file.txt|Global case-insensitive replacement|
|**Line Operations**|sed '5d' file.txt|Delete line 5|
|**Line Operations**|sed '1,10d' file.txt|Delete lines 1-10|
|**Line Operations**|sed '6,$d' file.txt|Delete from line 6 to end|
|**Line Operations**|sed '/pattern/d' file.txt|Delete lines matching pattern|
|**Line Operations**|sed -n '1,10p' file.txt|Print only lines 1-10|
|**Advanced**|sed -i 's/old/new/g' file.txt|Edit file in-place|
|**Advanced**|sed -i.bak 's/old/new/g' file.txt|Edit in-place with backup|
|**Advanced**|sed '5a\New line text' file.txt|Append text after line 5|
|**Advanced**|sed '5i\New line text' file.txt|Insert text before line 5|
|**Advanced**|sed '5c\Replacement line' file.txt|Replace entire line 5|
|**Pattern-Based**|sed '/pattern/s/old/new/g' file.txt|Replace only in lines matching pattern|

## **AWK Commands**

|Category|Command|Description|
|---|---|---|
|**Field Processing**|awk '{print $1}' file.txt|Print first field|
|**Field Processing**|awk '{print $1, $3}' file.txt|Print first and third fields|
|**Field Processing**|awk '{print NF}' file.txt|Print number of fields per line|
|**Field Processing**|awk '{print NR, $0}' file.txt|Print line numbers with content|
|**Field Processing**|awk '{print $NF}' file.txt|Print last field|
|**Field Separators**|awk -F: '{print $1}' /etc/passwd|Use colon as field separator|
|**Field Separators**|awk -F',' '{print $2}' file.csv|Process CSV files|
|**Field Separators**|awk 'BEGIN{FS=":"} {print $1}' file.txt|Set field separator in BEGIN block|
|**Formatting**|awk '{printf "%-10s %s\n", $1, $2}' file.txt|Formatted output|
|**Pattern Matching**|awk '/pattern/ {print}' file.txt|Print lines matching pattern|
|**Conditions**|awk '$1 > 100' file.txt|Print lines where first field > 100|
|**Conditions**|awk '$3 == "value"' file.txt|Print lines where third field equals "value"|
|**Conditions**|awk 'NR > 5' file.txt|Print lines after line 5|
|**Conditions**|awk 'NF > 3' file.txt|Print lines with more than 3 fields|
|**Calculations**|awk '{sum += $1} END {print sum}' file.txt|Sum first column|
|**Calculations**|awk '{count++} END {print count}' file.txt|Count lines|
|**Calculations**|awk '{sum += $1; count++} END {print sum/count}' file.txt|Average of first column|
|**Advanced**|awk '{a[$1]++} END {for(i in a) print i, a[i]}' file.txt|Count occurrences|
|**Advanced**|awk '{gsub(/old/, "new"); print}' file.txt|Global substitution|
|**Advanced**|awk 'length($0) > 80' file.txt|Lines longer than 80 characters|

## **Power Combinations**

|Use Case|Command|Description|
|---|---|---|
|**Security Analysis**|grep "Failed password" /var/log/auth.log \| awk '{print $11}' \| sort \| uniq -c \| sort -nr|Analyze failed login attempts|
|**Process Monitor**|ps aux \| awk '$3 > 1.0 {print $2, $11}' \| grep -v PID|Find high CPU processes|
|**Config Processing**|grep -v "^#\|^$" config.file \| sed 's/[[:space:]]_#._//' \| awk -F= '{print $1 "=" $2}'|Clean configuration files|