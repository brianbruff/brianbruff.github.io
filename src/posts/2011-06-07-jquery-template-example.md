---
title: "jQuery Template Example"
date: "2011-06-07"
tags: []
---

Straight to screenshot

![](/images//blog/image.axd?picture=image_thumb_53.png)

Ok so I’m here in a hotel in Germany, been stuck in java all day so I needed .net like a drug this evening.

Let me describe what you see above.

The screenshot is from WebMatrix it shows the default webpage where I’m presenting some JSON data to the user. The data itself is just a list of model helicopter types and ratings out of 10 for each (subjective of course). The JSON in this case is hardcoded client side but could of course come from aywhere e.g. a server side MVC action called with jQuery.ajax etc.

The real good stuff comes from the following lines

Here we define the template that is basically some html littered with prop Names e.g. $(Name}, note the script type that is used for jQuery templates.   
  
The load function is quite simple, it basically says: select the helicopter jQuery template and apply the helis JSON to it and put the result into the “results” unordered list.

Have a look at the jQuery template documentation for some more samples and have fun ![Smile](/blog/image.axd?picture=wlEmoticon-smile_2.png)
