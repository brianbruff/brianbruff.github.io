---
title: "Writing to an Azure Queue"
date: "2014-08-15"
tags: ["Azure Queue"]
---

If you've seen my [previous post](https://briankeating.net/post/Uploading-a-Blob-to-Azure-container) then this post is quite similar, this time however I write to an Azure Queue and not to a blob.

## Code

First of all you need an Azure storage account as before, but once this is setup, consider the following code…

![](/images//images/image_thumb_346.png)   

What I’m doing in the code above is 

  1. Connecting to my storage account
  2. Creating the queue if it doesn't exist (remember you’ll get a bad request if you don’t name the queue correctly!).
  3. Then I create a simple message, I’m using an POCO object from another project and serializing it to JSON.

## Did it work?

Lets use VS2013 U3 to check!

![](/images//images/image_thumb_347.png)  

Open your server explorer and select the queue under the storage account you’ve chosen in your connection string, double click

![](/images//images/image_thumb_348.png)  

Above you see the message added to the queue, you can see how many times it was de-queued and when it’s set to expire, If we use a [competing consumer pattern](http://msdn.microsoft.com/en-us/library/dn568101.aspx) that count may be more than 1!

## Next

I’m a little thorn re my next post, I’ve been writing a post on c# expression trees which is nearing completion, however I think to keep in line with the current trend I’ll post how this queue can be read and feed to an Azure Service Bus topic (pub/sub)… stay tuned ;-)
