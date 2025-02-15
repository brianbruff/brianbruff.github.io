---
title: "Anonymous delegates and event execution"
date: "2010-02-02"
tags: ["event anonymous delegates"]
---

A nice little trick to save you always checking for null when firing custom events  
Initialize to anonymous delegate.  
Ok.. we've an extra call in the invocation list so use judiciously

[code:c#]

public event CompleteTaskExecutionHandler CompleteExecution = delegate { };

//or a sample using Lambdas

public event PropertyChangedEventHandler PropertyChanged = (s,p) => { };

private void Fire()  
{  
this.CompleteExecution(...);  
}

[/code]
