---
title: "HowTo: Consume WCF From WF4"
date: "2010-12-15"
tags: ["windows workflow", "wcf 4.0", "wcf"]
---

Hi all.

I've discovered this is not as simple as it would appear to be.  
Infact it's worse; in "order" to do this you will need to jump through a few hoops...; in a particular order!

1\. Add an activity library project  
2\. Add a reference to this new project from your WF4 app (any app with workflows.. silverlight/mvc etc)  
ENSURE: this is done before step 3 or visual studio 2010 will give you a circular reference error!  
3\. In the activity library add the service reference to your webservice  
4\. Modify your webconfig file to contain the abc information for the connection (servicemodel stuff)  
5\. Now use the activities (from the toolbox)

I gather from crawling through google that the above sequence is already well defined as a workaround for the vs2010 bug.
