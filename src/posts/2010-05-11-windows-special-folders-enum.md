---
title: "Windows special folders enum"
date: "2010-05-11"
tags: []
---

Ever want to find out from c# where some "special" folders are located so you can use them in your desktop application?

Here's how.

[code:c#]

Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)

[/code]

See Environment.SpecialFolder enumeration for more locations.
