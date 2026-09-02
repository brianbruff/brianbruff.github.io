---
title: "Windows special folders enum"
date: "2010-05-11"
category: ".NET & C#"
tags: ["enums", "filesystem"]
---

Ever want to find out from C# where some "special" folders are located so you can use them in your desktop application?

Here's how.

```text
Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)
```
See Environment.SpecialFolder enumeration for more locations.
