---
title: "WebAPI OData DTO"
date: "2015-04-22"
tags: []
---

So I’ve started using OData in anger and pretty much immediately stumbled on a problem when using Data Transfer Objects (DTOs). This post explains that problem and the solution.

## Problem

The following error is encountered when trying to access the exposed entity by key:

    No routing convention was found to select an action for the OData path with template '~/entityset/key'.","type":""

![](/images//images/image_thumb_371.png)  

## Cause Code

### OData configuration

Here I show the simple entity I’m exposing

![](/images//images/image_thumb_372.png)  

## 

### Timesheet Controller

Here you can see that the underlying timesheets are just projected using Automapper to their DTO counterparts

![](/images//images/image_thumb_373.png)  

## 

### Automapper config

Here I show the automapper configuration (not that it’s makes any difference to the problem encountered)

![](/images//images/image_thumb_374.png)  

## Solution

To fix this problem I needed to set the EntityType.Name property on my OData entity type.

![](/images//images/image_thumb_375.png)  

And thereafter, success!

![](/images//images/image_thumb_376.png)  

