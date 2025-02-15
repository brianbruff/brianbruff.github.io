---
title: "EF 4.1 Code First Database re-create"
date: "2011-08-28"
tags: ["entity framework", "EF4.1", "ASP.MVC3"]
---

If you’ve upgraded to Entity Framework 4.1 you may have noticed the following no longer compiles. (the line of code that causes the database to drop and recreate on schema change).

![](/images/./image.axd?picture=image_thumb_86.png)

## Solution

    DbDatabase.SetInitializer(new DropCreateDatabaseIfModelChanges());

![](/images/./image.axd?picture=image_thumb_87.png)
