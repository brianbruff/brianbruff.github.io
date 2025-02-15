---
title: "Extension Method for Wpf Window with Froms Owner"
date: "2010-01-28"
tags: []
---

## Extension Method

[code:c#]

internal static class InteropExtensions  
{  
public static bool? ShowDialog(this System.Windows.Window win, IntPtr handle)  
{  
WindowInteropHelper helper = new WindowInteropHelper(win);  
helper.Owner = handle;  
return win.ShowDialog();  
}  
}

[/code]

## Usage

[code:c#]

var win = new WpfWindow();  
win.ShowDalog(windowsFormOwnerHandle);

[/code]
