---
title: "Key modifiers"
date: "2009-12-22"
tags: []
---

Recently I used PInvoke to check if the SHIFT key was pressed while i was doing a drag operation......

what I should have done then and have done now is

[code:c#]

if((Keyboard.Modifiers & ModifierKeys.Shift) != ModifierKeys.None)  
Trace.WriteLine("Shift is pressed");

[/code]
