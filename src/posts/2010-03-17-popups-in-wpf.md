---
title: "Popups in WPF"
date: "2010-03-17"
category: "XAML & Desktop"
tags: ["wpf", "data binding"]
---

Here is some code to show a popup in WPF, I've nothing in the popup at the moment, just a gradient background and border.

```xml
<Popup Name="popup1"
   Width="{Binding ElementName=bdrCalendar, Path=ActualWidth, Converter={StaticResource MarginValueConverter}}"
   Height="150"
   Placement="Center"
   PopupAnimation="Scroll"
   AllowsTransparency="True"
   PlacementTarget="{Binding ElementName=bdrCalendar}"
   MouseDown="popup1_MouseDown" >
 <ctrls:PopupContent />
</Popup>
```
![](/images/blog/2010/3/popdown.jpg)

![](/images/blog/2010/3/popup.jpg)
