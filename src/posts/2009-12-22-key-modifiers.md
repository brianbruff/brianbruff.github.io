---
title: "Key modifiers"
date: "2009-12-22"
category: "XAML & Desktop"
tags: ["wpf", "pinvoke"]
---

Recently I used PInvoke to check if the SHIFT key was pressed while I was doing a drag operation...

What I should have done then and have done now is

```csharp
if((Keyboard.Modifiers & ModifierKeys.Shift) != ModifierKeys.None)
  Trace.WriteLine("Shift is pressed");
```