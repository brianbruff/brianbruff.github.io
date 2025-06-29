---
title: "SignalR chat on Azure"
date: "2012-09-13"
tags: ["SignalR on Azure"]
---

At lunch today I created a little fun website and it only took about 15 minutes (as you can plainly see from the styling).

# Technologies

## The technologies involved were

  * ### Azure (website)

  * ### SignalR

  * ### Asp MVC 4

  * ### .NET 4 (because at the time of writing Azure doesn’t support .net 4.5 not that I need it).

Let me explain how I did it, the reason I did it was simple, I was sick to death of seeing all these posts on **SignalR** without actually having used it. **Asp MVC** is my choice of web tech these days so that was a foregone conclusion, and **Azure** has provided 10 free **Azure websites** for these sort of sites.Here we see the main page with an eductational video   
![](/images/./image.axd?picture=image_thumb_219.png)   
  
Here we see a test with two local browsers
![](/images/./image.axd?picture=image_thumb_220.png)Step 1.Create a ASP MVC4 Web internet web application, add a Chat controller. Add a view for the Index method.
![](/images/./image.axd?picture=image_thumb_221.png)

Step 2. Import the SignalR package
![](/images/./image.axd?picture=image_thumb_222.png)

Step 3. Add the following class to your project.
![](/images/./image.axd?picture=image_thumb_223.png)

Step 4. Add the following javascript to your project

![](/images/./image.axd?picture=image_thumb_224.png)

Step 5. Check it out for yourself, [www.manfluanonymous.com](http://www.manfluanonymous.com)

I left it running earlier and these are the messages that people entered over the last few hours.

![](/images/./image.axd?picture=image_thumb_225.png)

Disclaimer: I copied the SignalR code from someone on the net, if i could remember who I’d give credit.
