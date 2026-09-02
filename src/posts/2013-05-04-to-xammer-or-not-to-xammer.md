---
title: "To Xammer or not to Xammer"
date: "2013-05-04"
category: "Mobile"
tags: ["xamarin", "ios", "objective-c", "json"]
---

## Xamarin vs XCode

Anyone that reads this blog regularly or knows me, will know that I’m a C#/Java guy primarily, but I do love all other languages, especially JavaScript and Objective-C (my Objective-C is just about passable, mainly because I’ve only written 3 iOS applications). I was in London this week and I got an early preview of a new service, it looked pretty good so I was thinking of how I could write a few of my own clients for this. I’ve the luxury of being in a position to take a few approaches.

## Client options

  * HTML5 Desktop Client 
  * iOS native client 
  * Droid native client (I’ve never strictly speaking done one, unless you include my hello world post two years back) 
  * PhoneGap/Kendo UI iPad/Droid apps (I’m doing the phone apps for my Expenses service with these technologies). 

## Decision tree

My first instinct was to go the PhoneGap with Kendo UI, I actually did the initial layout and had a look in the Android Emulator and it was pretty nice (as I was in London I didn’t have my MacBook Air with me and I didn’t have the Visual Studio Phone Tools installed either so Eclipse/Android it was with that painfully slow emulator). The problem I encountered with this approach was that CORS was not enabled by default and I use Visual Studio to develop design debug (PhoneGap can do CORS once the site is white listed).

My next option was to write the native clients, when I arrived back home I quickly ensured I could connect to the server with basic authentication, I used Objective-C firstly, I didn’t use any 3rd party libraries and the end result appears a little verbose (a better iOS developer will probably cry when they look at these screenshots and tell me use AFNetworking or blocks etc (which I used in my BrianKeating.net companion app)).

### XCode Version

![](/images/blog/image_thumb_261.png)

Make the initial request and delegate to the view class.

![](/images/blog/image_thumb_262.png)

Here I set the username and password for the request when/if challenged.

![](/images/blog/Screen_Shot_2013-05-04_at_22.15.41_thumb.png)

Here I allocate a place to store the response if it was a success and save the data into urlData.

![](/images/blog/image_thumb_263.png)

Here I list all the key value pairs in the JSON returned (something I don’t actually show in the C# version).

The attraction of XCode/Objective-C to me is that it’s a different toy to play with.

### MonoDevelop Version

C# is just a fantastic language it’s RAD and Xamarin have done a fantastic job of bringing it to the iOS and Android Platforms. This screen shot shows the same request to the server as done in XCode, the difference is that this took me about 1 minute where the Objective-C version took me about 25 (although I did reuse the storyboard).

![](/images/blog/image_thumb_264.png)

## You said Decision?

So how will I proceed? I’m going to ditch the Objective-C approach for sure:

Reasons:

  * It’s so much faster! I love C++ but can’t get myself to use it for app dev these days simply because C# kicks it to touch for rapid application development, same goes for Objective-C
  * Because I don’t expect to continue this POC myself and will have to hand it over to someone, and I don’t know anyone else on the team that knows objective-C. 

I’m actually still leaning towards the PhoneGap/KendoUI option, I just need to get my grubby hands on the server so I can add the CORS headers (again because I don’t want to do the bulk of my debugging with PhoneGap but rather IE/Chrome and I quite like my browser stack (jQuery/Knockout/Breeze etc)) but the main advantage is that the same source can then be used for the Android platform. Sure Facebook/LinkedIn etc have all been moving away from HTML5 because of the tooling, but I feel it’s the best solution for getting to both markets quickly.

So that is my reasoning, I expect everyone will be faced with much the same decisions and will have to weigh the pros and cons themselves.
