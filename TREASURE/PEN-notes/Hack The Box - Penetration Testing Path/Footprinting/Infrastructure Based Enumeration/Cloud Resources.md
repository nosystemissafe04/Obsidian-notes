- The use of cloud, such as [AWS](https://aws.amazon.com/), [GCP](https://cloud.google.com/), [Azure](https://azure.microsoft.com/en-us/), and others, is now one of the essential components for many companies nowadays.
- This often starts with the `S3 buckets` (AWS), `blobs` (Azure), `cloud storage` (GCP), which can be accessed without authentication if configured incorrectly
 ```bash
 0xxNosystemisSafe@htb[/htb]$ for i in $(cat subdomainlist);do host $i | grep "has address" | grep inlanefreight.com | cut -d" " -f1,4;done

blog.inlanefreight.com 10.129.24.93
inlanefreight.com 10.129.27.33
matomo.inlanefreight.com 10.129.127.22
www.inlanefreight.com 10.129.127.33
s3-website-us-west-2.amazonaws.com 10.129.95.250
```
1. Often cloud storage is added to the DNS list when used for administrative purposes by other employees. This step makes it much easier for the employees to reach and manage them.

2. However, there are many different ways to find such cloud storage. One of the easiest and most used is Google search combined with Google Dorks. For example, we can use the Google Dorks `inurl:` and `intext:` to narrow our search to specific terms
```web
inurl:amazonaws.com intext:<company_name>    =>  amazon
inurl:blob.core.windows.net intext:<company_name>   =>  azure
```

sometimes or many times the links presented by Google contain PDFs. When we search for a company that we may already know or want to know, we will also come across other files such as text documents, presentations, codes, and many others.

Such content is also often included in the source code of the web pages, from where the **images, JavaScript codes, or CSS** are loaded. This procedure often relieves the web server and does not store unnecessary content.

3. Third-party providers such as [domain.glass](https://domain.glass/) can also tell us a lot about the company's infrastructure.
4. Another very useful provider is [GrayHatWarfare](https://buckets.grayhatwarfare.com/). We can do many different searches, discover AWS, Azure, and GCP cloud storage, and even sort and filter by file format. Therefore, once we have found them through Google, we can also search for them on GrayHatWarefare and passively discover what files are stored on the given cloud storage.
	
	Many companies also use abbreviations of the company name, which are then used accordingly within the IT infrastructure. Such terms are also part of an excellent approach to discovering new cloud storage from the company. We can also search for files simultaneously to see the files that can be accessed at the same time
### Private and Public SSH Keys Leaked

![](https://academy.hackthebox.com/storage/modules/112/ghw1.png)

Sometimes when employees are overworked or under high pressure, mistakes can be fatal for the entire company. These errors can even lead to SSH private keys being leaked, which anyone can download and log onto one or even more machines in the company without using a password.

#### SSH Private Key

![](https://academy.hackthebox.com/storage/modules/112/ghw2.png)
