---
title: "Materialized Views and Microservices"
date: "2021-01-06"
tags: ["Design Patterns"]
---

In computing, a **materialized view** is a database object that contains the results of a query. For example, it may be a local copy of data located remotely, or may be a subset of the rows and/or columns of a table or join result, or may be a summary using an aggregate function.

However when dealing with microservices that have well defined domain boundaries and own their own datasets the

## Why?

When data is stored it’s often stored in a format that feels native to the format of the data itself or in a format that manages data size and of data integrity

The downside is that this can have negative effect on queries, When a query only needs a subset of the data from some entities, such as a summary of orders for several customers without all of the order details, it must extract all of the data for the relevant entities in order to obtain the required information.
