---
title: "MVC Stories"
date: "2010-09-08"
category: "Web & APIs"
tags: ["asp.net mvc", "model binding"]
---

Hi All,

Been a while since I've written some posts, been pretty hectic hours at work and weekends building a house so my chances to blog have been limited.

I intend over the coming few days to give a few tips and tricks on MVC2.

Here's one gotcha...

Be careful how you name your formal arguments in your controller functions.

You can see from the screenshot below that I created two args, "Name" and "name".

By default the first matching case insensitive value will be applied to both variables by MVC...

Usually this will be avoided by good naming conventions but be careful nonetheless :-)

![](/images/blog/2010/9/mvc1.png)
