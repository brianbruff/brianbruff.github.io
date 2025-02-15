---
title: "IPhone: remove the IOS Keyboard on Return"
date: "2012-09-18"
tags: ["Remove keyboard on IOS"]
---

Ok this is another XCode/ Objective-c/ IOS post. Stop reading now if you feel sick MSFT fans ![Winking smile](./image.axd?picture=wlEmoticon-winkingsmile_3.png)

So you’ve written an app and you test out that new data entry field only to find out that the keyboard covers you action buttons and you can’t get it to disappear,,, we’ve all been there, now I’ll explain how to stop this happening.

## Add a new protocol to your controller

What does this mean? well to people from a c# background think of it as an interface where the methods can be optional. We add this interface to our Controller much the same way syntactically that specify generic types in c#

![](/images/./image.axd?picture=Screen%20Shot%202012-09-18%20at%2013.47.40_thumb.png)

## TextFieldShouldReturn

Next we implement the method in the protocol that we are interested in. We do two things in this method, first we call a function on the textField to resign the first responder and then we return YES.

![](/images/./image.axd?picture=Screen%20Shot%202012-09-18%20at%2013.53.17_thumb.png)

## Set the delegate

So we are nearly there, we just need to hook up the textField and the delegate, we do this on the viewDidLoad function.

![](/images/./image.axd?picture=Screen%20Shot%202012-09-18%20at%2013.55.03_thumb.png)

That’s pretty much it.
