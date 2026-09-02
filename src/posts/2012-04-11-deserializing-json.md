---
title: "Deserializing JSON"
date: "2012-04-11"
category: "Web & APIs"
tags: ["json", "web api"]
---

With this post I’m back to my lovely OneNote screen clippings, my last few postings were done on Windows8 and I’d no OneNote installed. 

### So you want to Deserialize JSON in .NET! (C#)

How do you go about it?

There are a few approaches, many people are familiar with Json.NET and using it like this:

![](/images/blog/image_thumb_181.png)

or 

![](/images/blog/image_thumb_182.png)

Some people may have done it the hard way

![](/images/blog/image_thumb_183.png)

But if you add assembly System.Net.Http.Formatting.dll you’ll get a nice little extension ReadAsAsync   
<http://msdn.microsoft.com/en-us/library/hh836073(v=vs.108).aspx>

![](/images/blog/image_thumb_184.png)

Enjoy!
