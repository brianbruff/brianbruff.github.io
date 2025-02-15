---
title: "WebAPI OWIN and HppClient Authorize"
date: "2014-10-07"
tags: ["Owin", "MVC5", "HttpClient", "Autorize", "Token", "Username", "Password"]
---

Hi all, I know I promised my next post was going to be more Azure but I encountered a little task that took me a while to get working, the scenario was that I wanted to make a call to my WebAPI (MVC5) service using a C# HttpClient, the problem was that the resource I wished to access had the AuthorizeAttribute set

![](/images//images/image_thumb_349.png)  

Now there’s a few ways to skin a cat but in the presence of the default Token Authorization one needs to first get a token and then use this token in subsequent requests. There is some good documentation using fiddler here: <http://www.asp.net/web-api/overview/security/individual-accounts-in-web-api>, however, there was not a lot of information on how to do this with HttpClient against Katana/Owin/MVC5, rather this information was not available in one specific place.

## How

![](/images//images/image_thumb_351.png)  

The first request gets the token and then this token is used as the Bearer for further requests.
