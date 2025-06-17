---
title: "WaitCursor and MVVM"
date: "2010-06-03"
tags: ["silverlight wpf cursor databinding valueconverter"]
---

Ever wondered how to display the correct cursor in an application that is databinded to async methods?

Pretty easy solution, just databind the cursor on the window itself.

## Here's how:

- Add an IsBusy property on the DataContext (and implement INotifyPropertyChanged on it)
- Add the following to your window xaml

[code:c#]

xmlns:valueConverters="clr-namespace:XXX.ValueConverters"  
Cursor="{Binding IsBusy, Converter={valueConverters:CursorExtensionConverter}}"

[/code]

- Create the following ValueConverter

[code:c#]

public class CursorExtensionConverter : MarkupExtension, IValueConverter  
{  
public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)  
{  
if (value != null && ((bool)value))  
return Cursors.Wait;  
else  
return Cursors.Arrow;  
}

public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)  
{  
throw new NotImplementedException();  
}

public override object ProvideValue(IServiceProvider serviceProvider)  
{  
return instance;  
}

private static CursorExtensionConverter instance = new CursorExtensionConverter();  
}

[/code]

### Note: Use of MarkupExtension
