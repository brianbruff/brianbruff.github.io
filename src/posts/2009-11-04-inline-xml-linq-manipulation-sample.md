---
title: "Inline XML Linq manipulation sample"
date: "2009-11-04"
tags: ["linq", "c# 3.0"]
---

## A quick example of inline xml and Linq

# Code

[code:c#]

void LinqToXmlSample()   
{   
Console.WriteLine("{0} : Start", new StackTrace(0, true).GetFrame(0).GetMethod().Name);

XDocument xDocument = new XDocument(   
new XElement("people",   
new XElement("person",   
new XAttribute("sex", "male"),   
new XElement("FirstName", "Brian"),   
new XElement("LastName", "Keating")),   
new XElement("person",   
new XAttribute("type", "female"),   
new XElement("FirstName", "Dustin"),   
new XElement("LastName", "Turkey"))));

IEnumerable elements =   
xDocument.Element("people").Descendants("FirstName");

/* First, I will display the source elements.*/   
foreach (XElement element in elements)   
{   
Console.WriteLine("Source element: {0} : value = {1}",   
element.Name, element.Value);   
}

/* Now, I will display the ancestor elements for each source element.*/   
foreach (XElement element in elements.Ancestors())   
{   
Console.WriteLine("Ancestor element: {0}", element.Name);   
}

Console.WriteLine("{0} : Finish", new StackTrace(0, true).GetFrame(0).GetMethod().Name);   
}

[/code]

# Output

LinqToXmlSample : Start   
Source element: FirstName : value = Brian   
Source element: FirstName : value = Dustin   
Ancestor element: person   
Ancestor element: people   
Ancestor element: person   
Ancestor element: people   
LinqToXmlSample : Finish

_[Update August 2012: Little did I know when i wrote this post just how much I would use Linq to xml, it saved me from a life of xslt![Smile](./image.axd?picture=wlEmoticon-smile_17.png) ]_
