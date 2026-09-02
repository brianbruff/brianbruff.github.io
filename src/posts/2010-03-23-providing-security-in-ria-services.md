---
title: "Providing Security in RIA services"
date: "2010-03-23"
category: "XAML & Desktop"
tags: ["silverlight", "security", "authentication"]
---

If you wish to prevent clients accessing your data:

```csharp
[RequiresAuthentication]
[EnableClientAccess()]
public class LolerService : LinqToSqlDomainService<LolerModelDataContext>
```