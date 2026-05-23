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

this causes the application to send JSON query to get relevant product from product route in api and product collection in mongodb database 
```js
this.category == 'fizzy'
```

To test whether the input may be vulnerable, submit a fuzz string in the value of the `category` parameter. An example string for MongoDB is:

```
'"`{
;$Foo} 
$Foo \xYZ
```

**herer we are checking for special character sanitization**

```url-incoded-url
https://insecure-website.com/product/lookup?category='%22%60%7b%0d%0a%3b%24Foo%7d%0d%0a%24Foo%20%5cxYZ%00
```

If this causes a change from the original response, this may indicate that user input isn't filtered or sanitized correctly.

