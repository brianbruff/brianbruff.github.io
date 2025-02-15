---
title: "Xaml gotya"
date: "2010-12-06"
tags: []
---

Here's one I'm ashamed to admit caught me as I was finishing up work this evening, it's been a good few weeks since I've gone near wpf/silverlight given I was on holidays and spend my time playing with WF4 and MVC2.

Anyway in screenshot below.. vs2010 .net 3.5 sp1 I was binding some data to a datagrid.

I omitted to remove the offending closing xml comment you can see in the xaml "-->"

And low and behold the binding breaks down without any prior warning,,,, infact my object collection is totally ignored and the "-->" is passed to the binding, I know this because I removed the binding paths in the columns and was presented with "-->" in my grid...

Just an interesting one to keep in mind.. If you're like me, u couldn't switch off the computer this evening until this peculiar behaviour was explained..

Maybe it will save you some time if you come accross it.

![](/blog/image.axd?picture=2010%2f12%2fscreenie1.jpg)
