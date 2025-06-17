---
title: "Recursive Directives Angular.js"
date: "2014-03-08"
tags: ["angular.js", "knockout.js", "angular directives"]
---

Another day, another post with me talking about something I barely know about. Today I’m going to show you my ~~first~~ second stab at a recursive Angular.js directive.

Let’s first have a look at the end goal (forgive the as of yet unfinished css and bad contrasting colors)

![](/images/./image.axd?picture=image_thumb_296.png)  
Basically we have a list of objects in the dependency tree, each of these in turn can contain a list of children.

## JSON

Lets have a look at the JSON we are trying to represent

![](/images/./image.axd?picture=image_thumb_297.png)

It’s pretty simple, each dependency can have children that are in fact themselves the very same object literal types.

## Directives

I created two directives, one for the dependency and one for it’s children.

![](/images/./image.axd?picture=image_thumb_298.png)

As seen from the screen clipping the directives are pretty simple, however I’d like to draw your attentions to the link function of the curve directive. The reason I had to do this is because on my first attempt I tried to just call the on the fly and $compiled them in (note: $compile is injected).

The templates for these widgets are pretty trivial (i could have in-lined with “template” but choose to use templateUrl as I much prefer this approach.

This template just creates a

and then calls the other directive that creates the

- entries.![](/images/./image.axd?picture=image_thumb_299.png)

This template shows the

- entries, remember that I $compile in any children in the directive, it also adds a good or bad class if necessary for styling.  
  ![](/images/./image.axd?picture=image_thumb_300.png)

I hope this helps someone should they also encounter the same problem I did with the infinite loop, I’m definitely not saying what is presented above is best practise as I’m relatively new to angular.js after hanging up my _knockout.js_ belt (it was good while it lasted but angular is much more in line what what I need for SPA apps).
