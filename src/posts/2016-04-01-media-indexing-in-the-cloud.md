---
title: "Media Indexing In the Cloud"
date: "2016-04-01"
tags: ["CloudWars", "aws", "azure media indexer"]
---

So out of the blue I found myself giving Azure Media Indexing a trial run, for no other reason other than I could, this is why I love cloud tech so much, it brings something that would have been very difficult 5-10 years ago, within reach of anyone with an public cloud account.

## AWS vs Azure

Both AWS and Azure have media services, typical used to manage digital media and serve it up to consumer playback devices at scale.

AWS has the the Elastic Transcode and Azure has Azure Media Services, however only Azure has the ability to dig into audio or media files and extract the text within.

## Azure Media Indexer

Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. You can process one media file or multiple media files in a batch. Have a look at this post for some details on how to do it from code <https://azure.microsoft.com/en-us/documentation/articles/media-services-index-content/>

The code uploads a file then starts an indexing job, then downloads the results:   
**Note:** The source code seen above has a typo, I’ve submitted a pull request to hopefully this will be fixed, but easy to spot.   
Also the download part failed with an exception for me so i just pulled it down with a little bit of code on a second pass.

![](/images/./image.axd?picture=image_thumb_414.png)  

The above code is possibly all you need if you wish to upload content and start the indexing job manually with the old portal.

#### Here’s how:

On your media account upload some content

![](/images/./image.axd?picture=image_thumb_415.png)  

![](/images/./image.axd?picture=image_thumb_416.png)  
  
Once the content is uploaded, start the indexer process, set a good title as Azure will reach out to the interweb and use it to seed the language extraction.

![](/images/./image.axd?picture=image_thumb_417.png)  

![](/images/./image.axd?picture=image_thumb_418.png)  
  
There is no way to download the output from the portal so use use the code i shared above to download the content.

I processed the latest podcast at time of publishing from <https://www.dotnetrocks.com/>   
<https://s3.amazonaws.com/dnr/dotnetrocks_1276_news_from_build.mp3>

In hindsight it was possibly not the best podcast to index as it was recorded live @build (i expect, i’m two episodes behind on DNR this week so have not listened to it yet), the DNR guys typically have exceedingly good audio, at some stage it might be worth indexing another episode.

## Results

You can find the results here [here](/data/dotnetrocks_1276_news_from_build.zip) , initially my knee jerk reaction was , “ah this is poor” but after reflecting on it I’m blown away by what was done and so so, sooo easily!

With a bit of editing this can be thrown into Azure Search / Sql Server etc for full text search and direct seek media playback.

See for yourself:

![](/images/./image.axd?picture=image_thumb_419.png)  

For sure it needs some editing, e.g.   
I release the eleventh music decode by   
should in-fact be   
I released the eleventh music to code by

but what a great start!!!
