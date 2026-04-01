WHEN USING KERBEROS AUTHENTICATION WE WILL USE NETEXEC FOR ENUMERATION , BUT IT MAY NOT WORK SOME COMMANDS LIKE --SHARES IN MY CASE OF SOLVING SCRAMMBLED 

- --SHARES FLAG NEEDS KERBEROS TICKET , WHICH WE HAVE TO CREATE VIA impacket gettgt and then export this ccache file on KRB5CCNAME ENVIRONMENT VARIABLE 
- ![[Pasted image 20260306081747.png]]
- here i am using kerberos auth but still there is error of netbios timeout , it is due to tickets not being used even though we are using kerberos auth , so keep in mind that while dealing with kerberos always use tickets to enumerate through netexec 