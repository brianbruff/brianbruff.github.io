---
title: "Workflow Arguments how to"
date: "2010-09-10"
category: "Workflow (WF)"
tags: ["wf4", "unit testing"]
---

So you've started up your very first 4.0 Workflow application.  
You've added some arguments and want to know how to pass some information...   
You can either use the Dictionary approach that exists since 3.0 or you can use the properties you've just created.

These screenshots show a simple workflow with an input string UserName and an output string Greeting.

![](/images/blog/2010/9/1.png)

I added an assignment activity and set the "To" to be the output Argument "Greeting".

And set the Value as follows.

![](/images/blog/2010/9/3.png)

To prove this works I've added a test fixture and implemented it as follows.

![](/images/blog/2010/9/2.png)

So there you go. The quickie for today.
