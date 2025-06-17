---
title: "Idiot’s guide to Angular service vs factory"
date: "2014-04-11"
tags: ["Angular.js service factories"]
---

You won’t believe the amount on questions I’ve come across regarding the confusion between angular services factories and providers. This blog post attempts to help clarify same and get you started.

## Which should I use?

_Factory_ \* if you don’t know this this is a good place to start.

## Which is most powerful?

_Providers_

## What’s the difference?

I’m not going to cover providers here so lets see the difference between _services_ and _factories_.

### The rhetoric

_Service_ gets passed a function that’s considered to be a constructor, so you get back a new-ed constructor.  
_Factory_ gets passed a function which it invokes and returns the result.  
A service is often used when you have 3rd party constructor function and want to use this.

### Example1 – Same end result both ways

#### Service

First lets show the view in all it’s glory, it’s quite simple just will display whatever x is.

![](/images/./image.axd?picture=image_thumb_301.png)

[](./image.axd?picture=image_300.png)  
Then the angular code

![](/images/./image.axd?picture=image_thumb_302.png)

You can see that we don’t return anything! so think of this as a constructor function, so effectively angular will give us a new TestService and we can call the doSomething method on it, the output looks like this

![](/images/./image.axd?picture=image_thumb_303.png)

[](./image.axd?picture=image_303.png)

#### Factory

Now let’s look at the same thing as a factory

![](/images/./image.axd?picture=image_thumb_304.png)

What’s the difference? Well in this instance we are returning something! Angular will call new on the returned object and return it.

#### Ok I get it but

**Show me a reason to prefer one over the other?** Well lets say we want to pass some information to the service or factory, well given we have no control over angular creating our service we cannot pass any additional information! it just creates the function.

Factories on the other hand we get to return what we want! So we can return a function! Lets look at some code to make this easier to see

![](/images/./image.axd?picture=image_thumb_305.png)

So now if we don’t change our controller we have a problem, because angular has just created **f** for us! Let’s see this in a debugger, we can clearly see that TestService is not an object but rather a function.

![](/images/./image.axd?picture=image_thumb_306.png)

Now we need to modify our code to work, let’s do that.

| ![](/images/./image.axd?picture=image_thumb_307.png) | [](./image.axd?picture=image_308.png) |
| ---------------------------------------------------- | ------------------------------------- |

![](/images/./image.axd?picture=image_thumb_308.png)

So hopefully that’s helped you a little understand the difference.

### Example 2

I’m working on a project at the moment and I’ve just created a backend REST webservice to manage user properties

![](/images/./image.axd?picture=image_thumb_309.png)

as you can see I've got the basic REST HTTP verbs, GET,POST,PUT,DELETE, it’s done in Java, but could just as well be in .NET, node, php etc, it doesn’t matter, the basic premise of REST is that it just used what HTTP already gives us.

Now I want to be able to use this information in JavaScript, Angular itself exposes a $resource exactly for this scenario (read the docs there’s one or two simple steps needed to use it).

![](/images/./image.axd?picture=image_thumb_310.png)

The important thing to notice is that we are returning something from our function, and we are passing parameters, therefore we cannot use a service in this scenario.

I hope this has clarified this situation for you, if so please drop me a line and let me know and I might cover providers also.  
_(comments are disabled until i get a better recapcha for all this spam I get when enabled)._
