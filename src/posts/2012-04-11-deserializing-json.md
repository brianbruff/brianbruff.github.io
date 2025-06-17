---
title: "Deserializing Json"
date: "2012-04-11"
tags: ["JSon HttpClient deserialization"]
---

With this post I’m back to my lovely OneNote screen clippings, my last few postings were done on Windows8 and I’d no OneNote installed.

### So you want to Deserialize Json in .NET! (C#)

How do you go about it?

There are a few approaches, many poeple are familiar with JSon.NET and using it like this

![](/images/./image.axd?picture=image_thumb_181.png)

or

![](/images/./image.axd?picture=image_thumb_182.png)

Some people may have done it the hard way

![](/images/./image.axd?picture=image_thumb_183.png)

But if you add assembly System.Net.Http.Formatting.dll you’ll get a nice little extension ReadAsAsync  
<http://msdn.microsoft.com/en-us/library/hh836073(v=vs.108).aspx>

![](/images/./image.axd?picture=image_thumb_184.png)

Enjoy!
