---
title: "WPF Data Triggers"
date: "2009-12-04"
category: "XAML & Desktop"
tags: ["wpf", "data binding"]
---

Today I needed to control the enabled property of a button "Remove Item" on my form depending on whether there was a selected item in a Listbox.

## Here's how

```xml
<Button Content="Remove" Click="OnRemoveTranstion">
<Button.Style>
<Style>
    <Style.Triggers>
        <DataTrigger Binding ="{Binding ElementName=listDetails, Path=SelectedIndex}" Value="-1">
            <Setter Property="Button.IsEnabled" Value="false"/>
        </DataTrigger>
    </Style.Triggers>
</Style>
</Button.Style>
</Button>
```
