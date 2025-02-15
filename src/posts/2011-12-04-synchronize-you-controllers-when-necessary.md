---
title: "Synchronize you controllers when necessary"
date: "2011-12-04"
tags: ["Asyncronous MVC"]
---

Earlier today I happened to lend a hand to a friend of mine that was experiencing a race condition in an ASP.MVC application, like a rag to a bull is multithreading to me.

Here’s the scenario; my friend was calling two web services using methods like BeginXXX/EndXXX. Because her website was IO bound she was correctly using an AsyncController.

She called method to increment the outstanding operations by 2, then proceeded to call

> 
>     service1.BeginGetValuations(v, ar => {
>     
>     
>         AsyncManager.Parameters["valuations"] = service1.EndGetValuations();
>     
>     
>         AsyncManager.OutstandingOperations.Decrement();
>     
>     
>     }, null);
>     
>     
>         
>     
>     
>     service2.BeginGetValuations(v, ar => {
>     
>     
>         AsyncManager.Parameters["valuationsActual"] = service2.EndGetValuations();
>     
>     
>         AsyncManager.OutstandingOperations.Decrement();
>     
>     
>     },null);

Looked pretty much ok, except once in a while when load tested the valuationsActual parameter was null.   
So what could be the cause… Well basically it turned out that there was a race condition accessing the dictionary from two threads.

### The solution:

synchronize access to the Parameters, i first thought of doing this with a plain old lock but I was worried about other access on the parameters from the framework itself so I had a quick read of the documentation and turns out that the AsyncManager has a sync method.

    service1.BeginGetValuations(v, ar => {

        AsyncManager.Sync(() => {

            AsyncManager.Parameters["valuations"] = service1.EndGetValuations();

            AsyncManager.OutstandingOperations.Decrement();

        });

    }, null);

Do the same for service2.
