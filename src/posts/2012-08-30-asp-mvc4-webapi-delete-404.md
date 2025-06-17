---
title: "ASP MVC4 WebApi Delete 404"
date: "2012-08-30"
tags: ["ASP WebApi DELETE 404"]
---

### runAllManagedModulesForAllRequests

To support DELETE verbs in MVC4 the webconfig should have runAllManagedModulesForAllRequests defined

![](/images/./image.axd?picture=image_thumb_214.png)

If you have an older project (like my project that I started in VS2012 RC) you may need to add this setting or else you’ll get 404 errors.

Here is where I found this info:  
<http://stackoverflow.com/questions/9692687/webapi-controller-is-not-being-reached-on-delete-command>

Note: Make sure to read:  
[http://www.britishdeveloper.co.uk/2010/06/dont-use-modules-runallmanagedmodulesfo.html](http://www.britishdeveloper.co.uk/2010/06/dont-use-modules-runallmanagedmodulesfo.html)
