---
title: "jQuery and a little bit of JavaScript"
date: "2011-11-27"
category: "Front-end & JavaScript"
tags: ["jquery", "design patterns"]
---

I’m still working on the LiveResume website, just something I’m playing with in my free time, no I’m not looking for a job, just have an idea that I’ve not seen anywhere else (no I’m not telling you what it is until the site is live).

This little post is to demonstrate how effective the jQuery library is.

Firstly let’s have a look at the HTML to see what we are trying to achieve.

![](/images/blog/image_thumb_119.png)

Now, I’m not using jQuery.ui tabs (yet…); so I want to handle the styling of the active tab.

I’ve got a style called highlight that does this.

The code below shows how effective jQuery is at removing the style from all anchor elements and adding the style to the clicked anchor.

![](/images/blog/image_thumb_120.png)

Let’s break it down.

The first two commented lines are to enable intellisense in Visual Studio.

After this we create a variable menuHandler, I’m using the revealing module pattern for this.

![](/images/blog/image_thumb_121.png) the return function exposed the init function publicly. I’ll be adding more functions to this menuHandler as I go along.

![](/images/blog/image_thumb_122.png) what I’m saying here is select all anchor elements that are children of the element with id=”topmenu” and add an event handler to the click event.

![](/images/blog/image_thumb_123.png) this line removes the highlight class from all the anchors in the same topmenu element.

![](/images/blog/image_thumb_124.png) this line adds the style to the clicked element.

![](/images/blog/image_thumb_125.png) this is somewhat equivalent to an onload event handler for the page (except it doesn’t wait for images… see jQuery docs); what I’m doing in the load handler is creating an instance of the menuHandler function and calling the init method on it.

I can recommend the book: jQuery in action if you wish to get started or improve your jQuery.
