---
title: "Converting APM operations to Tasks using the TPL"
date: "2012-01-01"
category: ".NET & C#"
tags: ["async", "concurrency"]
---

Those of you who have already used .NET 4.5 developer preview will know that tasks are becoming more common in the API, especially with the advent of the async await keywords.

But many of you (including me) can’t really advocate .NET 4.5 in the enterprise so what are our options should we like to use the TaskParallelLibrary?

As you may be aware APM (Asynchronous Programming Model) was the original .NET mechanism for handling Async operations, it will be familiar to you as the IAsyncResult pattern.

So let’s take a common operation of reading from a stream, in .NET 4.5 we already have a Stream.ReadAsync, but again what if we don’t have .NET 4.5 at our disposal?

The task parallel library helps bridge the gap with Task.Factory.FromAsync, here I place it in an extension method for ease of use.

![](/images/blog/image_thumb_146.png)
