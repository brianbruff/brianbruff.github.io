---
title: "MVC Scaffolding and EF4CodeFirst–A data driven website in under a minute!"
date: "2011-06-15"
tags: []
---

.

Here’s a run through on how to create a data driven web application in under a minute. I’m going to create a simple part tracking system as to manage the vast amount of helicopter parts lying about my garage. Some parts I’ll never use, some parts are missing little comprising bits, the idea is to deploy the application as part of the club website allowing members to quickly find a part in a hurry for the big upcoming competition

Lets get started: 

1) Install MVC Scaffolding if you’ve not done so before, go to the package console and type Install-Package MvcScaffolding

![](/images//blog/image.axd?picture=image_thumb_54.png)

  * Create a class for the part 

![](/images//blog/image.axd?picture=image_thumb_55.png)

![](/images//blog/image.axd?picture=image_thumb_56.png)

Now type Scaffold Controller PartModel

![](/images//blog/image.axd?picture=image_thumb_57.png)

Here you see that all the views get created, hey and they are even [DRY](/blog/post/2011/02/09/DRY-out-your-MVC-Views.aspx)

If you want to make unit testing easier or suport Ioc etc you can use the –**Repository** flag.  
If you need to rescaffold then use –Force.

Ok so we’re 50 seconds into this at this stage, and we could just run the application now provided we’ve got sqlexpress installed. However if you won’t we can use SqlCompact version.

Drop back into the Package Manager Consoler and 

    Install-Package EFCodeFirst.SqlServerCompact

![](/images//blog/image.axd?picture=image_thumb_58.png)

That’s it, Q.E.D.
