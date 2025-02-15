---
title: "Silverlight 4 Databinding and VS2010"
date: "2010-03-03"
tags: ["databinding"]
---

If you've got a data driven application, databinding is the infrastructure of choice that makes the link between data and your UX

Silverlight 4 has a few improvments that brings it closer to WPF

  * TargetNullValue - lets you specify the what to display in the target when the source value is null  
e.g. {Binding Path=Name, TargetNullValue=NoName}
  * StringFormat - specify how a strnig should be formatted  
e.g. {Binding Path=Salary, StringFormat=C}
  * FallbackValue - I love this one, comes in pretty handy when dealing with polymorphic classes where a you know in advance what properties specialized classes have and want to display them... or display a fallback value if they don't exist.  
e.g. {Binding Path=LastLoggedOn, FallbackValue=Never}

