---
title: "Expression Blend visual states"
date: "2010-03-23"
category: "XAML & Desktop"
tags: ["expression blend", "silverlight"]
---

A few people have asked me what's the easiest way of doing transitions on Silverlight.

One of the easiest ways has to be to use the VisualStateManager with Expression Blend, see screenshot for sample logged in state.  
If you don't know how to use this tool then start watching a few vids!

To change between states you can use this code...

```csharp
if (WebContext.Current.User.IsAuthenticated)
{
    VisualStateManager.GoToState(this, (WebContext.Current.Authentication is WindowsAuthentication) ? "windowsAuth" : "LoggedIn", true);
}
else
{
    VisualStateManager.GoToState(this, "LoggedOut", true);
}
```
![](/images/blog/2010/3/sitedocs.jpg)
