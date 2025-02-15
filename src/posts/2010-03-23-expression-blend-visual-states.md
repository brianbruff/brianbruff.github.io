---
title: "Expression blend visual states"
date: "2010-03-23"
tags: []
---

A few people have asked me what's the easiest way of doing transitions on Silverlight.

One of the easiest ways has to be to use the VisualStateManager with Expression Blend, see screen show for sample logged in state.  
If you don't know how to use this tool then start watching a few vids!

To change between states you can use this code..

[code:c#]

if (WebContext.Current.User.IsAuthenticated)  
{  
VisualStateManager.GoToState(this, (WebContext.Current.Authentication is WindowsAuthentication) ? "windowsAuth" : "LoggedIn", true);  
}  
else  
{  
VisualStateManager.GoToState(this, "LoggedOut", true);  
}

[/code]

![](/blog/image.axd?picture=2010%2f3%2fsitedocs.jpg)
