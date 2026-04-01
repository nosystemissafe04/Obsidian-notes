we can save nmap results in 
- normal nmap output
- greppeble output
- xml

## Style sheets

With the XML output, we can easily create HTML reports that are easy to read, even for non-technical people. This is later very useful for documentation, as it presents our results in a detailed and clear way. To convert the stored results from XML format to HTML, we can use the tool `xsltproc`.

  Saving the Results

```bash
0xxNosystemisSafe@htb[/htb]$ xsltproc target.xml -o target.html
```

If we now open the HTML file in our browser, we see a clear and structured presentation of our results.

