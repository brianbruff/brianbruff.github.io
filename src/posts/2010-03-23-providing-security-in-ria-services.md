---
title: "Providing Security in RIA services"
date: "2010-03-23"
tags: []
---

If you wish to prevent clients accessing your data

[code:c#]

[RequiresAuthentication]  
[EnableClientAccess()]  
public class LolerService : LinqToSqlDomainService

[/code]
