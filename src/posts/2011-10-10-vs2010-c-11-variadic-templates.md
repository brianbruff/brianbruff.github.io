---
title: "VS2010 C++11 Variadic Templates"
date: "2011-10-10"
category: ".NET & C#"
tags: ["c++", "visual studio"]
---

If you’ve been following the changes in the C++11 standard you may have heard of Variadic templates. In layman’s terms: var arg template parameters.

> Let's take C# to explain what we’re talking about: Take the Action generic delegate, there’s 16 of them! One overload for each parameter.
> 
> ![](/images/blog/image_thumb_105.png)
> 
> However in C++11 we should (when the compiler supports it) be able to use … to indicate that we can have a variable number of type parameters (… I expect comes from Java).

The long and the short of it is, they don’t work in VS2010 yet.

![](/images/blog/image_thumb_106.png)

I wonder do they work in VS11? I’ll update this post once I get a chance to fire it up. I’ll also fire up my Linux machine and give the GNU compiler a whirl.

Stay tuned…

**Update:** Doesn’t work in VS11 either.
