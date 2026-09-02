---
title: "Using DataTables.net with ASP MVC Web API"
date: "2012-07-07"
category: "Front-end & JavaScript"
tags: ["jquery", "web api", "json"]
---

So I’ve been working on a Web application that uses the ASP MVC4 Web API. I like this approach especially as it will easily allow me to support other clients I/others may write in future, in so far as, it returns JSON and is a RestAPI.

Now I’ve never used DataTables before so I’m trialling it as my client side HTML grid. However I quickly ran into problems with it and the expected JSON Payload.

If you are familiar with the various .NET JSON serializers you’ll get some JSON back with Key value pairs.

![](/images/blog/image_thumb_193.png)

e.g. {[“Name” : “Brian”, “Age” : “35”], [“Name” : “Brian1”, “Age” : “36”]}

This causes a major problem for DataTables in that it expects (_by default_) 

e.g. {“Brian”, “35”], [“Brian1”,“36”]}

I say by default because maybe there is a way to configure this out of the box with column mappings and what not, however I can’t see the wood for the trees so my first approach will be to perform this data mapping myself, I’ll RTFM at a later date.

So where can I plug into the pipeline and map this data? fnServerData! This function allows me to manage how I get and format the data, exactly what I need.

Here’s how I’ve implemented it.

![](/images/blog/image_thumb_194.png)

I’m not saying it’s the best solution! May even have a few bugs, but it appears to do the trick for me for now. 

## Update:

I’ve now read the documentation: and it’s oh so simple to handle the ASP MVC JSON array.

![](/images/blog/image_thumb_195.png)

### Moral of the story

Read the manual.
