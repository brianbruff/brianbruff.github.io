---
title: "Uploading a Blob to Azure container"
date: "2014-07-26"
tags: ["Azure", "Blob", "ConnectionString"]
---

![](/images//images/image_thumb_324.png)

In the picture above you see a storage account in Azure, in the storage account we have an ecbfx (European Central Bank FX Rates) container. Now let’s see how to upload some data to this container using a C# console application.

## **NUGET**

Given we are going to work with C# the best option is to use the .NET library, this can be retrieved from NuGet

![](/images//images/image_thumb_325.png)

## **Code**

![](/images//images/image_thumb_326.png)

The code above connects to the pre-created container, notice that my container has built in Geo Redundancy (primary storage in Dublin, secondary in the Amsterdam) so after running there will be 6 copies of this blob, 3 in Dublin and 3 in Amsterdam, this is the storage package I’ve chosen.

![](/images//images/image_thumb_327.png)

## View Blob

The easiest way to view the newly uploaded blob is to use the Windows Azure server explorer in Visual Studio, it’s the easiest way of getting the connection string to the storage account also.

![](/images//images/image_thumb_328.png)

In the next post I’m going to show you how react to someone uploading a Blob with an automatic trigger.
