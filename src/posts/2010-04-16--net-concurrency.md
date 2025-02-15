---
title: ".NET Concurrency"
date: "2010-04-16"
tags: []
---

# Optimistic Concurrency

In a multiuser environment, there are two models for updating data in a database: optimistic concurrency, and pessimistic concurrency. The **DataSet** object is designed to encourage the use of optimistic concurrency for long-running activities such as when you are remoting data and when users are interacting with data.

Pessimistic concurrency involves locking rows at the data source to prevent users from modifying data in a way that affects other users. In a pessimistic model, when a user performs an action that causes a lock to be applied, other users cannot perform actions that would conflict with the lock until the lock owner releases it. This model is primarily used in environments where there is heavy contention for data, where the cost of protecting data with locks is less than the cost of rolling back transactions if concurrency conflicts occur.

Therefore, in a pessimistic currency model, a user who reads a row with the intention of changing it establishes a lock. Until the user has finished the update and released the lock, no one else can change that row. For this reason, pessimistic concurrency is best implemented when lock times will be short, as in programmatic processing of records. Pessimistic concurrency is not a scalable option when users are interacting with data, causing records to be locked for relatively large periods of time.

By contrast, users who use optimistic concurrency do not lock a row when reading it. When a user wants to update a row, the application must determine whether another user has changed the row since it was read. Optimistic concurrency is generally used in environments with a low contention for data. This improves performance as no locking of records is required, and locking of records requires additional server resources. Also, in order to maintain record locks, a persistent connection to the database server is required. Because this is not the case in an optimistic concurrency model, connections to the server are free to serve a larger number of clients in less time.

In an optimistic concurrency model, a violation is considered to have occurred if, after a user receives a value from the database, another user modifies the value before the first user has attempted to modify it.
