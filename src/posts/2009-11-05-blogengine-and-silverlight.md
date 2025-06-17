---
title: "BlogEngine and Silverlight"
date: "2009-11-05"
tags: ["blogengine", "silverlight", "c#"]
---

I've had a few people asking me how did I host Silverlight 3 in blog engine.

# Silverlight Usercontrol

It was pretty simple really (when you know how)

Basically Silverlight3 needs an tag.

So I created a user control with the object tag and some script handling for client side errors (actually VS2010 did all the hard lifting).

[code:c#]

<%@ Control Language="C#" ClassName="SilverlightControl" %>

<%Silverlight.xbap%>"/> // where <%Silverlight.xbap%> is location of silverlight xbap

[http://go.microsoft.com/fwlink/?LinkID=149156&v;=3.0.40818.0](<a href=)" style="text-decoration:none">  
![](<a href=)http://go.microsoft.com/fwlink/?LinkId=161376" alt="Get Microsoft Silverlight" style="border-style:none"/>

[/code]
