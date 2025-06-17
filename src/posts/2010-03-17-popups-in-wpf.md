---
title: "Popups in wpf"
date: "2010-03-17"
tags: []
---

Here is come code to show a popup in wpf, i've nothing in the popup at the moment, just a gradient background and border.

[code:c#]

Width="{Binding ElementName=bdrCalendar, Path=ActualWidth, Converter={StaticResource MarginValueConverter}}"  
Height="150"  
Placement="Center"  
PopupAnimation="Scroll"  
AllowsTransparency="True"  
PlacementTarget="{Binding ElementName=bdrCalendar}"  
MouseDown="popup1_MouseDown" >

[/code]

![](/blog/image.axd?picture=2010%2f3%2fpopdown.jpg)

![](/blog/image.axd?picture=2010%2f3%2fpopup.jpg)
