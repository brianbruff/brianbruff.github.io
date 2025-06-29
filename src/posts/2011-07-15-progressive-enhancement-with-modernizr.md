---
title: "Progressive Enhancement with Modernizr"
date: "2011-07-15"
tags: []
---

If you’ve been to a HTML5 session or lived in the html5 world for any length of time you’ll have come across the term “Progressive Enhancement”. It’s about taking a base application that works on downstream browsers and detecting features and increasing functionality if you have certain features.

Take example local or session storage, in older versions of browsers there was no local storage so there would be more round tripping.

So how do we detect these features? One method is a javascript file called Modernizr that detects feature availability (rather than using a database etc).

Syntax:

       1:  if (Modernizr.localstorage) 

       2:  {    

       3:      // browser supports local storage

       4:  }

       5:  else 

       6:  {    

       7:      // browser doesn't support local storage

       8:  }

       9:   

Check out modernizer it's got many detection and abstracts you from detection techniques.

You’ll get this script added to your project for free in MVC3.
