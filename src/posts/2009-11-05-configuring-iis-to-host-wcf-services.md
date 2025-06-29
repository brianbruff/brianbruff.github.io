---
title: "Configuring IIS to host WCF services"
date: "2009-11-05"
tags: ["iis7", "wcf"]
---

It's true what they say, to learn new technologies it's simple a matter of ABC (Always be coding), I've watched many the video, read many the book but it's only when I went to try to do something the it sinks in.   
Like tonight while trying to host a WCF service on my Windows 7 machine I came across a problem that you'd only find by ABC.

**HTTP Error 404.3 - Not Found**

##### **The page you are requesting cannot be served because of the extension configuration. If the page is a script, add a handler. If the file should be downloaded, add a MIME map.**

# The solution.

Control Panel/Programs and Features/Add or Remove components/Microsoft .NET Framework 3.5.1 section. 

I checked the two Windows Communication Foundation checkboxes shown below (the second box enables Windows Activation Service - WAS so that IIS can host WCF services that can be called using non-HTTP bindings such as TCP) (nice!)

![](/blog/image.axd?picture=2009%2f11%2fiisWcf.png)
