![[nosql-injection-graphic.svg|855]]

#### TYPES OF NOSQL INJECTION
- syntax injection - similar to sql injection where we break the syntax of query and inject our own payload *the difference is in NOSQL databases use a range of query languages different types of query types and different data structures*
- operator injection - when we use nosql query operator to manipulate queries 

#### SYNCTAX INJECTION 
- test each input and try to break the syntax of the query by *fuzz strings and special characters* that trigger a database error 
- what our goal is to find out detection and prevention system in place like sanitization and filteration of input which goes into database 
- use a variety of fuzz strings to target multiple API languages 

###### DETECTING SYTAX INJECTION IN MONGO
```URL
https://insecure-website.com/product/lookup?category=fizzy
```
user selected fizzy drinks category 

this causes the application to send JSON query to get relevant product 