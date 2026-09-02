---
title: "Data Validation in Silverlight (Method 1)"
date: "2010-02-14"
category: "XAML & Desktop"
tags: ["silverlight", "validation", "data binding"]
---

Here's one way to do validation in Silverlight.

This is a pretty straight method using exceptions (if you're from the camp that allows exceptions in your Data objects).

```csharp
public string Name
{
 get
 {
     return _name;
 }
 set
 {
  if ( value.Length >= 10 )
    throw new ArgumentException( "Name is too long" );
  _name = value;
 }
}

<TextBox x:Name="name"
  <TextBox.Text>
   <Binding Path="name"
     NotifyOnValidationError="True"
      ValidatesOnExceptions="True" />
 </TextBox.Text>
</TextBox>
```