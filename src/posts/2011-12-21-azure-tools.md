---
title: "Azure Tools"
date: "2011-12-21"
tags: ["Azures Emulator"]
---

This evening I decided I’d install the new Azure tools after watching the latest vids that have appeared.

I right click on my MVC3 app and choose to: Add Windows Azure Deployment Project

![](/images/./image.axd?picture=image_thumb_126.png)

Then I hit F5 to run the project and I get an error

Microsoft Visual Studio Unable to find file DFUI.exe ![Baring teeth smile](./image.axd?picture=wlEmoticon-baringteethsmile.png)

### Solution

In the 1.5 SDK there used to be a registry key that pointed to the emulator, with 1.6 this no longer exists and Visual Studio is looking for the dfui.exe in a different location (use Process Monitor from Sysinternals.com to tell you where)

![](/images/./image.axd?picture=image_thumb_127.png)

Once you find where Visual is looking for it, it’s a matter of copying the files in  
C:\Program Files\Windows Azure Emulator\emulator\ to this location.

Try run you app now and it should work.

![](/images/./image.axd?picture=image_thumb_128.png)
