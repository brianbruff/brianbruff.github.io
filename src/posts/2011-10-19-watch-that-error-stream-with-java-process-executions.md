---
title: "Watch that error stream with Java process executions"
date: "2011-10-19"
category: "Java & JVM"
tags: ["process execution", "concurrency"]
---

I’m executing a Windows process from Java and I was bitten by a nasty oversight in one of my projects today.   
Everything’s been working fine for some time, but today the application I’m calling started spitting out errors to the error stream.

However I’d not been reading the error stream in my code and it appears to be the culprit for hanging the process execution.

I don’t really care about the error stream or even the input stream myself as the third party application does its own logging.

The solution was as follows: I used a StreamGobbler class to purge the input and error streams. Hope this helps someone.

![](/images/blog/image_thumb_107.png)

![](/images/blog/image_thumb_108.png)
