---
title: "IE 11 Disassembly"
date: "2015-11-10"
tags: ["IE11", "crash", "debug", "assembly", "css", "LeaveStylesheetDownload"]
---

So I’ve been looking at an issue for a client today where by an application working perfectly well on most browsers was failing on internet explorer 11. Users were presented with the following error:

![](/images/./image.axd?picture=image_thumb_377.png)I think we can all agree that it’s not very helpful.

The problem was this particular application has a massive code base, so it was hard to identify where to start given no other information was furnished by IE.

## Assembly

In order to gain insight in what was failing I pressed the Debug button and let Visual Studio 2015 grab as much information as it could from the Microsoft Symbol servers only to be presented with the following:

![](/images/./image.axd?picture=image_thumb_378.png)

### Reading between the lines

Now I’m not an assembly man, and i say that at the detriment of a future role that has it as a nice to have, I’d rather gouge my eyes out than mess with assembly, that said, looking at the assembly above it it was clear that the issue was related to style sheets / css.

This allowed be me to narrow in on the offending code, and I quickly seen that the following line was causing the problem:

![](/images/./image.axd?picture=image%5B17%5D_thumb.png)

It appears IE11 doesn’t like this, the solution for my client was to render the correct css serverside and now it’s working perfectly well for them.

Heading on nearly 20 years into my professional IT career I can honestly admit that this is the first time assembly saved my bacon! (![Smile](./image.axd?picture=wlEmoticon-smile_19.png)but I’d still rather go blind )
