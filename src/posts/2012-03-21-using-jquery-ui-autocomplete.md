---
title: "Using jQuery UI Autocomplete"
date: "2012-03-21"
tags: ["jquery autocomplete asp mvc3"]
---

Hi all, here’s an example of how to use jQuery UI Autocomplete in ASP MVC3.

The sample app I will show actually connects to a work related webservice, but you could use any repository you so wish.

# Steps

### Create a MVC3 application

### Add jQuery UI (use nuget) 

![](/images/./image.axd?picture=image_thumb_166.png)

![](/images/./image.axd?picture=image_thumb_167.png)

### Create your UX

I just added the following to my Home/Index.cshtml view

![](/images/./image.axd?picture=image_thumb_168.png)

### Add a new script to your scripts folder

![](/images/./image.axd?picture=image_thumb_169.png)

here you can see that on the page load, I wrap my input “#uris” and call the jQuery UI auto complete on it.

I set the source to /Home/GetModels i.e. the GetModels function on the HomeController.cs

### Add the GetModels function (click to enlarge)

![](/images/./image.axd?picture=image_thumb_172.png)

Here you can see that I’m just using a webservice to search for entities called modelUris (just strings) and I return the first 10 matches.

For testing you could just use.

return Json(new string[] {“one”, “two”}, JsonRequestBehavior.AllowGet);

### Here’s what it looks like

![](/images/./image.axd?picture=image_thumb_171.png)
