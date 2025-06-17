---
title: "Ninject Dependency Resolution in ASP MCV4 WebApi"
date: "2012-07-06"
tags: ["Dependency Injection with Ninject and ASP MVC WebApi"]
---

Ok so you’ve been using ASP MVC3+ and using Ninject as your Dependency Injection resolver. Now you want to start leveraging the Asp.WebApi and continue to use Ninject.

I was surprised to find it wouldn’t work out of the box! Ok I’m using the “out of the box” term a little lightly here as you have to (one approach) use Nuget to install some assemblies and generate some code

![](/images/./image.axd?picture=image_thumb_191.png)

###

### A little extra effort

Brad Wilson has provided an implementation of the IDependencyResolver for WebApi that you can use for now.

<https://gist.github.com/2417226>

What you need to do is copy that code into a file and then call it from your current NinjectWebCommon.cs by adding the highlighted line below:

![](/images/./image.axd?picture=image_thumb_192.png)

Brian.
