---
title: "Charts in MVC3"
date: "2011-07-04"
tags: ["MVC Charting"]
---

So you want to draw a chart in MVC and don’t know where to start?

Step 1) Create a new MVC3 project

Step 2) Open NuGet and add a library reference to “microsoft-web-helpers”

![](/images//blog/image.axd?picture=image_thumb_64.png)

![](/images//blog/image.axd?picture=image_thumb_65.png)

Step 3) Change your action method to create a new chart and write it to the response stream

![](/images//blog/image.axd?picture=image_thumb_66.png)

Result)

![](/images//blog/image.axd?picture=image_thumb_67.png)

Step Additional )

You could return a partial view and even call it from Ajax if you wanted, you could just return Json and use a client side vector graphics library.  
Or you would create your own html helpers / function to make life easier. (many ways to skin a cat).
