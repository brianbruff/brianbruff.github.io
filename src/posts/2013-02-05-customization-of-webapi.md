---
title: "Customization of WebApi"
date: "2013-02-05"
tags: ["webapi customization"]
---

If you’ve used Asp MVC Web Api then you are most likely familiar with the notion of content negotiation, this is the process where the content returned in the response is dictated by the accepts header in the request. In sort if you request xml you get xml back, if you request json you get json back. 

This is done by what we call Formatters. You can of course add your own formatters, e.g. let’s say you have an application that returns human resource details; you may request back a profile picture by hitting the same route with a different request header.

## OOB Formatters

Lets take a working example, of what we get out of the box (OOB).

Create a new Web Api project

Add the following class

![](/images/./image.axd?picture=image_thumb_235.png)

Modify the ValuesController as follows

![](/images/./image.axd?picture=image_thumb_236.png)

We now should be able to run the project and see the following in the browser

![](/images/./image.axd?picture=image_thumb_237.png)

So by default we get back an xml formatted response, of course we could request json, but what if we just don’t want xml?

## Tweaking the config

Add the following line to your Global.asax.cs

![](/images/./image.axd?picture=image_thumb_238.png)

Now add this new GlobalConfig static class as follows

![](/images/./image.axd?picture=image_thumb_239.png)

Run your application again

![](/images/./image.axd?picture=image_thumb_240.png)

Now we get json by default, yah! 

But wait a second, what if I know that I have some javascript developers that want to use this content, wouldn’t be nicer to offer camel casing to these guys?

![](/images/./image.axd?picture=image_thumb_241.png)

Run project again

![](/images/./image.axd?picture=image_thumb_242.png)

e.g some simple jQuery 

![](/images/./image.axd?picture=image_thumb_243.png)
