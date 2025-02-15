---
title: "Anonymous delegates and Lambdas"
date: "2010-02-22"
tags: ["lambda anonymous"]
---

Just a sample that may catch you eye as unusual..

[code:c#]

class WorkItem  
{  
public WaitCallback Callback;  
public object State;  
public ExecutionContext Context;

private static ContextCallback _contextCallback = s =>  
{  
var item = s as WorkItem;  
item.Callback(item.State);  
};

public void Execute()  
{  
if (Context != null)  
ExecutionContext.Run(Context, _contextCallback, this);  
else  
Callback(State);

}  
}

[/code]

but here's the same code using anon delegates

[code:c#]

class WorkItem  
{  
public WaitCallback Callback;  
public object State;  
public ExecutionContext Context;

private static ContextCallback _contextCallback = delegate(object s)  
{  
var item = s as WorkItem;  
item.Callback(item.State);  
};

public void Execute()  
{  
if (Context != null)  
ExecutionContext.Run(Context, _contextCallback, this);  
else  
Callback(State);

}  
}

[/code]
