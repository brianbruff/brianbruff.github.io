---
title: "Xamarin a few weeks on"
date: "2013-06-13"
tags: ["Xamarin for .net people"]
---

  * I’ve gotten my hands dirty, 
  * I’ve published v1.0 to the store 
  * I’ve gotten the best support I’ve ever seen from Xamarin 
  * I’ve gone back to Objective-C, BOOM! 

## Bindings drove me daft

The reason I walked away was that I found some nice Objective-C widgets I wanted to use. In order to use these in Xamarin I needed to either 

  * Port the source to c# (estimated 1 day) 
  * Create a library in XCode and a component binding in Xamarin Studio 

The first option seemed like an approach I could achieve but did I really want to do this every time I found a nice new control.

The second option proved painful, there were some tools that didn’t work (beta tools of course), I wasn’t quite clear about the multi targeted library I was building etc. It was the straw that broke this camel’s back.

Now I’ve previously indicated that I’m not a seasoned ObjectiveC developer, but I’ve written a few app and some of them even made it to the app store, so for me it didn’t seem daunting…   

I had a few obstacles to overcome:

Basic Auth: I’ve posted before when I started my Xamarin rants that it was a little painful to do Basic Auth, I wanted to use blocks as I like this approach and not the delegate approach, but this was a little painfully or at least it meant that I had to write my own classes, what I did in the end was revert to my old friend AFNetworking that supported exactly what I needed.   
  
KeyStore: The Obj-C code is bloated and verbose and not intuitive, the Xamarin approach is so much easier.

## Lessons learnt

Too many options or being a polyglot can be a PIA (and i’m not talking primary interop assembly), If I didn’t know objectiveC then I would have just figured out the Bindings faster and been happy.

## Recommendations

What would I recommend to my fellow C# programmers…. **Use Xamarin!** I haven’t, but I’ve already invested many hours/days/weeks the language and 3rd party libraries, the mono stack gives you a lot of   
this for free and you will be familiar with it from your .net background.   
  
Also the app I’m currently working on is just collecting Json and displaying it, so it’s not very code intensive on the client. If when an Android version is done it will be in Java because I’ve programmed in Java for years too (hey I’m looking for an excuse (and the time) to try this new Android Studio).   
Given a different use case I we may well have an even more compelling reason for using C# for both platforms with something like MVVM Cross and achieve a more DRY approach.
