---
title: "Watch that error stream with Java process executions"
date: "2011-10-19"
tags: ["SreamGobbler java process execution"]
---

I’m executing a windows process from java and I was bitten by a nasty oversight in one of my project today.  
Everything’s been working fine for some time, but today the application I’m calling started spitting out errors to the error stream.

However I’d not been reading the errorstream in my code and it appears to be the culprit for hanging the process execution.

I don’t really care about the error stream or even the inputsteam myself as the thirdparty application does its own logging.

The solution was a follows: I used a SteamGobbler class to purge the input and error streams. Hope this helps someone.

![](/images/./image.axd?picture=image_thumb_107.png)

![](/images/./image.axd?picture=image_thumb_108.png)
