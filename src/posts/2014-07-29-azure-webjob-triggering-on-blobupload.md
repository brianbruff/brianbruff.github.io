---
title: "Azure WebJob triggering on BlobUpload"
date: "2014-07-29"
tags: ["Azure WebJobs"]
---

Tonight I’m going to follow up on my previous post where I promised to show you how to react on somone/something uploading a Blob.

**Please read**[**http://azure.microsoft.com/blog/2014/06/18/announcing-the-0-3-0-beta-preview-of-microsoft-azure-webjobs-sdk/**](http://azure.microsoft.com/blog/2014/06/18/announcing-the-0-3-0-beta-preview-of-microsoft-azure-webjobs-sdk/ "http://azure.microsoft.com/blog/2014/06/18/announcing-the-0-3-0-beta-preview-of-microsoft-azure-webjobs-sdk/")**as there is a lot of old information lying about on the web regarding v0-2-0 which will not work in v0-3-0,**_I’m not ashamed to say it’s now the early hours of the morning before I’ve finally managed to get this working as most of the documentation I was reading was v0-2-0._

Let’s get started by creating a console application.

## Nuget

![](/images//images/image_thumb_329.png)  

## Code

In this code you can see that I’m just appending worked… to the input file, the important parts to consider are the BlobTrigger and Blob attributes, the trigger is the item that will start to process when a blobupdates on the reuters-input container, the BlobAttribute is the output and the reuters-gdmx is the identified container for same.

![](/images//images/image_thumb_336.png)  

There are a few options with the job, schedule/on demand/continuous..

![](/images//images/image_thumb_337.png)  

For the automatic trigger I’m setting the job to be On Demand, however I know in the current version of webjobs, that ondemand for blobs are polled every 10 minutes (I hope can be more real-time once WebJobs exit preview).

![](/images//images/image_thumb_332.png)  

![](/images//images/image_thumb_333.png)  

## Connection Strings

You need to add two connections string to your blob storage account (get the connection string with visual studio Azure explorer), I’ve set both to the same storage account. _The last two are from v0-3-0._

![](/images//images/image_thumb_342.png)  

## Test

I’m going to use the AzureStorage explorer to upload a file, once this file gets uploaded the WebJob will run and create the associated blob in reuters-gdmx

![](/images//images/image_thumb_335.png)  

![](/images//images/image_thumb_339.png)  

![](/images//images/image_thumb_340.png)  

## Output

Here you can see the result of the WebJob (appending worked….)

![](/images//images/image_thumb_341.png)  

