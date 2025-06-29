---
title: "SQL Server Check Constraints"
date: "2010-12-20"
tags: ["sqlserver"]
---

Here's an easy one to get caught out on.

Say you remove a constraint on a table to do some maintainance ect.

e.g.

ALTER TABLE BANDWIDTH NOCHECK CONSTRAINT FKUserLimits;

When you wish to bring the constraint back on stream you may be surprised to find the following does not quite work...

ALTER TABLE BANDWIDTH CHECK CONSTRAINT FKUserLimits;

You may be be able to see this in the execution plan on SSMS if the constraint was used in query optimization.

but you can check for sure by executing the following

select name, is_not_trusted FROM sys.foreign_keys where name = 'FKUserLimits';

you'll find that is_not_trusted is 1, indicating that the constraint is not trusted, this is because someone could have modified the table while the constaint was turned off, the sql to reenable the constraint needs to be told to check it while doing so..

here's how

ALTER TABLE BANDWIDTH   
WITH CHECK  
CHECK CONSTRAINT FKUserLimits;

This option tells SQL server to verify that all rows in the table comply with the constraint prior to turning it back on. If any rows do not comply with the constraint, an error message is returned and the alter table statement is rolled back.
