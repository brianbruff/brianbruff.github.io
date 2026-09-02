---
title: "Checked GroupBox"
date: "2010-02-17"
category: "XAML & Desktop"
tags: ["wpf", "data binding"]
---

Here's a bit of code that I'm using in an application to give this result (Checked GroupBox).

![](/images/blog/2010/2/Wizard1.jpg)

```xml
<GroupBox Grid.Row="3" Grid.Column="1" BorderBrush="Black" Margin="0,0,116,0">
<GroupBox.Header>
    <CheckBox x:Name="cbValidity" IsChecked="{Binding Path=HasValidity}" >Validity</CheckBox>
</GroupBox.Header>

<StackPanel>
    <StackPanel.Style>
        <Style>
            <Style.Triggers>
                <DataTrigger Binding ="{Binding ElementName=cbValidity, Path=IsChecked}" Value="false">
                    <Setter Property="Button.IsEnabled" Value="false"/>
                </DataTrigger>
            </Style.Triggers>
        </Style>
    </StackPanel.Style>
    <TextBlock Margin="10,10,0,0" Text="This job is valid from" />
    <wfi:WindowsFormsHost x:Name="propertiesCtrlHost" SnapsToDevicePixels="True" Background="Transparent" Height="22" Margin="10" Width="200" HorizontalAlignment="Left">
        <wf:DateTimePicker x:Name="dtpFrom" Format="Custom" CustomFormat="dd MMMM yyyy  HH:mm" ValueChanged="dtpFrom_ValueChanged" />
    </wfi:WindowsFormsHost>

    <TextBlock Margin="10,10,0,0" Text="This job is valid to" />
    <wfi:WindowsFormsHost SnapsToDevicePixels="True" Background="Transparent" Height="22" Margin="10" Width="200" HorizontalAlignment="Left">
        <wf:DateTimePicker x:Name="dtpTo" Format="Custom" CustomFormat="dd MMMM yyyy  HH:mm" ValueChanged="dtpTo_ValueChanged" />
    </wfi:WindowsFormsHost>
</StackPanel>
</GroupBox>
```
