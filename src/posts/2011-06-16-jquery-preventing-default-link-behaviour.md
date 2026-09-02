---
title: "jQuery–Preventing default link behaviour"
date: "2011-06-16"
category: "Front-end & JavaScript"
tags: ["jquery", "html5"]
---

This sample shows you how to hijack the default behaviour of the anchor tag and do something different.   
The interesting part is that we use the event arg in the click function, once we have this actual arg we can call preventDefault(); on it to stop the navigation if necessary. 

In this sample I just toggle the visibility of my div with a default animation (now you see it now you don’t).

```html
 <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js" type="text/javascript"></script>
   <script type="text/javascript">
       $(function () {
           $("a").click(function (event) {
               event.preventDefault();
               $("div").toggle("slow");
           });
       });
   </script>
 <style type="text/css">
    div.test { width:362px; height:20; background-color:Red; }
 </style>

 </head>
 <body>
   <a href="http://jquery.com/">jQuery</a>
     <div  class="test">
     <p>this is a test</p>
     </div>
 </body>
 </html>
```
