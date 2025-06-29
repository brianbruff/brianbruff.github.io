---
title: "C# on the iPhone"
date: "2010-02-24"
tags: []
---

Recently I've noticed that the country has gone iPhone mad and I'm starting to buy into it myself... my blackberry days may be numbered as the only distinct advantage I see is that bandwidth is not used retrieving emails... but nowadays bandwidth is not so much as issue,, e.g. you get 2gb a month on a vodafone contract ![Cool](/blog/editors/tiny_mce3/plugins/emotions/img/smiley-cool.gif)

I've had a bit of a play around with Objective-C, interesting but .NET is my forte so I was delighted to see that it was possible (kinda0 to write code in c# for the iPhone platform.

The success of .NET platform from MS on multiple systems came when the [Mono](http://www.mono-project.com/Main_Page) project became real. This open-source framework (cross-platform) brought the speed of C# development to Linux and OSX platforms. And now it will take us further.

As we all know, Apple has a highly strict inclusion policy for third-party runtime environments, which makes impossible to distribute apps that use this technology, like .NET and Java. So how can I be talking about .NET on the iPhone?

Because of a process called Static Compilation. Mono had already created a way to generate native code from common intermediate language (CIL) produced by .NET in native code in the past ([AOT](http://www.mono-project.com/AOT) Ahead-OfTime compilation), with the intention of helping to reduce the speed of the initialization process and increase the process sharing among multiple processes. However, to keep the portability among different machines, a small piece of code was still in JIT (just-in-time) compilation – this method is the key to virtual machine systems that generate intermediate code which is converted to native code during execution.

So this process generates the final result in native code BEFORE the executing time, and this decreases also the size of the final app (since framework must go with the app), which does not need to load the codes to execute JIT and interpret CIL – even though it still adds approximately 6Mb from mono framework itself in the app’s final size.

There are also a few other tricks and Mono features that developers can use to reduce the size of Mono executables and assemblies for deployment in mobile environments. You can use the [Mono linker](http://www.mono-project.com/Linker) to shrink the library size, you can omit the JIT and code generation engines from the executables, and you can strip out CIL instructions from the assemblies.

Static compilation makes it possible to build Apple-approved iPhone applications with Mono, but it comes with some limitations. Generics and dynamically-generated code are currently not supported when AOT compilation is used.

There are a lot of hoops to jump through right now to set up iPhone cross-compilation for Mono, but de Icaza (Novell's lead mono developer) says that developers who want to start now can use [Unity](http://unity3d.com), a third-party commercial programming framework for 3D game development that is built on Mono. Unity supports several platforms, including the iPhone and the Wii, and comes with its own built-in Mono cross-compilation environment.

Nowadays, thank to Unity 3D, there are over 40 apps (mostly games) on App Store that were written in C# and that carry mono framework inside. Wouldn’t it be great if Apple included that in the firmware? Imagine that if we have these 40 apps installed, it’s 40 times the same framework consuming space and no need for that. But that’s asking too much, right? ![:\)](http://labs.maya.im/en/wp-includes/images/smilies/icon_smile.gif)
