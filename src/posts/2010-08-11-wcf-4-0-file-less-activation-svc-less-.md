---
title: "WCF 4.0  File-less Activation (.svc less)"
date: "2010-08-11"
tags: ["wcf 4.0"]
---

<http://url/abc.svc> .svc at the end of url makes it user unfriendly. It also makes it Low REST service as it donot follow the REST URI principle.

Till date developers have to overcome this limitation by implementing URLReWrite module in IIS.  
Writing custom code to implement this is error prone and needs maintenance over a period. WCF 4.0 has introduced  
a feature to access WCF services using attribute called as relativeAddress.  
Following .config setting depicts how a Calculat

orService can be accessed using relative URL.

\*\*UPDATE

I've just tried to do this in an application I was working on, don't know where I got my origional information from but this Fileless activation was not what was advertised at the time, it requires a .svc extension on the url without the need for for a .svc physical file.

I've accomplished my restful approach with routing.
