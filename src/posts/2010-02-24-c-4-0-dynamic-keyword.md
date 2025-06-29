---
title: "C# 4.0 Dynamic Keyword"
date: "2010-02-24"
tags: []
---

"object x" is a shorthand for "System.Object x".   
This declares the variable x to have the type System.Object, this is strongly typed.  
And since C# provides autoboxing, you can assign anything you want to this variable.

"var x = E" declares a variable x to be of the type of the expression E.   
The E is required, not optional. This is a strongly typed declaration, and you can only assign values whose type is typeof(E) to it.

"dynamic x" declares the variable x to have dynamic semantics.   
This means that the C# compiler will generate code that will allow dynamic invocations on x.  
The actual meaning of "x.M" is deferred until runtime and will depend on the semantics of the IDynamicObject implementation
