---
title: "Angular.js .NET File Upload"
date: "2014-05-23"
tags: ["FileUpload"]
---

In this post I’m going to show you how to upload a file using Angular.js on the client side and Asp WebApi on the back end.

## Lets get started

Create you project in visual studio, and add your angular.js app controllers etc.

Interestingly enough [I’ve already shown you how to do the server side](https://briankeating.net/post/Uploading-a-file-in-MVC4-C5-NET-45) over 2 years ago!   
Crikey 2 years and I’m still writing about the same old stuff….. well not really, last time it was knockout, sliverlight and the likes, now it’s Angular.js’ turn.

## Angular file upload, Nuget

In order to facilitate the process, we’re going to use a nuget package I like, see screenshot.

![](/images/./image.axd?picture=image_thumb_312.png)  

The beauty of this package is that its got shims for non html5 browsers (apparently there are a few hanging around still :-( )

To use this package you’ll need to include 2 scripts, file-upload-shim before angular.js and file-upload after.

### Script Includes

![](/images/./image.axd?picture=image_thumb_313.png)  

### Markup

Next add the input tag and add the ng-file-select directive

![](/images/./image.axd?picture=image_thumb_314.png)  

### Javascript

#### Module

Add the upload module

#### Factory

![](/images/./image.axd?picture=image_thumb_315.png)  

Here i added the $upload factory to my controller

#### Controller function

![](/images/./image.axd?picture=image_thumb_316.png)  

Here I enumerate the files (should i wish to have multi select) then I upload each one by posting to my Web Api .net controller, I pass a little more information also as to the diff side, but that’s pretty much it.

## .NET

Now even though I did show you the .net code before I’m going to show it again now, because as I mentioned I’m passing a little information as to the side the file I’m uploading represents.

![](/images/./image.axd?picture=image_thumb_317.png)  

![](/images/./image.axd?picture=image_thumb_318.png)
