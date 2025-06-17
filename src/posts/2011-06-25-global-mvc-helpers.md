---
title: "Global MVC Helpers"
date: "2011-06-25"
tags: ["MVC Global Helpers Razor"]
---

This evening while I was helping an ex colleague of mine, who was venturing onto the web platform for the first time, an interesting thing happened, he taught me a thing or two!

Neil had been researching web forms and MVC, given it was a green field project he choose MVC, WebForms would have sufficed but it is not as elegant and efficient as the next generation of web development tools such as MVC, jQuery and Razor. As part of his research he come across a pluralsite video that mentioned a magic folder for something… naturally this aroused my curiosity, I don’t believe in magic! Surely the presenter was mistaking?

## The video

The video is available [here](http://www.pluralsight-training.net/microsoft/players/PSODPlayer.aspx?author=scott-allen&name=mvc3-building-intro&mode=live&clip=0&course=aspdotnet-mvc3-intro) it’s Scott Allen giving an intro to MVC. Sure enough he mentions a magic folder.

Q. What is this magic folder?  
A. Just the standard App_Code asp folder,

Q. What is so special with in MVC?  
A. It allows you to define global MVC helpers

Q. What’s a MVC Helper?  
A. Read my other post [here](/blog/post/2011/02/10/helper-razor.aspx)

Q. Why is this so magical?  
A. Because the dev team ran out of time ![Smile](/blog/image.axd?picture=wlEmoticon-smile_4.png)

Q. How do I know this?  
A. Because this months edition of DevProConnections magazine contains an article “Fine-Tune Your ASP.NET MVC Skills” that explains it.

From the magazine i’ve learned that according to both the Razor online documentation and Scott Guthrie’s blog, global helpers are supported by placing a page in the ~/Views/Helpers folder. Any helpers that are defined in this folder should be available in any part of the application. However, because of time constraints, this feature wasn’t implemented. The workaround is first to create an App_Code folder and then add to the folder a new helper created as a .cshtml (or .vbhtml). You can then access the the new helper by using . convention.

Q. Did I learn anything else new?  
A. Yes while helping him add scripts to a view I discovered MVC3 ajax helpers, I’m not sure if I’m buying into them fully yet as I’ve gotten used to the jQuery syntax on it’s own, but I’ll be doing some more investigation.

So tnx Neil for letting me help you, I learned a lot! ![Laughing out loud](/blog/image.axd?picture=wlEmoticon-laughingoutloud.png)![Rolling on the floor laughing](/blog/image.axd?picture=wlEmoticon-rollingonthefloorlaughing_2.png)![Nyah-Nyah](/blog/image.axd?picture=wlEmoticon-nyahnyah.png)
