---
title: "The lazy singleton pattern revisited."
date: "2012-10-30"
tags: ["Thread safe lazy singleton .net 4+"]
---

If you want to get a feel for the singleton pattern in C# one of the best resources I always revisit is on John Skeet’s (@jonskeet) website [http://www.yoda.arachsys.com/csharp/singleton.html](http://www.yoda.arachsys.com/csharp/singleton.html)

I encourage you to read the above article to appreciate the little intricacies or requiring static constructor, BeforeFieldInit, volatile etc.

However: If you just want the easiest lazy evaluation solution in .net4+, then you’ve come to the right place.

![](/images/./image.axd?picture=image_thumb_230.png)

Lazy guarantees thread-safe lazy construction.

# UPDATE: 

If I’d followed Jon’s notice, at the top of the page I linked to, I would have seen the post is now located [here](http://csharpindepth.com/Articles/General/Singleton.aspx) and moreover, he covers the Lazy approach there.

## 
