---
title: ".NET DateTime Webservices UTC"
date: "2009-12-02"
tags: ["wcf", ".net 1.1", ".net 2.0"]
---

With .NET 1.1 when we receive a UTC DateTime in a SOAP response from a Webservice it used to get converted to Local time.

With .NET 2.0 when we receive a UTC DateTime in a SOAP response it stays in UTC.

If you need it in local time make sure to call .ToLocalTime()

** Edit: P.s. Have a look at this neat class in the framework [XmlConvert](http://msdn.microsoft.com/en-us/library/system.xml.xmlconvert.aspx)
