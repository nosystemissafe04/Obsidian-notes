- Enumeration is a loop in which we repeatedly gather information based on what data we have or have already discovered.

- Information can be gathered from domains, IP addresses, accessible services, and many other sources.    

- we have to  develop a general understanding of the company's functionality. For example, we need to understand how the company is structured, what services and third-party vendors it uses, what security measures may be in place, and more.

- An example of such a wrong approach could be that after finding authentication services like SSH, RDP, WinRM, and the like, we try to brute-force with common/weak passwords and usernames. Unfortunately, brute-forcing is a noisy method and can easily lead to blacklisting, making further testing impossible. Primarily, this can happen if we do not know about the company's defensive security measures and its infrastructure
****************
**Our goal is not to get at the systems but to find all the ways to get there.**

- understanding a company's internal and external infrastructure, mapping it out, and carefully formulating our plan of attack

The enumeration principles are based on some questions that will facilitate all our investigations in any conceivable situation. In most cases, the main focus of many penetration testers is on what they can see and not on what they cannot see. However, even what we cannot see is relevant to us and may well be of great importance. The difference here is that we start to see the components and aspects that are not visibleat first glance with our experience.

- ==What can we see?==
-  ==What reasons can we have for seeing it?==
-  ==What image does what we see create for us?==
-  ==What do we gain from it?==
-  ==How can we use it?==
-  ==What can we not see?==
-  ==What reasons can there be that we do not see?==
-  ==What image results for us from what we do not see?==

An important aspect that must not be confused here is that there are always exceptions to the rules. The principles, however, do not change. Another advantage of these principles is that we can see from the practical tasks that we do not lack penetration testing abilities but technical understanding when we suddenly do not know how to proceed because our core task is not to exploit the machines but to find how they can be exploited.

#### Enumeration Principles

|**No.** |**Principle** |
|---|---|
|1. |**There is more than the eye meets.** ***Consider all points of view.*** |
|2. |**Distinguish between what we see and what we do not see.** |
|3. |**There are always ways to gain more information. Understand the target.** |

