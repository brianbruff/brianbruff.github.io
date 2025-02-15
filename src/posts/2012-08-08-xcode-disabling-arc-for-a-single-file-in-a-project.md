---
title: "XCode disabling ARC for a single file in a project"
date: "2012-08-08"
tags: ["IOS", "ARC.XCODE", "AFNetworking"]
---

So I’ll put it out there, I’m a novice Objective-C man, in fact I’m still sitting on the fence on whether I should write my iOS apps in C# (MonoTouch) or Objective-c (xcode), I’m leaning a little more towards the Monotouch approach and to be honest I’m just persevering with objective-c for a few reasons

  * It’s a different language, like a new toy I wanna play with it
  * I need to use XCode for interface designer anyway
  * It helps when reading sample code even if just to translate to c#.

So this morning I was trying to create an iPad app for a RestAPI I’m writing in MVC4 Web Api and I went with Objective-C.   
I used AFNetworking to make my Rest calls but unfortunately this library was written before ARC (Automatic reference counting).   
Now for some background: I came to iOS development after the fact and so far I have not had to write non-ARC code (that said I love c++ and deterministic destruction so it wouldn’t bother me that much).

So I was a little stumped when I encountered the following problem:

![](/images/./image.axd?picture=image_thumb_206.png)

![](/images/./image.axd?picture=image_thumb_207.png)

Basically this is telling me that the ARC doesn’t allow this pre-ARC code!

### So how to solve?

Well the solution is somewhat simple, you just need to bring up the project properties Targets -> Build Phases -> Compile Sources and add the -fno-objc-arc compiler flag for those particular files.

![](/images/./image.axd?picture=image_thumb_208.png)
