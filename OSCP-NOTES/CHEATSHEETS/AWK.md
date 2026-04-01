Core patterns

|Task|Command|Notes|
|---|---|---|
|Match regex|awk '/error/' file|Prints lines containing “error”.|
|Exclude regex|awk '!/DEBUG/' file|Negated pattern excludes matches.|
|Field equals string|awk '$2=="FAILED"' file|Exact string match on column.|
|Field matches regex|awk '$2 ~ /^us-/' file|Regex on a specific field.|
|Negated field regex|awk '$2 !~ /(tmp|cache)/' file|
|Numeric compare|awk '$3>100' file|Numeric filter on a column.|
|Multiple conditions|awk '$2=="FAILED" && $5>=10' file|Combine logical tests.|

Fields and separators

|Task|Command|Notes|
|---|---|---|
|Set input FS (CSV)|awk -F',' '$3>100' file.csv|-F sets input delimiter.|
|Set FS in program|awk 'BEGIN{FS=","} $3>100' file.csv|BEGIN runs before reading.|
|Set output OFS|awk 'BEGIN{OFS="\t"} {print $1,$3}' file|Tab-separated output.|
|Collapse spaces|awk -F'[[:space:]]+' '$3>0' file|Robust split on any spaces.|
|Print fields|awk '{print $1,$3}' file|Select and order columns.|

Headers and line control

|Task|Command|Notes|
|---|---|---|
|Keep header then filter|awk 'NR==1||
|Skip first N lines|awk 'NR>2 && $3>100' file|NR is global line number.|
|Range of lines|awk 'NR>=10 && NR<=20' file|Line number window.|
|Between markers|awk '/^START/,/^END/' file|Pattern range selection.|

Counting and existence

|Task|Command|Notes|
|---|---|---|
|Count matches|awk '/ERROR/{c++} END{print c+0}' file|Tally matching lines.|
|Count all lines|awk 'END{print NR}' file|Total records processed.|
|Non-empty lines|awk 'NF' file|NF>0 implies non-blank.|
|Only blanks|awk '!NF' file|True for empty lines.|

Case-insensitive matching

|Task|Command|Notes|
|---|---|---|
|Case-insensitive search|awk 'BEGIN{IGNORECASE=1} /error/' file|Global flag for regex.|
|Case-insensitive field|awk 'BEGIN{IGNORECASE=1} $2~/warn/' file|Applies to ~ tests.|

Numeric parsing helpers

|Task|Command|Notes|
|---|---|---|
|Coerce numeric|awk '$3+0>100' file|Safe numeric comparison.|
|Strip unit suffix|awk '{n=$3; sub(/[A-Za-z]+$/,"",n); if(n+0>=100) print}' file|Remove trailing units.|
|Convert h/m/d example|awk 'function mins(x){if(x~/m$/)return x+0; if(x~/h$/)return(x+0)*60; if(x~/d$/)return(x+0)*1440} mins($3)>=60' file|Compare mixed units.|

Uniqueness and duplicates

|Task|Command|Notes|
|---|---|---|
|Unique lines (first)|awk '!seen[$0]++' file|Keep first occurrence.|
|Unique by column|awk '!seen[$1]++' file|Keyed by field 1.|
|Only duplicates by key|awk 'seen[$1]++==1' file|Prints second and later.|

Practical one-liners

|Task|Command|Notes|
|---|---|---|
|Contains error but not debug|awk '/error/ && !/debug/' file|Combine include/exclude.|
|HTTP 5xx and slow (>2s)|awk '$9 ~ /^5/ && $10+0>2000 {print $1,$4,$7,$9,$10}' access.log|Status + time filter.|
|CSV: col2 in A or B, col5 not empty|awk -F',' '$2~/^(A|B)$/ && $5!=""' file.csv|
|Drop header, filter, select cols|awk 'NR>1 && $3>=100 {print $1,$3}' data.txt|Typical analytics pass.|
|Grep+awk in one|awk '/nginx/ && $3>10 {print $0}' ps.txt|Avoid pipe to grep.|

Dates and times

|Task|Command|Notes|
|---|---|---|
|Epoch filter|awk '($1+0)>=1725000000' file|Numeric timestamp.|
|ISO date filter|awk '$1>="2025-09-01"' file|Safe YYYY-MM-DD compare.|

Integrity checks

| Task                | Command          | Notes                  |
| ------------------- | ---------------- | ---------------------- |
| Exactly N fields    | awk 'NF==5' file | Validate schema width. |
| At least N fields   | awk 'NF>=7' file | Ensure completeness.   |
| Missing/empty field | awk '$3==""      |                        |