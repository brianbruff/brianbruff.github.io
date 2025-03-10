---
title: "“Knock, knock.” -- “Who’s there?” -- long wait... -- “Java.”"
date: "2011-06-13"
tags: []
---

So whose faster? Well C# or Java if you are talking “RAD”, but who executes faster?

IMO, C# and Java can be just as fast or faster because the JIT compiler (JIT or just in time is a compiler that compiles your IL the first time it's executed). JIT compiler can make optimizations that a C++ compiled program cannot because it can query the machine. It can determine if the machine is Intel or AMD; Pentium 4, Core Solo, or Core Duo; or if supports SSE4, etc.

A C++ program has to be compiled beforehand usually with mixed optimizations so that it runs decently well on all machines, but is not optimized as much as it could be for a single configuration (i.e. processor, instruction set, other hardware).

Additionally certain language features allow the compiler in C# and Java to make assumptions about your code that allows it to optimize certain parts away that just aren't safe for the C/C++ compiler to do. When you have access to pointers there's a lot of optimizations that just aren't safe.

Also Java and C# can do heap allocations more efficiently than C++ because the layer of abstraction between the garbage collector and your code allows it to do all of its heap compression at once (a fairly expensive operation).

Now I can't speak for Java on this next point, but I know that C# for example will actually remove methods and method calls when it knows the body of the method is empty. And it will use this kind of logic throughout your code.

So as you can see, there are lots of reasons why certain C# or Java implementations will be faster.

Now this all said, specific optimizations can be made in C++ that will blow away anything that you could do with C#, especially in the graphics realm and anytime you're close to the hardware. Pointers do wonders here.

Of course, C# (or Java, or VB) is usually faster to produce viable and robust solution than is C++ (if only because C++ has complex semantics, and C++ standard library, while interesting and powerful, is quite poor when compared with the full scope of the standard library from .NET or Java), so usually, the difference between C++ and .NET or Java JIT won't be visible to most users, and for those binaries that are critical, well, you can still call C++ processing from C# or Java (even if this kind of native calls can be quite costly in themselves).
