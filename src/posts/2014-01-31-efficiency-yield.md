---
title: "Efficiency Yield"
date: "2014-01-31"
tags: ["C#", "Yield"]
---

Talking to an ex colleague of mine this evening about some use cases for yield, it’s quite a handy little keyword, i often use it for splitting a large collection into smaller ones (Chunk).

![](/images/./image.axd?picture=image_thumb_286.png)

## Efficiency

I was presented with another use for yield.

Take a third party API that takes an IEnumerable of objects that are expensive to create,

![](/images/./image.axd?picture=image_thumb_287.png)

we can see that there is an early ![](/images/./image.axd?picture=image_thumb_291.png)exit strategy so we may not need all items in the enumeration.

Now lets say we have 3 implementations of this interface![](/images/./image.axd?picture=image_thumb_289.png)

trivial i know, but assume we don’t know if they return null or not at compile time.

Now here’s a nice way of passing all of the above to a third party API and only incur the construction hit as and if when they get enumerated.

![](/images/./image.axd?picture=image_thumb_290.png)

Using the trivial logic outlined here, **ExpensiveFactoryC will never get constructed**.
