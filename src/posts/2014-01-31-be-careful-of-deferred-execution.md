---
title: "Be careful of deferred execution"
date: "2014-01-31"
tags: ["deferred execution"]
---

Take the following code, if you have ReSharper installed you’ll be warned that there is possible multiple enumeration of your IEnumerable, this means that Select will be repeated twice for everything in the array.![](/images/./image.axd?picture=image_thumb_292.png)

## ToArray()

One solution is to Enumerate one and immediately after the select by calling .ToArray![](/images/./image.axd?picture=image_thumb_293.png)

### Guava / Java

It’s not just C# that you need to be careful with, take the google java library Guava

![](/images/./image.axd?picture=image_thumb_294.png) We don’t get the same nice warning in IntelliJ\* yet the solution in this case is much the same.

![](/images/./image.axd?picture=image_thumb_295.png)

#### \*IntelliJ

If you’re from a MS background like me and doing any Java, then do yourself a favour and use IntelliJ, it’s much easier to use.
