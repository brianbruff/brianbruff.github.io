---
title: "Efficiency Yield"
date: "2014-01-31"
category: ".NET & C#"
tags: ["linq", "performance"]
---

Talking to an ex colleague of mine this evening about some use cases for yield, it’s quite a handy little keyword, I often use it for splitting a large collection into smaller ones (Chunk).

![](/images/blog/image_thumb_286.png)

## Efficiency

I was presented with another use for yield.

Take a third party API that takes an IEnumerable of objects that are expensive to create, 

![](/images/blog/image_thumb_287.png)

we can see that there is an early exit strategy so we may not need all items in the enumeration. ![](/images/blog/image_thumb_291.png)

Now let’s say we have 3 implementations of this interface. ![](/images/blog/image_thumb_289.png)

Trivial I know, but assume we don’t know if they return null or not at compile time.

Now here’s a nice way of passing all of the above to a third party API and only incur the construction hit as and if when they get enumerated.

![](/images/blog/image_thumb_290.png)

Using the trivial logic outlined here, **ExpensiveFactoryC will never get constructed**.
