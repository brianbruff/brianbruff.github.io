---
title: "The threee A's of Silverlight Security.. (Part I)"
date: "2010-02-22"
tags: []
---

· Authentication

· Access control

· Auditing

**Authentication.**

One of the critical requirements of any LOB application ia authentication; before the user can use any function he will authenticate by giving a user id and password.

In ASP.NET web application, thi can easily be done by taking advantage of the membership provider and the server-side ASP.NET login controls. In Silverlight, there are two ways to enforce authentication: authentication outside and authentication inside.

Authentication outside is very straightforward and is similar to ASP.NET applications, with this approach, authentication happens in anASP.NET based web page before the Silverlight application is displayed. The authentication context can be transferred into the Silverlight application through the InitParams parameter before a Silverlight application is loaded. The other approach is to use a webservice.
