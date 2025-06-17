---
title: "Fun with expressions"
date: "2014-08-14"
tags: []
---

Anyone that’s dealt with Linq will undoubtedly have encountered expressions, this post how provide an expression in your class to consumers of this class.

## Scenario

We would like to set some properties of an entity using expressions, also we’d like to do this fluently (effectively returning this from methods).

![](/images//images/image_thumb_343.png)

Radio is just a simple POCO (plain old clr object).

![](/images//images/image_thumb_344.png)

## Expression

The code below shows the implementation of of the FluentExpression class here you can see how to interrogate an expression. The expression takes a Func which means we pass a value and return an boejc

![](/images//images/image_thumb_345.png)
