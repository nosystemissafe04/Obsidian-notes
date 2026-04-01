All the steps we take to exploit the vulnerabilities are based on the information we enumerate about our targets. This phase can be considered the cornerstone of any penetration test. We can obtain the necessary information relevant to us in many different ways. However, we can divide them into the following categories:

- Open-Source Intelligence
- Infrastructure Enumeration
- Service Enumeration
- Host Enumeration

All four categories should and must be performed by us for each penetration test. This is because the `information` is the main component that leads us to successful penetration testing and identifying security vulnerabilities. We can get this information anywhere, whether on social media, job postings, individual hosts and servers, or even the employees. Information is continually being spread and shared everywhere.

After all, we humans communicate by exchanging information, but network components and services communicate similarly. Any exchange of information always has a specific purpose. For computer networks, the aim is always to trigger a particular process. Be it storing data in a database, registering, generating specific values, or forwarding the information.

## OSINT
-  Repositories on sites like [Github](https://github.com/) or other development platforms are often not set up correctly, and external viewers can see this information. If this type of sensitive information is found at the onset of testing, the Incident Handling and Report section of the RoE should describe the procedure for reporting these types of critical security vulnerabilities. Publicly published passwords or SSH keys represent a critical security gap if they have not already been removed or changed. Therefore, our client's administrator must review this information before we proceed.
- Developers often share whole sections of code on [StackOverflow](https://stackoverflow.com/) to show other developers a better overview of how their code works to help them solve their problems.

## Infrastructure Enumeration
- For this, we use OSINT and the first active scans
- This includes name servers, mail servers, web servers, cloud instances, and more.
-  We make an accurate list of hosts and their IP addresses and compare them to our scope to see if they are included and listed.
- identifying security measures of a company will help our attacks to be evasive. But identifying firewalls, such as web application firewalls, also gives us an excellent understanding of what techniques could trigger an alarm for our customer and what methods can be used to avoid that alarm.
- Enumeration from inside the network gives us a good overview of the hosts and servers that we can use as targets for a `Password Spraying` attack, to grant us a foothold in the network

## Service Enumeration
-  we identify services that allow us to interact with the host or server over the network (or locally, from an internal perspective).
- Many services have a version history that allows us to identify whether the installed version on the host or server is actually up to date or not
- Many administrators are afraid to change applications that work, as it could harm the entire infrastructure. Therefore, administrators often prefer to accept the risk of leaving one or more vulnerabilities open and maintaining the functionality instead of closing the security gaps.

## Host Enumeration
- identifying -operating system , services usage , version of services 
- like ftp - anonymous login allowed or not 
- finding end of life devices or software that have high possibility of a vuln 
- many administrators become careless and often consider these services "secure" because they are not directly accessible from the internet. Thus, many misconfigurations are often discovered here due to these assumptions or lax practices
- determining the role of end of life hosts or server and network component it communicates with , which `services` it uses for this purpose and on which `ports` they are located.
- During internal host enumeration, which in most cases comes after the successful `Exploitation` of one or more vulnerabilities, we also examine the host or server from the inside. This means we look for sensitive `files`, local `services`, `scripts`, `applications`, `information`, and other things that could be stored on the host. This is also an essential part of the `Post-Exploitation` phase, where we try to exploit and elevate privileges.

## Pillaging (juice of hacking )
- After hitting the `Post-Exploitation` stage, pillaging is performed to collect sensitive information locally on the already exploited host, such as employee names, customer data, and much more
- The information we can obtain on the exploited hosts can be divided into many different categories and varies greatly. This depends on the purpose of the host and its positioning in the corporate network. The administrators taking the security measures for these hosts also play a significant role. Nevertheless, such information can show the `impact` of a potential attack on our client and be used for further steps to `escalate our privileges` or `move laterally` further in the network.
- This is intentional for reasons we will clarify here. Pillaging alone is not a stage or a subcategory as many often describe but an integral part of the information gathering and privilege escalation stages that is inevitably performed locally on target systems.
- 