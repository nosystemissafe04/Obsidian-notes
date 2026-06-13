after nmap scan there was no anonymous access 
targetted web app , dirbusted - found a route `site` 
vulnerable to rfi executed wwwolf webshell , laudanum and other webshells are not working there 
executed nishang invokepowershelltcp script and executed it to get reverse shell
after some enumeration found a directory which is running a script every 5 min as admin 
replaced the task with my custom binary and got admin 

**but there is another path to it for escalation** 

we found `phpmyadmin` which is being accessed by localhost only 
used chisel to port forward , then 