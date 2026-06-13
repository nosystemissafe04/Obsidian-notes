after nmap scan there was no anonymous access 
targetted web app , dirbusted - found a route `site` 
vulnerable to rfi executed wwwolf webshell , laudanum and other webshells are not working there 
executed nishang invokepowershelltcp script and executed it to get reverse shell
after some enumeration found a directory which is running a script every 5 min as admin 
replaced the task with my custom binary and got admin 

**but there is another path to it for escalation** 

we found `phpmyadmin` which is being accessed by localhost only 
used chisel to port forward , then accessed it on browser now i have the mysql access 

*we could also port forward to mysql directly , and then access it but phpmyadmin have graphical interface which makes it easy to navigate*

### 1.1 Check FILE Privilege

sql

```sql
-- Check if current MySQL user has FILE privilege
SELECT * FROM information_schema.USER_PRIVILEGES 
WHERE PRIVILEGE_TYPE = 'FILE';

-- Check current user
SELECT user();
SELECT current_user();
```