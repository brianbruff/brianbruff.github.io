---
title: "XAML gotcha"
date: "2010-12-06"
category: "XAML & Desktop"
tags: ["wpf", "data binding"]
---

Here's one I'm ashamed to admit caught me as I was finishing up work this evening, it's been a good few weeks since I've gone near WPF/Silverlight given I was on holidays and spent my time playing with WF4 and MVC2.

Anyway in the screenshot below... VS2010 .NET 3.5 SP1 I was binding some data to a datagrid.

I omitted to remove the offending closing XML comment you can see in the XAML "-->".

And lo and behold the binding breaks down without any prior warning... in fact my object collection is totally ignored and the "-->" is passed to the binding, I know this because I removed the binding paths in the columns and was presented with "-->" in my grid...

Just an interesting one to keep in mind... If you're like me, you couldn't switch off the computer this evening until this peculiar behaviour was explained...

Maybe it will save you some time if you come across it.

![](/images/blog/2010/12/screenie1.jpg)
