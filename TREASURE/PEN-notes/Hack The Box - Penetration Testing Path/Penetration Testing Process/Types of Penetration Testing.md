No matter how we begin the pentest, the type of pentest plays an important role. This type determines how much information is made available to us. We can narrow down these types to the following:

|**Type**|**Information Provided**|
|---|---|
|`Blackbox`|`Minimal`. Only the essential information, such as IP addresses and domains, is provided.|
|`Greybox`|`Extended`. In this case, we are provided with additional information, such as specific URLs, hostnames, subnets, and similar.|
|`Whitebox`|`Maximum`. Here everything is disclosed to us. This gives us an internal view of the entire structure, which allows us to prepare an attack using internal information. We may be given detailed configurations, admin credentials, web application source code, etc.|
|`Red-Teaming`|May include physical testing and social engineering, among other things. Can be combined with any of the above types.|
|`Purple-Teaming`|It can be combined with any of the above types. However, it focuses on working closely with the defenders.|
## Testing Methods

An essential part of the process is the starting point from which we should perform our pentest. Each pentest can be performed from two different perspectives:

- `External` or `Internal`

#### External Penetration Test

Many pentests are performed from an external perspective or as an anonymous user on the Internet. Most customers want to ensure that they are as protected as possible against attacks on their external network perimeter. We can perform testing from our own host (hopefully using a VPN connection to avoid our ISP blocking us) or from a VPS. Some clients will not care about stealth, while others will request that we proceed as quietly as possible and approach the target systems to avoid being banned by the firewalls and IDS/IPS systems and avoid triggering an alarm. They may ask for a stealthy or "hybrid" approach where we gradually become "noisier" to test their detection capabilities. Ultimately our goal here is to access external-facing hosts, obtain sensitive data, or gain access to the internal network.

#### Internal Penetration Test

In contrast to an external pentest, an internal pentest is when we perform testing from within the corporate network. This stage may be executed after successfully penetrating the corporate network via the external pentest or starting from an assumed breach scenario. Internal pentests may also access isolated systems with no internet access whatsoever, which usually requires our physical presence at the client's facility.
## Types of Testing Environments

Apart from the test method and the type of test, another consideration is what is to be tested, which can be summarized in the following categories:

||||||
|---|---|---|---|---|
|Network|Web App|Mobile|API|Thick Clients|
|IoT|Cloud|Source Code|Physical Security|Employees|
|Hosts|Server|Security Policies|Firewalls|IDS/IPS|

It is important to note that these categories can often be mixed. All listed test components may be included depending on the type of test to be performed. Now we'll shift gears and cover the Penetration Process in-depth to see how each phase is broken down and depends on the previous one.

## Precautionary Measures during Penetration Tests

We have prepared a list of precautions we highly recommend following during each penetration test to avoid violating most laws. In addition, we should also be aware that some countries have additional regulations that apply to specific cases, and we should either inform ourselves or ask our lawyer.

||**Precautionary Measure**|
|---|---|
|`☐`|Obtain written consent from the owner or authorized representative of the computer or network being tested|
|`☐`|Conduct the testing within the scope of the consent obtained only and respect any limitations specified|
|`☐`|Take measures to prevent causing damage to the systems or networks being tested|
|`☐`|Do not access, use or disclose personal data or any other information obtained during the testing without permission|
|`☐`|Do not intercept electronic communications without the consent of one of the parties to the communication|
|`☐`|Do not conduct testing on systems or networks that are covered by the Health Insurance Portability and Accountability Act (HIPAA) without proper authorization|