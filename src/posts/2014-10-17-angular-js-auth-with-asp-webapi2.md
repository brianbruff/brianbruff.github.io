---
title: "Angular.js Auth with ASP WebApi2"
date: "2014-10-17"
category: "Front-end & JavaScript"
tags: ["angular", "authentication", "web api"]
---

So in my [previous post](https://briankeating.net/post/WebAPI-OWIN-and-HppClient-Authorize) I show you how to auth with a bearer token against WebApi2 with the OWIN middleware using a HttpClient. Next up I show you how to do the same with AngularJS.

## AngularJS

True to form I’m not going to write a big long blog post on this topic, there are many others that are better than mine. There are even a nice few GitHub hosted solutions you can grab for yourself.

I ended up picking the first post I saw, <http://www.codeproject.com/Articles/742532/Using-Web-API-Individual-User-Account-plus-CORS-En>

Now let’s ignore the CORS part for starters (have banged my head against the walls many times over that). In order to get this working with the latest and greatest Web API as of this post you’ll need two little tweaks.

### 1) Relative URL

The author posts the following code.

![](/images/image_thumb_353.png)  

You’ll need to change the baseUrl to an empty string, if you leave it this way (even when correcting the port) you’ll end up in a CORS situation and you’ll see the browser send an OPTIONS request which you don’t want. (In fairness the author was showing CORS working so there is nothing wrong with his/her post).

### 2) Token Payload

![](/images/image_thumb_354.png)  

The important part is that I create a new object ‘data’ and this contains the querystring for the POST body, in the $http call, I then pass data rather than userData like the codeproject article shows. 

That’s it, you should now be up and running.
