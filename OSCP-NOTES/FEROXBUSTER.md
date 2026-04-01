### default mode 

```
feroxbuster -u URL
```

```
feroxbuster -u URL -w <wordlist>
```

### redirect
- follow the chain of redirects to 3 depth means if we get 302 redirect it will follow the url and if we get another 302 it will again follow so the limit is 3 , hence this is done bcz if we are filtering on words length or regular expression we need to visit the route 
- recursion is different it will start again on that route found from index of wordlist 0
```
feroxbuster -u URL -r
```
### recursion
-  use all the words in the word-list against this new route found , this is different then redirect which only visit the route and does not start scanning it 
- by default it is enable in feroxbuster and can be disabled with `--no-recursion` OR `-n`
```
feroxbuster -u URL 
```
### recursion depth
- it can take up time and we can delve more and more deeper so there is recursion depth which specify how much deeper it have to go
- default is 4 we can increase and decrease from 4
```
feroxbuster -u URL -d
```
### extension
```
feroxbuster -u URL -x php,txt
```

### output
- logging the output 
```
  feroxbuster -u URL --output filename
```

### user agent
- sometimes the filtering is also being done with user agent so changing it can be usefull to bypass the filteration in place 
- bydefault feroxbuster/\<version> is the user agent
```
feroxbuster -u URL --user-agent "mozilla......."
```

### filter status code
- a lot of times where we need to skip or ignore certain http status codes we can filter it with this options 
```
feroxbuster -u URL -C 403,403
```

- if we want to include particular status codes like 404 is by default which is ignored 
```
feroxbuster -u URL --status-codes 404
```

### threads 
- controlling the number of threads which is required for not overwhelming the target somethings which is dossed if the certian number of request being sent to the server at a time so to control that we need sometimes lower the thread count 
```
feroxbuster -u URL -t 20
```
- 50 by default

### rate limits
  -L, --scan-limit <SCAN_LIMIT>      Limit total number of concurrent scans (default: 0, i.e. no limit)
      --parallel <PARALLEL_SCANS>    Run parallel feroxbuster instances (one child process per url passed via stdin)
      --rate-limit <RATE_LIMIT>      Limit number of requests per second (per directory) (default: 0, i.e. no limit)
      --response-size-limit <BYTES>  Limit size of response body to read in bytes (default: 4MB)
      --time-limit <TIME_SPEC>       Limit total run time of all scans (ex: --time-limit 10m)


