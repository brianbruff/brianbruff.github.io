---
title: "Anonymous delegates and Lambdas"
date: "2010-02-22"
category: ".NET & C#"
tags: ["delegates", "lambdas"]
---

Just a sample that may catch your eye as unusual...

```csharp
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
```
But here's the same code using anon delegates.

```csharp
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
```