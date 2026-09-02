---
title: "Dynamically load HTML into a div using jQuery"
date: "2011-03-05"
category: "Front-end & JavaScript"
tags: ["jquery", "html5"]
---

Mucking about more and more with jQuery now that it’s pretty much become the industry standard, so I needed a little project to work on. I’ve previously created my online c.v. in a Silverlight4 app (must dig that out and add it to the site); this time I decided to stay clear of any server side tech. and do everything client side.

So I decided to use jQueryUI [http://jqueryui.com/](http://jqueryui.com/ "http://jqueryui.com/") for a few UX components; first step was to create some tabs.

#### Creating tabs:

Now if you look at jQueryUI samples for tabs you’ll see something like this.

```xml
        <div id="tabs">
            <ul>
                <li><a href="#tabs-1">First</a></li>
                <li><a href="#tabs-2">Second</a></li>
                <li><a href="#tabs-3">Third</a></li>
            </ul>
            <div id="tabs-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et .</div>
            <div id="tabs-2">Phasellus mattis tincidunt nibh. Cras orci urna, blandit id, pretium vel, aliquet ornare, felis. .</div>
            <div id="tabs-3">Nam dui erat, auctor a, dignissim quis, sollicitudin eu, felis. Pellentesque nisi urna, interdum eget.</div>
        </div>
```
Now this is all well and good, but I’ve never been one for dumping a load of HTML/C#/JavaScript etc onto my page, maybe it’s my C++ beginnings etc that causes me to look for a structured solution, but whatever it is, I decided to put the content of each tab into a separate web page.

Here’s how:

  * Create your webpages   
  
![](/images/blog/image_thumb_33.png)

  * Load your content into the tab divs (I’ve just done this after the DOM is loaded with jQuery, I may lazy load other pages…)

```html
<script type="text/javascript">
    $(function(){
        // Init the tab control with jQuery
        $('#tabs').tabs();
        // Load the first page
        $('#tabs-1').load('ResumeTabs/Personal.htm');
    });
</script>
```

![](/images/blog/image_thumb_34.png)

![](/images/blog/image_thumb_35.png)

That’s it, pretty impressive ey… (that or I’m just easily impressed).
