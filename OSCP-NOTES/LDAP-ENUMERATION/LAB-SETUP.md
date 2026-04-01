**WE HAVE TWO WINDOWS MACHINE AND ONE DOMAIN CONTORLLER AND ONE ATTACKING MACHINE 
THERE ARE THREE ACCOUNT BEING CREATED WITH THE FOLLOWING COMMANDS AND PERMISSIONS WE GAVE THEM**

```POWERSHELL
PS C:\Users\Administrator> NEW-ADUSER -NAME "GUTS" -SamAccountName guts -userprincipalname guts@behelit.local -accountpassword (convertto-securestring "Struggler123!" -asplaintext -force ) -enable $true -PasswordNeverExpires $true 
```

```POWERSHELL
PS C:\Users\Administrator> new-aduser -name "GRIFFITH" -samaccountname griffith -userprincipalname griffith@behelit.local -accountpassword (convertto-securestring "Eclipse123!" -asplaintest -force) -enable $true
```

```POWERSHELL
PS C:\Users\Administrator> setspn -A HTTP/falcon.behelit.local griffith
```

```powershell
PS C:\Users\Administrator> set-ADaccountcontrol griffith -Trustedfordelegation $true
```

```powershell
PS C:\Users\Administrator> set-adaccountcontrol guts -properties *
#all the feilds in the output can be set by set-adaccountcontrol then username then the properties we cant to set just like we did in trustedfordelegation permission on griffith
```

```powershell
PS C:\Users\Administrator> Get-ADUser griffith -Properties userAccountControl
#here we are fetching the information so we need to specify the propertiy with prefix -properties
```

**on both the host we used the following command to add the domain users or login via domain account on the hosts **

```powershell
add-computer -domainName BEHELIT.local -domainCredential BEHELIT.local\griffith -restart
```


