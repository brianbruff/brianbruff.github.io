---
title: "Silverlight Multithreading and the UI"
date: "2010-02-21"
category: "XAML & Desktop"
tags: ["silverlight", "concurrency"]
---

When you wish to know if you are on the UI thread and you've no access to any UIElement how do you do it?

```csharp
static bool IsUiThread()
{
    return Deployment.Current.Dispatcher.CheckAssess();
}
```