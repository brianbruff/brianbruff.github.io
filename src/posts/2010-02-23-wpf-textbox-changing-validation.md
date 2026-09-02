---
title: "WPF Textbox changing validation"
date: "2010-02-23"
category: "XAML & Desktop"
tags: ["wpf", "data binding", "validation"]
---

Here's how to ensure that databinding happens when the value of a textbox changes. (as opposed to losing focus for example)

```xml
<TextBox Text="{Binding Interval, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"  />
```
