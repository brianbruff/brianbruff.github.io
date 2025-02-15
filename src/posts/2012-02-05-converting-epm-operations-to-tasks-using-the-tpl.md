---
title: "Converting EPM operations to Tasks using the TPL"
date: "2012-02-05"
tags: []
---

Previous post

# Overview

The Event Programming Model (EPM from her on in) was introduced in .NET 2.0, it’s purpose was to serve as a simpler pattern for asynchronous operations than the Asynchronous Programming Model (APM / IAsyncResult, see my previous post on APM) where possible, mostly in UX code. Methods that use this pattern typically end in Async and have a Completion event.

The best known implementation of the EPM is the BackgroundWorker component, it’s got a distinct advantage in that it tries to use a synchronization context to fire the event on the thread from which it was called, the APM on the other hand offers no such guarantee.

### Let’s see this in action (.net 4.0)

![](/images/./image.axd?picture=image_thumb_151.png)

What you can see in the snippet above is a simple windows form (been a while my old friend) application. Let me paint you a picture, it’s early February 2012 and I’m stuck here at Brussels international airport, in the middle of a snow blizzard wondering if I’m going to have a flight home. The plane that will take me there is arriving in from Dublin so I’m looking at the live departures to see if it’s departed (already 15 mins late darn it.. ) anyway back to the post at hand; I’m downloading the page html with the call to DownloadStringAsync(), you can see in the completion event handler that I’m not doing any Invoking (dispatching to those of you that never had the pleasure of windows forms).

Now this is what it looks like after the event gets fired.

![](/images/./image.axd?picture=image_thumb_152.png)

hey and looks like it’s running MS tech (notice that viewstate, incase the .aspx didn’t give it away!) nice! If you come from a web background this may not seem that odd to you, but if you started out desktop application development like me there was one golden rule you never forgot and that’s that always talk to the GUI in one thread and one thread only.

If the event handler wasn’t in the GUI thread above we would have received a cross thread exception like this:

![](/images/./image.axd?picture=image_thumb_153.png)

Sadly TPL doesn’t handle the EPM as easily as the APM specifically in respect to the synchronization context, but lets see how we approach it, you may have to if you’re pre .net 4.0 as the DownloadStringAsync doesn’t exist!

![](/images/./image.axd?picture=image_thumb_154.png)

With the code above we hit the cross-thread exception problem. We could do a Control.BeginInvoke (or Dispatcher.BeginInvoke in WPF), but lets imagine we were writing a library and we wanted it to be framework agnostic, how would we do this?

Actually it’s pretty simple, we just supply a context like this:

![](/images/./image.axd?picture=image_thumb_155.png)

p.s. I got home at 4am ![Sad smile](./image.axd?picture=wlEmoticon-sadsmile_1.png)
