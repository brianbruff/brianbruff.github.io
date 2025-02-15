---
title: "Silverlight Multithreading and the UI"
date: "2010-02-21"
tags: ["silverlight multithreading"]
---

When you wish to know if you are on the UI thread and you've no access to any UIElement how do you do it?

[code:c#]

static bool IsUiThread()  
{  
return Deployment.Current.Dispatcher.CheckAssess();  
}

[/code]
