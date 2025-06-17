---
title: "DRY out your MVC Views"
date: "2011-02-09"
tags: []
---

For those of you that don’t know DRY : Don’t Repeat Yourself.

Take the following two screens

![](/images//blog/image.axd?picture=image_thumb_10.png)

![](/images//blog/image.axd?picture=image_thumb_11.png)

They are nearly identical.

MVC3/Razor provides two ways to make things DRYer.

1. Layouts (same as asp.net master pages, not covered in this post)

2. Partial views

Here’s how.

![](/images//blog/image.axd?picture=image_thumb_12.png)

###### Shows the create page, using the Html.Partial extension method

![](/images//blog/image.axd?picture=image_thumb_13.png)

###### Shows the edit page, using the Html.Partial extension method on the same partial view as well

![](/images//blog/image.axd?picture=image_thumb_14.png)

###### Shows the partial view that gets injected (for want of a better word) into the two views shown previously.
