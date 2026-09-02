---
title: "Extension Method for WPF Window with Forms Owner"
date: "2010-01-28"
category: "XAML & Desktop"
tags: ["wpf", "extension methods"]
---

## Extension Method

```csharp
internal static class InteropExtensions
{
    public static bool? ShowDialog(this System.Windows.Window win, IntPtr handle)
    {
        WindowInteropHelper helper = new WindowInteropHelper(win);
        helper.Owner = handle;
        return win.ShowDialog();
    }
}
```
## Usage

```csharp
var win = new WpfWindow();
win.ShowDalog(windowsFormOwnerHandle);
```