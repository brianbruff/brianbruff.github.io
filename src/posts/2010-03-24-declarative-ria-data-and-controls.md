---
title: "Declarative Ria Data and Controls"
date: "2010-03-24"
tags: []
---

I'm really loving this declarative approach with silverlight and wpf... (ask me why and I can't tell you ! :-)

Anyway I've just stumbled across a way of managing RiaDataContexts Declaratively  
I found it on the Telerik samples.... If you've not looked at these guys controls then check them out!!

[code:c#]

x:Class="SiteDocs.Loler"   
xmlns="<http://schemas.microsoft.com/winfx/2006/xaml/presentation>"   
xmlns:x="<http://schemas.microsoft.com/winfx/2006/xaml>"   
xmlns:d="<http://schemas.microsoft.com/expression/blend/2008>"   
xmlns:mc="<http://schemas.openxmlformats.org/markup-compatibility/2006>"  
xmlns:navigation="clr-namespace:System.Windows.Controls;assembly=System.Windows.Controls.Navigation"  
xmlns:telerik="clr-namespace:Telerik.Windows.Controls;assembly=Telerik.Windows.Controls.GridView"  
xmlns:riaControls="clr-namespace:System.Windows.Controls;assembly=System.Windows.Controls.Ria"  
xmlns:e="clr-namespace:SiteDocs.Web.Services"  
xmlns:riaData="clr-namespace:System.Windows.Data;assembly=System.Windows.Controls.Ria"  
mc:Ignorable="d" d:DesignWidth="640" d:DesignHeight="480"   
Style="{StaticResource PageStyle}"  
>

Filtering="RadGridView1_Filtering" IsBusy="{Binding IsBusy, ElementName=DomainDataSource1}" />  

[/code]
