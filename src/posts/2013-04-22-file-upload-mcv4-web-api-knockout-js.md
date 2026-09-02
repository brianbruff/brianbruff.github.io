---
title: "File Upload MVC4 Web API, Knockout.js"
date: "2013-04-22"
category: "Front-end & JavaScript"
tags: ["knockout", "web api", "html5"]
---

I wish to follow up on my previous post [Uploading a file in MVC4 C#5 .NET 4.5](/post/2012/04/04/Uploading-a-file-in-MVC4-C5-NET-45.aspx).

I promised a few things here, an Ajax client, WinRT, iOS, Droid. This post addresses the ajax upload.

First some background, I’m working on an expense tracking system at the moment, the core technologies involved in this Single Page Application are:

  * ASP MVC4 Web API 
  * HTML5 SPA 
  * Knockout.js 

A fundamental part of this system is the ability to upload receipts.   
![](/images/blog/image_thumb_255.png)

When the user browses to an image file, it gets converted to base64 and uploaded via an MVC4 API controller.

Here are the important parts:

## HTML

![](/images/blog/image_thumb_256.png)

First we create an image where we can display either the previously selected image or the newly selected image.   
We only display this image if it’s in the JavaScript model.

Secondly we bind the HTML5 input file with a knockout binding.

## JavaScript

### Model

![](/images/blog/image_thumb_257.png)

The important parts are the image and imageType properties, there also exists a computed property that joins these two so it can be displayed in an image tag. The reason I keep these separated is that I can’t post the source as is without further encoding.

### Knockout Bindings

In Knockout.js you are not limited to the built in bindings like, click and value, you can create your own,   
I’ve taken <https://github.com/khayrov/khayrov.github.com/blob/master/jsfiddle/knockout-fileapi/ko_file.js> as my start point, this pretty much does what I want, however I made a slight tweak in that I wanted base64. (basically because I’ve written some of the Objective-C iOS app already and didn’t fancy changing it).

![](/images/blog/image_thumb_258.png)

## Web API

![](/images/blog/image_thumb_259.png)

#### ExpenseDto

![](/images/blog/image_thumb_260.png)

All source can be viewed @ <https://github.com/brianbruff/Expenses>
