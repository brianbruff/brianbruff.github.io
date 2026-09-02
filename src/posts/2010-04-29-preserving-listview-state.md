---
title: "Preserving ListView state"
date: "2010-04-29"
category: "XAML & Desktop"
tags: ["wpf", "data binding"]
---

## XAML Serialization to the rescue.

The following sample code will persist the current Listview state to disk and restore it the next time the control is loaded.

```xml
<Window x:Class="WpfApplication1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="MainWindow" Height="350" Width="525"
        Loaded="OnLoaded"
        >
    <Grid>
        <Border x:Name="bdr">
        <ListView x:Name="lvTest" Initialized="lvInit">
            <ListView.View>
                <GridView>
                    <GridViewColumn Width="140" Header="Column 1" />
                    <GridViewColumn Width="140" Header="Column 2" />
                    <GridViewColumn Width="140" Header="Column 3" />
                </GridView>
            </ListView.View>
        </ListView>
        </Border>
    </Grid>
</Window>
```

Code behind:

```csharp
using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Markup;

namespace WpfApplication1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void lvInit(object sender, EventArgs e)
        {
            GridView gv = lvTest.View as GridView;
            gv.Columns.CollectionChanged += (s, gvE) =>
            {
                if (gvE.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Move)
                {
                    SaveState();
                }
            };

        }

        private void SaveState()
        {
            string lvXaml = XamlWriter.Save(lvTest);
            using (var s = new StreamWriter(@"c:\temp\lv.xaml"))
            {
                s.Write(lvXaml);
            }
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            ListView li = null;
            if (File.Exists(@"c:\temp\lv.xaml"))
                bdr.Child = (ListView)XamlReader.Load(File.OpenRead(@"c:\temp\lv.xaml"));
        }


    }
}
```