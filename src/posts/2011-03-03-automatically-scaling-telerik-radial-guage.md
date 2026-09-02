---
title: "Automatically Scaling Telerik Radial Gauge"
date: "2011-03-03"
category: "XAML & Desktop"
tags: ["wpf", "kendo ui", "data binding"]
---

Took a little time out tonight from the web application I’m working on as I want to create a little dashboard prototype that has to be desktop based as a result of where it will be used.

I’ve got a server JBPM (Java business process management... pretty similar to WF4) component that is writing log files, these log files are divided into subdirectories for each JBPM workflow that gets executed.

![](/images/blog/image_thumb_31.png)

The idea is to provide a quick view for the counts of server logs at a glance with a gauge (I'll be putting this gauge into a template for use in a listbox, but as a first step I’ve just displayed the details of the files in the first workflow folder).

Here’s what it looks like.

![](/images/blog/image_thumb_32.png)

The text is bound to the directory name, the yellow/orange radial bar is the count of all the log files in all subdirectories, and the needle is the count of files in the EchoLoader directory.

Here’s the XAML.

```xml
<Window x:Class="Datagenic__Monitor.MainWindow"
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation"
                Title="MainWindow" Height="350" Width="525">
    <Window.Background>
        <ImageBrush ImageSource="/Datagenic-%20Monitor;component/Images/background.png" />
    </Window.Background>
    <Grid>
        <telerik:RadialGauge>
            <telerik:RadialScale x:Name="radialScale" Min="0" Max="{Binding Path=MaxScale}" MajorTicks="10"
                            MiddleTicks="1" MinorTicks="3">

                <telerik:RadialScale.MajorTick>
                    <telerik:MajorTickProperties />
                </telerik:RadialScale.MajorTick>
                <telerik:RadialScale.MiddleTick>
                    <telerik:MiddleTickProperties Length="0.07" />
                </telerik:RadialScale.MiddleTick>
                <telerik:RadialScale.MinorTick>
                    <telerik:MinorTickProperties Length="0.05" />
                </telerik:RadialScale.MinorTick>

                <telerik:RadialScale.Label>
                    <telerik:LabelProperties FontSize="10" />
                </telerik:RadialScale.Label>

                <telerik:IndicatorList>
                    <telerik:RadialBar x:Name="gauge1_radialBar" IsAnimated="True"
                               Value="{Binding Path=TotalLogCount}" />

                    <telerik:Needle x:Name="gauge1_needle" IsAnimated="true"
                                Value="{Binding Path=WFExecutions[0].LogCount}" />
                </telerik:IndicatorList>
            </telerik:RadialScale>
        </telerik:RadialGauge>
        <Grid>
            <Grid.RowDefinitions>
                <RowDefinition Height="0.60*" />
                <RowDefinition Height="0.40*" />
            </Grid.RowDefinitions>

            <TextBlock Grid.Row="1" VerticalAlignment="Top" HorizontalAlignment="Center"
                            Foreground="GhostWhite" FontFamily="CourierNew"
                                   Text="{Binding Path=WFExecutions[0].FolderName}" />
        </Grid>

    </Grid>
</Window>
```

Here’s the code.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;

namespace Datagenic__Monitor
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            this.DataContext = _wfExecutions;
        }

        private WorkflowsExecutions _wfExecutions = new WorkflowsExecutions();
    }


    class WorkflowsExecutions :NotifyPropertyChangedBase
    {
        public WorkflowsExecutions()
        {
            this.WFExecutions = new List<WorkflowExecutions>();

            // Get the individual folders that corresponds to the logs
            var executionFolders = System.IO.Directory.EnumerateDirectories(_executionFolder);
            if (executionFolders != null)
                executionFolders.ToList().ForEach(f =>
                    {
                        var we = new WorkflowExecutions(f);
                        we.PropertyChanged += ItemPropChanged;
                        this.WFExecutions.Add(we);
                    });
        }

        void ItemPropChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "LogCount")
            {
                FirePropertyChanged("TotalLogCount");
                if (TotalLogCount > MaxScale)
                    FirePropertyChanged("MaxScale");
            }
        }

        public int TotalLogCount
        {
            get
            {
                return this.WFExecutions.Sum(we => we.LogCount);
            }
            set { }
        }

        public int MaxScale
        {
            get
            {
                int max = (int)(this.TotalLogCount * 1.5);
                max = max + (10 - max % 10);
                return Math.Max(100, max);
            }
            set { }
        }

        public List<WorkflowExecutions> WFExecutions { get; set; }


        private string _executionFolder = Properties.Settings.Default.ExecutionLogFolder;



        //event PropertyChangedEventHandler PropertyChanged = (s, e) => { };
    }

    class WorkflowExecutions : NotifyPropertyChangedBase
    {
        public WorkflowExecutions(string folder)
        {
            this.FolderName = System.IO.Path.GetFileName(folder);
            _watcher = new FileSystemWatcher(folder);
            _watcher.Deleted += (s, e) => Update();
            _watcher.Created += (s, e) => Update();
            _watcher.EnableRaisingEvents = true;
            Update();
        }


        public string FolderName { get; set; }


        public int LogCount
        {
            get { return _logCount; }
            set
            {
                _logCount = value;
                base.FirePropertyChanged("LogCount");
            }
        }

        private void Update()
        {
            var files = System.IO.Directory.EnumerateFiles(_watcher.Path);
            this.LogCount = files.Count();
        }

        private int _logCount = 0;
        private FileSystemWatcher _watcher;

    }
}
```
The interesting part is the auto scaling, if the TotalLogFile count passes the max scale level the view will get the property changed notification and update its bindings. (Note: I half expect the Telerik gauge to auto scale, if I spend a few minutes to figure out how…)
