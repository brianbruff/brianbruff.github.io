---
title: "Web App deployment to AWS and Azure"
date: "2016-03-15"
tags: ["CloudWars", "Elasticbeanstalk", "AppService"]
---

As promised, hereby the first instalment of the AWS vs Azure blog post saga, again I’m trying to remain impartial throughout.

What I intend to outline is at this stage is the show to get started deploying a new application to AWS and to Azure from within Visual Studio. I’m sure there are those of you that are shouting, “.NET, Visual Studio, Azure? Of course Azure will do it better!!!” however rest assured this is only the first of a few posts related to Azure App Service and AWS elastic beanstalk and AWS doesn’t fair all that badly.

## Sample Application

The sample application in this case is just a File/New ASP MVC5 project using .net 4..6.1, I’m only hitting the home page as a test and not worrying about databases for now (databases will make another interesting series of blog posts!).

## AWS Elastic Beanstalk

AWS has a AWS Toolkit plugin for Visual Studio, this allows you to view and manipulate AWS resources

![](/images/./image.axd?picture=image_thumb_379.png)

It also lets you Publish Applications to AWS by right clicking on the solution and choosing “Publish to AWS”

![](/images/./image.axd?picture=image_thumb_380.png)

Once you choose this option you’ll be presented with a dialog that lets you choose your environment or create a new one. ![](/images/./image.axd?picture=image_thumb_381.png)

If you don’t already have one, lets create one, you will choose a name for the environment

![](/images/./image.axd?picture=image_thumb_382.png)

Next you choose your instance size (the underlying VM size, or any custom Amazon Machine Image you’ve created previously), other options of interest are, use non-default VPC, this is basically the network you’ll be running on, all AWS accounts get a default VPC per region (and if you delete it you’ll need to contact AWS to get it back!). The option of single instance environment is selected here as this is just a test. If i wasn’t running in single instance mode, I would be able to Enable Rolling Deployment to keep my app running while it gets updated (more about that here: <http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rollingupdates.html>)

![](/images/./image.axd?picture=image_thumb_383.png)

Lastly we choose the application settings, I’m just deploying a .net 4 runtime debug application.

![](/images/./image.axd?picture=image_thumb_384.png)

Once you review and finish, you can see your application start deploying on the portal

![](/images/./image.axd?picture=image_thumb_385.png)

Once it’s finished which can take a few minutes after the upload you should see the Health go Green and you can access your application

![](/images/./image.axd?picture=image_thumb_386.png)

![](/images/./image.axd?picture=image_thumb_387.png)

_Note_ : If you’re following along and wish to stop this ElasticBeanstalk environment to minimize costs/free tier bandwidth, then please ensure to terminate it from the ElasticBeanstalk section of the console, Stopping the underlying EC2 instance will only serve to signal the autoscaling group it belongs to, to start a new instance and restore the health of this application.

## Azure App Service

Now lets deploy this same application to azure. Right click on solution explorer and choose Publish

![](/images/./image.axd?picture=image_thumb_388.png)

Choose to Azure

![](/images/./image.axd?picture=image_thumb_389.png)

Like AWS where we chose a server environment we need to choose an app hosting plan, with Azure you can sign up for a free trial, if you have a subscription you can choose to deploy a free cloud app (you get 10 free per region, there are some limitations which we are not concerned with just now).

![](/images/./image.axd?picture=image_thumb_390.png)

After creating this new hosting plan we arrive back at the publish dialog

![](/images/./image.axd?picture=image_thumb_391.png)![](/images/./image.axd?picture=image_thumb_392.png)

Visual Studio then starts the publish task and opens the application in your default Visual Studio specified web browser.

![](/images/./image.axd?picture=image_thumb_393.png)

You can also see your new application seeding life in the Azure portal <http://portal.azure.com>

![](/images/./image.axd?picture=image_thumb_394.png)

## Summary

So in this blog post I’ve run through how to deploy applications to PaaS offerings on AWS and Azure, in the next post I’m going to drill down and and do some more comparing and contrasting of these two applications, stay tuned!
