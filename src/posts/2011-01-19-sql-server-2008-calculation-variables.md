---
title: "SQL Server 2008 Calculation Variables"
date: "2011-01-19"
tags: []
---

SqlServer 2008 has a short hand/compact way of assigning calculation variables.

e.g

_Sql2005_

DECLARE @val INT   
set @val = 1;   
set @val = @val + 1;

_Sql2008_

DECLARE @val INT   
set @val = 1;   
set @val += 1;

Same applies to other operators, *=, –=, /=
