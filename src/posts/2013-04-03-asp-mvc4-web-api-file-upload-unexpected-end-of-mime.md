---
title: "ASP MVC4 Web API file upload: Unexpected end of MIME"
date: "2013-04-03"
tags: ["Unexpected end of MIME MVC WebApi"]
---

So I’ve had a problem uploading a file using a HTML5 input of type file field.

![](/images/./image.axd?picture=image_thumb_252.png)

For love nor money could I see a problem with the code above (in my defence I’m working on this project late in the evening and have my First dose of Man Flu this year, I’m a 2012 survivor see: [www.manfluanonymous.com](http://www.manfluanonymous.com) )

When i get into my server code an exception was getting thrown when i read the multipart post.

![](/images/./image.axd?picture=image_thumb_253.png)

All the Googling in the world didn’t help me, I saw lots of people adding “\r\n” which I’m still scratching my head over to be honest, I saw others complain about the MVC4 beta..

[But hang on: I’ve done this before](/post/2012/04/04/Uploading-a-file-in-MVC4-C5-NET-45.aspx): So what has changed? actually something really silly , 

I simply forgot to set the input name attribute!!!

![](/images/./image.axd?picture=image_thumb_254.png)

Hope this helps somebody …
