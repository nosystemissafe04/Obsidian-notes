The entire pre-engagement process consists of three essential components:

1. Scoping questionnaire
    
2. Pre-engagement meeting
    
3. Kick-off meeting
    

Before any of these can be discussed in detail, a `Non-Disclosure Agreement` (`NDA`) must be signed by all parties. There are several types of NDAs:

|**Type**|**Description**|
|---|---|
|`Unilateral NDA`|This type of NDA obligates only one party to maintain confidentiality and allows the other party to share the information received with third parties.|
|`Bilateral NDA`|In this type, both parties are obligated to keep the resulting and acquired information confidential. This is the most common type of NDA that protects the work of penetration testers.|
|`Multilateral NDA`|Multilateral NDA is a commitment to confidentiality by more than two parties. If we conduct a penetration test for a cooperative network, all parties responsible and involved must sign this document.|

Exceptions can also be made in urgent cases, where we jump into the kick-off meeting, which can also occur via an online conference. It is essential to know `who in the company is permitted` to contract us for a penetration test. Because we cannot accept such an order from everyone. Imagine, for example, that a company employee hires us with the pretext of checking the corporate network's security. However, after we finished the assessment, it turned out that this employee wanted to harm their own company and had no authorization to have the company tested. This would put us in a critical situation from a legal point of view.

Below is a sample (not exhaustive) list of company members who may be authorized to hire us for penetration testing. This can vary from company to company, with larger organizations not involving the C-level staff directly and the responsibility falling on IT, Audit, or IT Security senior management or the like.

||||
|---|---|---|
|Chief Executive Officer (CEO)|Chief Technical Officer (CTO)|Chief Information Security Officer (CISO)|
|Chief Security Officer (CSO)|Chief Risk Officer (CRO)|Chief Information Officer (CIO)|
|VP of Internal Audit|Audit Manager|VP or Director of IT/Information Security|

It is vital to determine early on in the process who has signatory authority for the contract, Rules of Engagement documents, and who will be the primary and secondary points of contact, technical support, and contact for escalating any issues.

This stage also requires the preparation of several documents before a penetration test can be conducted that must be signed by our client and us so that the declaration of consent can also be presented in written form if required. Otherwise the penetration test could breach the [Computer Misuse Act](https://www.legislation.gov.uk/ukpga/1990/18/contents). These documents include, but are not limited to:

|**Document**|**Timing for Creation**|
|---|---|
|`1. Non-Disclosure Agreement` (`NDA`)|`After` Initial Contact|
|`2. Scoping Questionnaire`|`Before` the Pre-Engagement Meeting|
|`3. Scoping Document`|`During` the Pre-Engagement Meeting|
|`4. Penetration Testing Proposal` (`Contract/Scope of Work` (`SoW`))|`During` the Pre-engagement Meeting|
|`5. Rules of Engagement` (`RoE`)|`Before` the Kick-Off Meeting|
|`6. Contractors Agreement` (Physical Assessments)|`Before` the Kick-Off Meeting|
|`7. Reports`|`During` and `after` the conducted Penetration Test|

Note: Our client may provide a separate scoping document listing in-scope IP addresses/ranges/URLs and any necessary credentials but this information should also be documented as an appendix in the RoE document.

**Important Note:**

These documents should be reviewed and adapted by a lawyer after they have been prepared.

## Scoping Questionnaire

After initial contact is made with the client, we typically send them a `Scoping Questionnaire` to better understand the services they are seeking. This scoping questionnaire should clearly explain our services and may typically ask them to choose one or more from the following list:

|||
|---|---|
|☐ Internal Vulnerability Assessment|☐ External Vulnerability Assessment|
|☐ Internal Penetration Test|☐ External Penetration Test|
|☐ Wireless Security Assessment|☐ Application Security Assessment|
|☐ Physical Security Assessment|☐ Social Engineering Assessment|
|☐ Red Team Assessment|☐ Web Application Security Assessment|

Under each of these, the questionnaire should allow the client to be more specific about the required assessment. Do they need a web application or mobile application assessment? Secure code review? Should the Internal Penetration Test be black box and semi-evasive? Do they want just a phishing assessment as part of the Social Engineering Assessment or also vishing calls? This is our chance to explain the depth and breadth of our services, ensure that we understand our client's needs and expectations, and ensure that we can adequately deliver the assessment they require.

Aside from the assessment type, client name, address, and key personnel contact information, some other critical pieces of information include:

|||
|---|---|
|How many expected live hosts?||
|How many IPs/CIDR ranges in scope?||
|How many Domains/Subdomains are in scope?||
|How many wireless SSIDs in scope?||
|How many web/mobile applications? If testing is authenticated, how many roles (standard user, admin, etc.)?||
|For a phishing assessment, how many users will be targeted? Will the client provide a list, or we will be required to gather this list via OSINT?||
|If the client is requesting a Physical Assessment, how many locations? If multiple sites are in-scope, are they geographically dispersed?||
|What is the objective of the Red Team Assessment? Are any activities (such as phishing or physical security attacks) out of scope?||
|Is a separate Active Directory Security Assessment desired?||
|Will network testing be conducted from an anonymous user on the network or a standard domain user?||
|Do we need to bypass Network Access Control (NAC)?||