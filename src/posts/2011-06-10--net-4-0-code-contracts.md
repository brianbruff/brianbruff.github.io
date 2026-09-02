---
title: ".NET 4.0 Code Contracts"
date: "2011-06-10"
category: ".NET & C#"
tags: ["code contracts", "design patterns"]
---

Yesterday I read an interesting [article](http://msdn.microsoft.com/en-us/magazine/gg983479.aspx) on a flight home from Amsterdam and thought I would share it with you.

One of the generally accepted approaches of writing functions is to validate your input arguments before using them, If-Then-Throw pattern.

Now .NET 4.0 supports the Design by Contract approach to software design with .NET 4 code contracts. Let’s dive straight in (as always).

```csharp
using System.Diagnostics.Contracts;

public class Calculator
{
    public Int32 Sum(Int32 x, Int32 y)
    {
        Contract.Requires<ArgumentOutOfRangeException>(x >= 0 && y >= 0);
        Contract.Ensures(Contract.Result<Int32>() >= 0);

        if (x == y)
        return 2 * x;
        return x + y;
    }

    public Int32 Divide(Int32 x, Int32 y)
    {
        Contract.Requires<ArgumentOutOfRangeException>(x >= 0 && y >= 0);
        Contract.Requires<ArgumentOutOfRangeException>(y > 0);
        Contract.Ensures(Contract.Result<Int32>() >= 0);
        return x / y;
    }
}
```
Here we see just how powerful contracts can be, have a look at Dino Esposito’s article above for more information.
