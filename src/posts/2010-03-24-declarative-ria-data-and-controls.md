---
title: "Declarative RIA Data and Controls"
date: "2010-03-24"
category: "XAML & Desktop"
tags: ["silverlight", "data binding", "kendo ui"]
---

I'm really loving this declarative approach with Silverlight and WPF... (ask me why and I can't tell you! :-)

Anyway I've just stumbled across a way of managing RiaDataContexts Declaratively  
I found it on the Telerik samples... If you've not looked at these guys' controls then check them out!!

```xml
<navigation:Page xmlns:dataFormToolkit="clr-namespace:System.Windows.Controls;assembly=System.Windows.Controls.Data.DataForm.Toolkit"  xmlns:data="clr-namespace:System.Windows.Controls;assembly=System.Windows.Controls.Data"
  x:Class="SiteDocs.Loler"
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
  xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:navigation="clr-namespace:System.Windows.Controls;assembly=System.Windows.Controls.Navigation"
  xmlns:telerik="clr-namespace:Telerik.Windows.Controls;assembly=Telerik.Windows.Controls.GridView"
  xmlns:riaControls="clr-namespace:System.Windows.Controls;assembly=System.Windows.Controls.Ria"
  xmlns:e="clr-namespace:SiteDocs.Web.Services"
  xmlns:riaData="clr-namespace:System.Windows.Data;assembly=System.Windows.Controls.Ria"
  mc:Ignorable="d" d:DesignWidth="640" d:DesignHeight="480"
  Style="{StaticResource PageStyle}"
>

  <Grid x:Name="LayoutRoot" >
    <ScrollViewer x:Name="PageScrollViewer" Style="{StaticResource PageScrollViewerStyle}" >

            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition />
                    <ColumnDefinition />
                </Grid.ColumnDefinitions>

    <Grid x:Name="gridLolerLeft" >
     <Grid.RowDefinitions>
      <RowDefinition />
      <RowDefinition Height="Auto"/>
     </Grid.RowDefinitions>

                    <riaControls:DomainDataSource x:Name="DomainDataSource1" AutoLoad="True" QueryName="GetLolers" PageSize="10">
                        <riaControls:DomainDataSource.DomainContext>
                            <e:LolerContext />
                        </riaControls:DomainDataSource.DomainContext>
                        <riaControls:DomainDataSource.FilterDescriptors>
                            <riaData:FilterDescriptorCollection LogicalOperator="Or" />
                        </riaControls:DomainDataSource.FilterDescriptors>
                    </riaControls:DomainDataSource>

                    <telerik:RadGridView x:Name="RadGridView1" ItemsSource="{Binding Data, ElementName=DomainDataSource1}"
                             Filtering="RadGridView1_Filtering" IsBusy="{Binding IsBusy, ElementName=DomainDataSource1}" />
           <telerik:RadDataPager x:Name="RadDataPager1" Grid.Row="1" Source="{Binding Data, ElementName=DomainDataSource1}" DisplayMode="FirstLastPreviousNextNumeric, Text" IsTotalItemCountFixed="True"/>


    </Grid>

                </Grid>
    </ScrollViewer>
  </Grid>

</navigation:Page>
```
