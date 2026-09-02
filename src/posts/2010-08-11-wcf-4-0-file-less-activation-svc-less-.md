---
title: "WCF 4.0 File-less Activation (.svc less)"
date: "2010-08-11"
category: "Web & APIs"
tags: ["wcf", "iis", "web api"]
---

<http://url/abc.svc> The .svc at the end of the url makes it user unfriendly. It also makes it a Low REST service as it does not follow the REST URI principle.

Till date developers have to overcome this limitation by implementing the URLReWrite module in IIS.   
Writing custom code to implement this is error prone and needs maintenance over a period. WCF 4.0 has introduced   
a feature to access WCF services using an attribute called relativeAddress.  
Following .config setting depicts how a CalculatorService can be accessed using relative URL.

**UPDATE**

I've just tried to do this in an application I was working on, don't know where I got my original information from but this Fileless activation was not what was advertised at the time, it requires a .svc extension on the url without the need for a .svc physical file.

I've accomplished my restful approach with routing.
