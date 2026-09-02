---
title: "Angular.js .NET File Upload"
date: "2014-05-23"
category: "Front-end & JavaScript"
tags: ["angular", "web api", "html5"]
---

In this post I’m going to show you how to upload a file using Angular.js on the client side and ASP.NET Web API on the back end.

## Let’s get started

Create your project in Visual Studio, and add your Angular.js app controllers etc.

Interestingly enough [I’ve already shown you how to do the server side](https://briankeating.net/post/Uploading-a-file-in-MVC4-C5-NET-45) over 2 years ago!   
Crikey 2 years and I’m still writing about the same old stuff... well not really, last time it was Knockout, Silverlight and the likes, now it’s Angular.js’ turn.

## Angular file upload, Nuget

In order to facilitate the process, we’re going to use a nuget package I like, see screenshot.

![](/images/blog/image_thumb_312.png)  

The beauty of this package is that it’s got shims for non-HTML5 browsers (apparently there are a few hanging around still :-( )

To use this package you’ll need to include 2 scripts, file-upload-shim before angular.js and file-upload after.

### Script Includes

![](/images/blog/image_thumb_313.png)  

### Markup

Next add the input tag and add the ng-file-select directive.

![](/images/blog/image_thumb_314.png)  

### JavaScript

#### Module

Add the upload module.

#### Factory

![](/images/blog/image_thumb_315.png)  

Here I added the $upload factory to my controller.

#### Controller function

![](/images/blog/image_thumb_316.png)  

Here I enumerate the files (should I wish to have multi select) then I upload each one by posting to my Web API .NET controller, I pass a little more information also as to the diff side, but that’s pretty much it.

## .NET

Now even though I did show you the .NET code before I’m going to show it again now, because as I mentioned I’m passing a little information as to the side the file I’m uploading represents.

![](/images/blog/image_thumb_317.png)  

![](/images/blog/image_thumb_318.png)
