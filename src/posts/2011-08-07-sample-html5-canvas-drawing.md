---
title: "Sample HTML5 canvas drawing"
date: "2011-08-07"
category: "Front-end & JavaScript"
tags: ["html5", "asp.net mvc"]
---

So how hard is it to draw on an HTML5 canvas? Well if you ever lived in a GDI+ world like I once did, then it’s pretty simple. In fact it’s somewhat familiar to Silverlight/WPF people too, the parameters passed to draw a rectangle for example are left, top, width, height. (GDI/Windows API people would be more familiar with using left,top,right,bottom (the RECT struct)). Nonetheless, IMO drawing with the HTML5 canvas couldn’t be easier.

![](/images/blog/image_thumb_75.png)

Here’s the code:

```html
@{
    ViewBag.Title = "Home Page";
}
<h2>@ViewBag.Message</h2>

<canvas id="canvas" width="300" height="300">
    Canvas not supported
</canvas>


@section Scripts
{


    <script type="application/javascript">

        $(function() {
            draw();
        });
    </script>

    <script type="application/javascript">
        function draw() {
            if (Modernizr.canvas ) {
                var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");

                ctx.fillStyle = "rgb(200,0,0)";
                ctx.fillRect(10, 10, 100, 1000);
            }
        }
    </script>
}
```
