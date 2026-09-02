---
title: "It’s COM Jim, but not as we know it!"
date: "2012-02-21"
category: ".NET & C#"
tags: ["c++", "winrt"]
---

Those of you that started out in Windows C++ like me are likely familiar with COM, COM+, DCOM.  
If you stayed in unmanaged land then you’re probably still very familiar with ATL, HResults etc.   
However if on the other hand, like me, you progressed into the managed realm, then those icons above probably sum up your recollections.

For me I once considered myself pretty hot in C++ (shamefully I still do but I’m sure I’d have to spend a week hands on to really tick that box), COM collections on stl (ICollectionOnSTLImpl) were a walk in the park, multiple inheritance was a given and finding you didn’t release a COM reference was the highlight of your day. But, fast forward a few years and then you really scratch your head as to why life had to be so difficult. 

Well I’ll answer that question, performance is by far and above one of the biggest factors. With Windows8 fast approaching you may be starting to panic a little, I guess even more so if you started your coding life in a managed kingdom, but fear not, and let me dispel some common misconceptions that are solved with the C++ Component Extensions (C++/CX for short):

  * COM means HRESULTS – No, C++/CX yields exceptions from the underlying Fail HResults.
  * COM means no returns – No, C++/CX allows return values
  * COM means reference counting – Kinda, but you don’t have to worry about AddRef and Release, you use the “ref new” keyword and C++/CX does the reference counting for you (not garbage collection!)
  * COM means CoCreateInstance etc - Again C++/CX ref new takes care of this for you
  * COM means interfaces - C++/CX takes care of IUnknown/IDispatch, in fact IDispatch has been superseded.
  * COM means no inheritance - C++/CX takes care of this for you.

So will I develop my apps in C++/C#/JS+Html (come on don’t expect me to add VB.NET that battle was lost a long time ago).

Well here’s my feelings:

  * C++ maybe, depends on how much perf I need from my machines (sacrificing time to market), if I want to use an existing library, Parallel patterns library, C++ AMP etc.
  * C# yes, I like this language and it’s a RAD language (albeit I won’t have access to the full Framework)
  * JS+HTML, I’m not sold on this yet, maybe, if I want to produce for the web then I choose js+html+asp not Silverlight, would I ever have enough of a code base to reuse on WinRT??… jury is out...

