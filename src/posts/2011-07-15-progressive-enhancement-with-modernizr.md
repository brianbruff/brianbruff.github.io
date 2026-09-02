---
title: "Progressive Enhancement with Modernizr"
date: "2011-07-15"
category: "Front-end & JavaScript"
tags: ["html5", "asp.net mvc"]
---

If you’ve been to an HTML5 session or lived in the HTML5 world for any length of time you’ll have come across the term “Progressive Enhancement”. It’s about taking a base application that works on downstream browsers and detecting features and increasing functionality if you have certain features.

Take for example local or session storage, in older versions of browsers there was no local storage so there would be more round tripping.

So how do we detect these features? One method is a JavaScript file called Modernizr that detects feature availability (rather than using a database etc).

Syntax:

```csharp
if (Modernizr.localstorage)
{
    // browser supports local storage
}
else
{
    // browser doesn't support local storage
}
```
Check out Modernizr, it's got many detections and abstracts you from detection techniques.

You’ll get this script added to your project for free in MVC3.
