---
title: "jQuery Template Example"
date: "2011-06-07"
category: "Front-end & JavaScript"
tags: ["jquery", "json"]
---

Straight to screenshot.

![](/images/blog/image_thumb_53.png)

Ok so I’m here in a hotel in Germany, been stuck in Java all day so I needed .NET like a drug this evening.

Let me describe what you see above.

The screenshot is from WebMatrix, it shows the default webpage where I’m presenting some JSON data to the user. The data itself is just a list of model helicopter types and ratings out of 10 for each (subjective of course). The JSON in this case is hardcoded client side but could of course come from anywhere e.g. a server side MVC action called with jQuery.ajax etc.

The real good stuff comes from the following lines.

Here we define the template that is basically some html littered with prop Names e.g. $(Name}, note the script type that is used for jQuery templates.   

```html
<script id="modelHeliCoptersTemplate" type="text/x-jquery-tmpl">
    <li>
        <b>${Name}</b> (${OutOfTen})
    </li>
</script>
```
  
The load function is quite simple, it basically says: select the helicopter jQuery template and apply the helis JSON to it and put the result into the “results” unordered list.

Have a look at the jQuery template documentation for some more samples and have fun.
