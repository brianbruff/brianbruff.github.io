---
title: "IE 11 Disassembly"
date: "2015-11-10"
category: "Front-end & JavaScript"
tags: ["css", "visual studio"]
---

So I’ve been looking at an issue for a client today whereby an application working perfectly well on most browsers was failing on Internet Explorer 11. Users were presented with the following error:

![](/images/blog/image_thumb_377.png) I think we can all agree that it’s not very helpful.  

The problem was this particular application has a massive code base, so it was hard to identify where to start given no other information was furnished by IE. 

## Assembly

In order to gain insight in what was failing I pressed the Debug button and let Visual Studio 2015 grab as much information as it could from the Microsoft Symbol servers only to be presented with the following: 

![](/images/blog/image_thumb_378.png)  

### Reading between the lines

Now I’m not an assembly man, and I say that at the detriment of a future role that has it as a nice to have, I’d rather gouge my eyes out than mess with assembly, that said, looking at the assembly above it was clear that the issue was related to style sheets / CSS.

This allowed me to narrow in on the offending code, and I quickly seen that the following line was causing the problem:

![](/images/blog/image_17__thumb.png)  

It appears IE11 doesn’t like this, the solution for my client was to render the correct CSS serverside and now it’s working perfectly well for them. 

Heading on nearly 20 years into my professional IT career I can honestly admit that this is the first time assembly saved my bacon! (but I’d still rather go blind)  

