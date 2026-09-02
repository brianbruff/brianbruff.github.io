---
title: "Ninject Dependency Resolution in ASP MVC4 Web API"
date: "2012-07-06"
category: "Web & APIs"
tags: ["dependency injection", "web api", "asp.net mvc"]
---

Ok so you’ve been using ASP MVC3+ and using Ninject as your Dependency Injection resolver. Now you want to start leveraging the ASP.NET Web API and continue to use Ninject.

I was surprised to find it wouldn’t work out of the box! Ok I’m using the “out of the box” term a little lightly here as you have to (one approach) use Nuget to install some assemblies and generate some code.

![](/images/blog/image_thumb_191.png)

### A little extra effort

Brad Wilson has provided an implementation of the IDependencyResolver for Web API that you can use for now.

<https://gist.github.com/2417226>

What you need to do is copy that code into a file and then call it from your current NinjectWebCommon.cs by adding the highlighted line below:

![](/images/blog/image_thumb_192.png)

Brian.
