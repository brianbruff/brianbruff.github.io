---
title: "That pesky iOS keyboard again"
date: "2012-10-18"
tags: ["Animating the UiView over keyboard"]
---

In my [previous post](/post/2012/09/18/IPhone-remove-the-IOS-Keyboard-on-Return.aspx) I showed you how to have the keyboard resign first responder status when Return is pressed.

**A little tip:** is that you don’t need to set the delegate in code like my previous post, you can use the connections pane and Crtl drag from the textbox delegate to the view controller in the Outlets section.

![](/images/./image.axd?picture=Screen%20Shot%202012-10-18%20at%2012.30.27_thumb.png)

## Still not good enough

I still had a little niggle about this keyboard covering my view, I really wanted to see what I was doing, so here’s my solution.

I move the view up by y amount of pixels (-120pixels in this sample).

Why negative 120? Well given that your y coordinate starts at 0,0 on the top left (i think I’ve just got a flashback of OS/2 having the origin at the lower left corner… shudder…) we move upwards.

Here is our beautiful UX before we start editing

![](/images/./image.axd?picture=Screen%20Shot%202012-10-18%20at%2012.58.12_thumb.png)

When the keyboard presents after the textbox gains first responder status it’s now covered.

So we move the view up

![](/images/./image.axd?picture=image_thumb_227.png)

When we’re finished we move it back down

![](/images/./image.axd?picture=image_thumb_228.png)

So how did we implement this function?

![](/images/./image.axd?picture=image_thumb_229.png)

We change the view frame to shift the y position, and we did it in an animation to give it a little jazz.. 0.6 seconds is a way too slow for my liking but it does really show off the animation for demo purposes.

Here is what it ends up looking like:

![](/images/./image.axd?picture=Screen%20Shot%202012-10-18%20at%2012.58.28_thumb.png)
