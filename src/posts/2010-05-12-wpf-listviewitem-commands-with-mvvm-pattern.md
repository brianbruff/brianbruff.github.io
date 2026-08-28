---
title: "WPF ListViewItem Commands with MVVM pattern"
date: "2010-05-12"
category: "XAML & Desktop"
tags: ["wpf", "mvvm", "data binding"]
---

If you're interested to see how to attach commands to listview items for use with an implementation of the MVVM pattern, have a look at this.

[code:c#]

TargetType="{x:Type ListViewItem}">   
Value="MouseDoubleClick" />   
Value="{Binding ElementName=uiEntityListDisplay, Path=DataContext.OpenEntityCommand}" />   
Value="{Binding}" />   
