---
title: "ASP MVC Display Templates"
date: "2011-11-07"
tags: ["MVC3 DataTemplates"]
---

So I’m still working on the Live CV website I’m creating in my spare time. The idea is pretty simple the web application will let users create an online CV, I’ll not get into the details of it until I’ve something more interesting to show.

Of course every resume needs a section on work experience and associated start and end dates. Now as a first step I’m just serving up my own CV before I get into all the exciting jQuery plugins etc. that' I’ve in mind.

Here’s how to format a date using a data template.

![](/images/./image.axd?picture=image_thumb_112.png)

Here we see that I’m passing a template to the Html.DisplayFor<> extension.

Now I added a DisplayTemplates folder to my shared views (you could keep this folder local to your current view if you wish, but I wish to have it used throughout the project. Add a Partial view.

![](/images/./image.axd?picture=image_thumb_113.png)

Here’s the content of my Partial view

![](/images/./image.axd?picture=image_thumb_114.png)

Here’s the result.

![](/images/./image.axd?picture=image_thumb_115.png)
