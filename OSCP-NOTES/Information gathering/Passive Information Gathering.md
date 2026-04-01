- Passive Information Gathering, also known as [_Open-source Intelligence_](https://osintframework.com/) (OSINT), is the process of collecting openly-available information about a target, generally without any direct interaction with that target, in order to keep our footprint low.

- The ultimate goal of passive information gathering is to obtain information that clarifies or expands an [_attack surface_](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html), through the cyclic process of different tools and methods 

## ## Whois Enumeration

```shell
whois megacorpone.com -h 192.168.50.251
```

- providing the IP address of our custom WHOIS server with (`-h`) 

#### Reverse Whois

```shell
whois 38.100.193.70 -h 192.168.50.251
```

-  give us information about who is hosting the IP address.

## ## Google Hacking
- The _site_ operator limits searches to a single domain.
```
site:domain-name
```
- We can then use further operators to narrow these results. For example, the **filetype** (or **ext**) operator limits search results to the specified file type.
- ![[Pasted image 20250425161804.png]]
- The **ext** operator could also be helpful to discern which programming languages might be used on a web site. Searches like **ext:php**, **ext:xml**, and **ext:py**
- We can also modify an operator using **-** to exclude particular items from a search, narrowing the results.
- For example, to find interesting non-HTML pages, we can use **site:megacorpone.com** to limit the search to **megacorpone.com** and subdomains, followed by **-filetype:html** to exclude HTML pages from the results.
- we can use a search for **intitle:"index of" "parent directory"**
- 