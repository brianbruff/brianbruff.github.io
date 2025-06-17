---
title: "Automatically Scaling Telerik Radial Guage"
date: "2011-03-03"
tags: []
---

Took a little time out tonight from the web application I’m working on as I want to create a little dashboard prototype that has to be desktop based as a result of where it will be used.

I’ve got a server JBPM (Java business process management.. pretty similar to WF4) component that is writing log files, these log files are divided into subdirectories for each JBPM workflow that gets executed.

![](/images//blog/image.axd?picture=image_thumb_31.png)

The idea is to provide a quick view for the counts of server logs at a glance with a gauge, (i'll be putting this gauge into a template for use in a listbox, but as a first step I’ve just displayed the details of the files in the first workflow folder.

Here’s what it looks like

![](/images//blog/image.axd?picture=image_thumb_32.png)

The text is bound to the directory name, the yellow/orange radial bar is the count of all the log files in all subdirectories, and the needle is the count of files in the EchoLoader directory.

Here’s the xaml

       1:  "Datagenic__Monitor.MainWindow"

       2:                  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"

       3:                  xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"

       4:                  xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation"

       5:                  Title="MainWindow" Height="350" Width="525">

       6:

       7:          "/Datagenic-%20Monitor;component/Images/background.png" />

       8:

       9:

      10:

      11:              "radialScale" Min="0" Max="{Binding Path=MaxScale}" MajorTicks="10"

      12:                              MiddleTicks="1" MinorTicks="3">

      13:   

      14:

      15:

      16:

      17:

      18:                      "0.07" />

      19:

      20:

      21:                      "0.05" />

      22:

      23:   

      24:

      25:                      "10" />

      26:

      27:   

      28:

      29:                      "gauge1_radialBar" IsAnimated="True"
                                   Value="{Binding Path=TotalLogCount}" />

      30:   

      31:                      "gauge1_needle" IsAnimated="true"
                                    Value="{Binding Path=WFExecutions[0].LogCount}" />

      32:

      33:

      34:

      35:

      36:

      37:                  "0.60*" />

      38:                  "0.40*" />

      39:

      40:   

      41:              "1" VerticalAlignment="Top" HorizontalAlignment="Center"

      42:                              Foreground="GhostWhite" FontFamily="CourierNew"
                                       Text="{Binding Path=WFExecutions[0].FolderName}" />

      43:

      44:   

      45:

      46:

Here’s the code

       1:  using System;

       2:  using System.Collections.Generic;

       3:  using System.Linq;

       4:  using System.Text;

       5:  using System.Windows;

       6:  using System.Windows.Controls;

       7:  using System.Windows.Data;

       8:  using System.Windows.Documents;

       9:  using System.Windows.Input;

      10:  using System.Windows.Media;

      11:  using System.Windows.Media.Imaging;

      12:  using System.Windows.Navigation;

      13:  using System.Windows.Shapes;

      14:  using System.Collections.ObjectModel;

      15:  using System.ComponentModel;

      16:  using System.IO;

      17:   

      18:  namespace Datagenic__Monitor

      19:  {

      20:      ///

      21:      /// Interaction logic for MainWindow.xaml

      22:      ///

      23:      public partial class MainWindow : Window

      24:      {

      25:          public MainWindow()

      26:          {

      27:              InitializeComponent();

      28:   

      29:              this.DataContext = _wfExecutions;

      30:          }

      31:   

      32:          private WorkflowsExecutions _wfExecutions = new WorkflowsExecutions();

      33:      }

      34:   

      35:   

      36:      class WorkflowsExecutions :NotifyPropertyChangedBase

      37:      {

      38:          public WorkflowsExecutions()

      39:          {

      40:              this.WFExecutions = new List();

      41:   

      42:              // Get the individual folders that corresponds to the logs

      43:              var executionFolders = System.IO.Directory.EnumerateDirectories(_executionFolder);

      44:              if (executionFolders != null)

      45:                  executionFolders.ToList().ForEach(f =>

      46:                      {

      47:                          var we = new WorkflowExecutions(f);

      48:                          we.PropertyChanged += ItemPropChanged;

      49:                          this.WFExecutions.Add(we);

      50:                      });

      51:          }

      52:   

      53:          void ItemPropChanged(object sender, PropertyChangedEventArgs e)

      54:          {

      55:              if (e.PropertyName == "LogCount")

      56:              {

      57:                  FirePropertyChanged("TotalLogCount");

      58:                  if (TotalLogCount > MaxScale)

      59:                      FirePropertyChanged("MaxScale");

      60:              }

      61:          }

      62:   

      63:          public int TotalLogCount

      64:          {

      65:              get

      66:              {

      67:                  return this.WFExecutions.Sum(we => we.LogCount);

      68:              }

      69:              set { }

      70:          }

      71:   

      72:          public int MaxScale

      73:          {

      74:              get

      75:              {

      76:                  int max = (int)(this.TotalLogCount * 1.5);

      77:                  max = max + (10 - max % 10);

      78:                  return Math.Max(100, max);

      79:              }

      80:              set { }

      81:          }

      82:   

      83:          public List WFExecutions { get; set; }

      84:

      85:   

      86:          private string _executionFolder = Properties.Settings.Default.ExecutionLogFolder;

      87:   

      88:   

      89:   

      90:          //event PropertyChangedEventHandler PropertyChanged = (s, e) => { };

      91:      }

      92:   

      93:      class WorkflowExecutions : NotifyPropertyChangedBase

      94:      {

      95:          public WorkflowExecutions(string folder)

      96:          {

      97:              this.FolderName = System.IO.Path.GetFileName(folder);

      98:              _watcher = new FileSystemWatcher(folder);

      99:              _watcher.Deleted += (s, e) => Update();

     100:              _watcher.Created += (s, e) => Update();

     101:              _watcher.EnableRaisingEvents = true;

     102:              Update();

     103:          }

     104:

     105:   

     106:          public string FolderName { get; set; }

     107:

     108:   

     109:          public int LogCount

     110:          {

     111:              get { return _logCount; }

     112:              set

     113:              {

     114:                  _logCount = value;

     115:                  base.FirePropertyChanged("LogCount");

     116:              }

     117:          }

     118:   

     119:          private void Update()

     120:          {

     121:              var files = System.IO.Directory.EnumerateFiles(_watcher.Path);

     122:              this.LogCount = files.Count();

     123:          }

     124:   

     125:          private int _logCount = 0;

     126:          private FileSystemWatcher _watcher;

     127:   

     128:      }

     129:  }

The interesting part is the auto scaling, if the TotalLogFile count passes the max scale level the view will get the property changed notification and update it bindings. (Note: I half expect telerik gauge to auto scale, if i spend a few minutes to figure out how… ![Shifty](/blog/image.axd?picture=wlEmoticon-shifty.png) )
