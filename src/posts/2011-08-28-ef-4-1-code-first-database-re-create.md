---
title: "EF 4.1 Code First Database re-create"
date: "2011-08-28"
category: "Data & Persistence"
tags: ["entity framework", "asp.net mvc"]
---

If you’ve upgraded to Entity Framework 4.1 you may have noticed the following no longer compiles. (the line of code that causes the database to drop and recreate on schema change).

![](/images/blog/image_thumb_86.png)

## Solution

```csharp
DbDatabase.SetInitializer(new DropCreateDatabaseIfModelChanges<TCF.Models.TCFContext>());
```
![](/images/blog/image_thumb_87.png)
