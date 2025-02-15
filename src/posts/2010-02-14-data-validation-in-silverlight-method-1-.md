---
title: "Data Validation in Silverlight (Method 1)"
date: "2010-02-14"
tags: []
---

Here's one way to do validation in silverlight.

This is a pretty straight method using exceptions (if you're from the camp that allows exceptions in your Data objects ![Cool](/blog/editors/tiny_mce3/plugins/emotions/img/smiley-cool.gif))

[code:c#]

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

NotifyOnValidationError="True"   
ValidatesOnExceptions="True" />   

[/code]
