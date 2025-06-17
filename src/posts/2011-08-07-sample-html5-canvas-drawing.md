---
title: "Sample html5 canvas drawing"
date: "2011-08-07"
tags: ["html5"]
---

So how hard is it to draw on a html5 canvas? Well if you ever lived in a GDI+ world like I once did, then it’s pretty simple. In fact it’s somewhat familiar to silverlight/wpf people too, the parameters passed to draw a rectangle for example are , left, top, width, height. (GDI/Windows API people would me more familiar to using left,top,right,bottom (the RECT struct). Nonetheless, IMO drawing with the html5 canvas couldn’t be easier.

![](/images//blog/image.axd?picture=image_thumb_75.png)

Here’s the code

       1:  @{

       2:      ViewBag.Title = "Home Page";

       3:  }

       4:  <h2>@ViewBag.Messageh2>

       5:   

       6:  <canvas id="canvas" width="300" height="300">

       7:      Canvas not supported

       8:  canvas>

       9:   

      10:   

      11:  @section Scripts

      12:  {

      13:

      14:   

      15:
