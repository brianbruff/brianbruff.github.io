---
title: "Cloud costs: Shut those VM’s down"
date: "2016-03-20"
category: "Cloud & Infrastructure"
tags: ["azure", "aws", "deployment", "performance"]
---

The public cloud is fantastic for numerous reasons, if you’re not faced with some restriction such as where your data lives or other factors, then my advice is get away from private clouds and get to the public clouds as fast as your legs can carry you!

However once you’re there it’s not all plain sailing, if you let a team of people loose to play with all these new toys, on the back of your company’s credit card, then costs can start to accumulate very quickly! 

Sometimes, your VM’s are not being used for production and what invariably happens, is that these machines get forgotten about or are left running for no good reason, now while there are a few ways to capture such scenarios, what I’ll show you now is a very quick way of scheduling those known VM’s to shut down (or start up) on a predefined schedule.

## AWS

For AWS the easiest way of scheduling a single standalone VM to shut down is to use the AWS Data Pipeline service.  ![](/images/blog/image_thumb_395.png)  

Let’s quickly show the workflow:

1) Create new Pipeline with CLI Command

![](/images/blog/image_thumb_396.png)  

2) Enter the Stop EC2 CLI commands

![](/images/blog/image_thumb_397.png)  

Note: This field only shows as one line of text vertically in Chrome so I modified the styles to show the full command.

You can see that I have two different stop commands, I could combine these into the one command with the two IDs however if one fails then they both fail, this can be problematic if for example an Instance gets terminated.

3) Schedule

![](/images/blog/image_thumb_398.png)  

4) Set log file bucket

![](/images/blog/image_thumb_399.png)  

5) Select role

![](/images/blog/image_thumb_400.png)  

Choose custom and then select the two defaults.   
_Security Note:_ Roles need to be configured to allow Data Pipeline access to your VM’s, please see here: <https://aws.amazon.com/premiumsupport/knowledge-center/stop-start-ec2-instances/>

6) Done

![](/images/blog/image_thumb_401.png)  

That’s it, you now have a scheduled task that will switch off your vm’s nightly. It should be noted that this will start a micro data pipeline ec2 instance VM with a default run time of 50 minutes, so you need to ensure the end justifies the means, better yet reduce the run time by editing the workflow to e.g. 15 minutes.

![](/images/blog/image_thumb_402.png)  

## Azure

In order to achieve the same results with Azure we are going to select Azure Automation.  ![](/images/blog/image_thumb_403.png)  

If you’re familiar with Azure you will know that there are currently two ways of creating VM’s, the classic approach and the RM (resource manager approach). In this post I’ll show you the RM approach, but feel free to substitute classic in its place with a nearly identical approach. 

1) Open or create an Azure Automation account.

![](/images/blog/image_thumb_404.png)  

2) Edit Assets

![](/images/blog/image_95__thumb.png)  

![](/images/blog/image_thumb_405.png)  
  
Add a variable for the AzureSubscriptionId you’ll be using.   
Select your service principal account, you’ll have to search for it to appear.

3) Runbook

We have two options now, we can either use some PowerShell or some graphically defined workflows, let’s do this with a graphical version, we don’t need to create this, we simply import from the gallery.

![](/images/blog/image_thumb_406.png)  

![](/images/blog/image_thumb_407.png)  

After importing choose Edit on the runbook.

![](/images/blog/image_thumb_408.png)  

![](/images/blog/image_thumb_409.png)  

4) Set inputs

![](/images/blog/image_thumb_410.png)  

Then we set the two Assets we provided earlier and optionally a ResourceGroupName (to stop all vm’s in a resource group) or a VMName. The “Auto” you see above isn’t a keyword, it’s my badly named ResourceGroup.

5) Publish

![](/images/blog/image_thumb_411.png)  

6) Set schedule

Go back to the Runbook and choose schedule.

![](/images/blog/image_thumb_412.png)  

With the schedule you can specify any of the input parameters and override the defaults if you so wish.

_Security Note:_ Much the same as Azure you’ll need to ensure you’ve permission to access the VM’s from Azure Automation, the best option is to create a SecurityPrinciple application. See: <https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/>

## Conclusion:

While it does look like the Azure approach is much more convoluted it is much more powerful, e.g. it is very easy to extend the Azure run book to check all VM’s for a “Production” tag and only shut down vm’s if they are not production (because that would be bad right!); with AWS, we are simply relying on a feature of Data Pipeline that allows us to run simple CLI commands. 

Pricing is much of a much-ness between each, with Azure you can run for free (to a limit).

![](/images/blog/image_thumb_413.png)  

AWS the 15 mins with a micro instance is not even worth worrying about.
