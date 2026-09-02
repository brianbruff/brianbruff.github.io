---
title: "Customization of Web API"
date: "2013-02-05"
category: "Web & APIs"
tags: ["web api", "json"]
---

If you’ve used ASP MVC Web API then you are most likely familiar with the notion of content negotiation, this is the process where the content returned in the response is dictated by the accepts header in the request. In short if you request XML you get XML back, if you request JSON you get JSON back. 

This is done by what we call Formatters. You can of course add your own formatters, e.g. let’s say you have an application that returns human resource details; you may request back a profile picture by hitting the same route with a different request header.

## OOB Formatters

Let’s take a working example, of what we get out of the box (OOB).

Create a new Web API project.

Add the following class.

![](/images/blog/image_thumb_235.png)

Modify the ValuesController as follows:

![](/images/blog/image_thumb_236.png)

We now should be able to run the project and see the following in the browser.

![](/images/blog/image_thumb_237.png)

So by default we get back an XML formatted response, of course we could request JSON, but what if we just don’t want XML?

## Tweaking the config

Add the following line to your Global.asax.cs.

![](/images/blog/image_thumb_238.png)

Now add this new GlobalConfig static class as follows:

![](/images/blog/image_thumb_239.png)

Run your application again.

![](/images/blog/image_thumb_240.png)

Now we get JSON by default, yah! 

But wait a second, what if I know that I have some JavaScript developers that want to use this content, wouldn’t it be nicer to offer camel casing to these guys?

![](/images/blog/image_thumb_241.png)

Run project again.

![](/images/blog/image_thumb_242.png)

e.g. some simple jQuery.

![](/images/blog/image_thumb_243.png)
