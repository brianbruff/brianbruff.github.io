---
title: "Serverless on my server"
date: "2018-03-21"
tags: ["Azure functions serverless"]
---

So I’ve been looking for a serverless framework that can run on-prem and in the cloud, I’ve been leaning towards OpenFaaS as it appears to be gaining more traction, however I love Azure functions and though let’s see if this is a viable solution.

I download what is a Preview, so I wasn’t expecting miracles, I’m sharing the reasons why I can’t use it for my own requirements below.

_It might save some of you guys the effort, I must reiterate that this is still a preview so some of the stuff I say here will be out of date really quickly!_

**I have decided against Azure Function On Prem in March 2017 because** :

- It needs Sql Server, I can’t rely on having this at least not for some brown field projects I want to use serverless for.
- It needs IIS, I have to run on Linux (might be a solved problem… especially as it’s using the new .net core runtime )
- It only has Javascript and C# language support in preview, I need Java, and Go and Python would be nice to haves
- The packaging was a windows installer, I was hoping for some docker images, I expect this is a solved solution and for now the MSI is a quick win for the developers.

Next it’s down the rabbits burrow with OpenFaas on Kubernetes, cross your fingers for me!

Aside from the above which are mostly external limitations it’s nice to see Azure Functions Running locally

![](/images//images/image_thumb_440.png)
