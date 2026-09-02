---
title: "iPhone: remove the iOS Keyboard on Return"
date: "2012-09-18"
category: "Mobile"
tags: ["ios", "objective-c"]
---

Ok this is another XCode/ Objective-C/ iOS post. Stop reading now if you feel sick MSFT fans.

So you’ve written an app and you test out that new data entry field only to find out that the keyboard covers your action buttons and you can’t get it to disappear... we’ve all been there, now I’ll explain how to stop this happening.

## Add a new protocol to your controller

What does this mean? Well to people from a C# background think of it as an interface where the methods can be optional. We add this interface to our Controller much the same way syntactically that we specify generic types in C#.

![](/images/blog/Screen_Shot_2012-09-18_at_13.47.40_thumb.png)

## TextFieldShouldReturn

Next we implement the method in the protocol that we are interested in. We do two things in this method, first we call a function on the textField to resign the first responder and then we return YES.

![](/images/blog/Screen_Shot_2012-09-18_at_13.53.17_thumb.png)

## Set the delegate

So we are nearly there, we just need to hook up the textField and the delegate, we do this on the viewDidLoad function.

![](/images/blog/Screen_Shot_2012-09-18_at_13.55.03_thumb.png)

That’s pretty much it.
