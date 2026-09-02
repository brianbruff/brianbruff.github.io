---
title: "Converting your VS2008 projects to support XAML designer in Expression Blend 3"
date: "2009-12-03"
category: "XAML & Desktop"
tags: ["expression blend", "visual studio", "wpf"]
---

If you've created a new WPF project in VS2008 and then you try to design your UX in Expression Blend 3 you'll find that you get XAML view only.

What is required is to add

{60dc8134-eba5-43b8-bcc9-bb4bc16c2548};{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}

to the project file.
