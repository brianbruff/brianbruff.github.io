---
title: "Azure, Sql User invalid from Azure Website"
date: "2015-01-18"
tags: ["sqlserver", "azure", "ConnectionString", "invalid login"]
---

## Problem

I was faced with a problem this morning that took me a good 30 minutes to figure out..

I had created a website and associated SQL database. However I changed said database as part of some development work. The problem was that even though my publish profile was overriding the Release Connection String with my new database it was getting ignored!

![](/images//images/image_thumb_361.png)  

I knew that the connection string I was supplying was correct as I could log in with Visual Studio and SSMS.

## Cause:

The reason is that the website had already an connection string (under the Configure tab) and this was taking preference. The reason this is here is that one does not have to store the Azure connection string in the publish profile which is quite nice, same goes for a lot of other Azure features.

![](/images//images/image_thumb_362.png)  

## Solution

I removed same and then it works. (Fixing it is also another option but this code is in a private git repository so it’s not a concern for me just now).
