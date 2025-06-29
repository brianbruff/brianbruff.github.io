---
title: "Azure vs. AWS Text to Blob with SDKs"
date: "2016-06-08"
tags: ["Azure", "AWS", "CloudWars"]
---

This demonstrates what is involved in writing and reading some text to an Azure and an AWS blob.

## Use case

What i set out to achieve was to demonstrate how to read and write some text to a blob with the SDKs. Just to make it a little more interesting I decided to use .NET for the reading and Java for the writing.

## Obtaining the SDKs

Adding the SDKs was a seamless process, for .NET Nuget was used and for Java Maven was used

**.Net** | **Java**  
---|---  
| ![](/images/./image.axd?picture=image_thumb_424.png)  

![](/images/./image.axd?picture=image_thumb_425.png)  
![](/images/./image.axd?picture=image_thumb_426.png)  
  
### Write

#### Azure

![](/images/./image.axd?picture=image_thumb_420.png)  

#### AWS

![](/images/./image.axd?picture=image_thumb_421.png)  

### Read

#### Azure

![](/images/./image.axd?picture=image_thumb_422.png)  

#### AWS

![](/images/./image.axd?picture=image_thumb_423.png)  

## Conclusions

Both SDK’s were trivial to install and use, the Azure SDK’s suited my use case a little better in that they didn’t need me to deal with files in my Application code (I expect text is not a mainstream use case).

AWS as always relies on the region being specified which I can’t say I like that much.
