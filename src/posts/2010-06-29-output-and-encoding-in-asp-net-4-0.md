---
title: "Output and Encoding in ASP.NET 4.0"
date: "2010-06-29"
category: "Web & APIs"
tags: ["asp.net mvc", "security", "iis"]
---

## Pre .NET 4.0

Prior to ASP.NET 4.0 (and especially with MVC) when a user outputted information to a webpage they used <%= Server.HtmlEncode(modelViewStore.Content) %>

The reason for the Encoding is primarily to prevent XSS (cross site script injection) whereby someone may try to inject some client side script or HTML Markup to vandalize a site or to steal valuable information.

This approach has a few shortcomings; like,

* Users may forget the encoding  
* bit verbose

## .NET 4.0

A new nugget has arrived:

<%: modelViewStore.Content %>
