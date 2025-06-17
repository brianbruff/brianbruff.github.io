---
title: "Strategy pattern"
date: "2012-01-30"
tags: ["Strategy pattern in .net"]
---

So what is the strategy pattern? It’s one of the simplest object orientated design patterns, I find that it helps clean up day to day object orientated design. It’s purpose is to

- Encapsulate a family of related algorithms such that they are callable through a common interface.
- Independent evolution, algorithms can vary and evolve separately from classes using them.
- Allow a class to serve a single purpose
- Separates the calculation from the the delivery of it’s results. (separation of concerns)

How do we know when we should consider the strategy pattern?

- Look for switch statements with possible common interface
- Adding a new calculation to a class could break existing calculations (breaking the Open-Close principle, i.e. a class should be open for extension, but closed for modification.

## UML – Strategy model

![](/images/./image.axd?picture=image_thumb_147.png)

## Consequences:

- Strategies may not use class members from context
- Tests may now be written for individual concrete strategies
- Strategies may be mocked when testing the Context class
- Adding a new Strategy does not modify the Context class

## How to implement:

- Class based
- Functional programming approach with anonymous methods (Delegates and Funcs as opposed to new classes), I like this when the calculations are trivial
- Property injection
- Method strategy (passed to a method and not to the context class constructor)

## Show me the code:

### Context class

![](/images/./image.axd?picture=image_thumb_148.png)

Here we see the strategy is getting passed to the context in the constructor, this class should be closed to modification, Trip is just an empty class for my demo and it’s not actually used in the calculation sample.

### Strategy interface ![](/images/./image.axd?picture=image_thumb_149.png)

### Sample Strategy

![](/images/./image.axd?picture=image_thumb_150.png)

So, what is the strategy pattern again? It’s something you possibly do on a day to day basis and you don’t even realise it.

e.g. If you write ASP.MVC code, you quite likely are passing interfaces to you controllers for dependency injection and testability ---> Strategy pattern.

Regds,  
Brian.
