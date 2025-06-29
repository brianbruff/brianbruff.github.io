---
title: "MVC Binding restriction"
date: "2010-10-10"
tags: []
---

There are a few options when restricting what properties of a type get automatically bound by the framework.

Take the Loler type seen in my other MVC2 blog posts.

[code:c#]

[Bind(Include="ID,Name,Description")]  
public class Loler  
{   
//entity framework generated  
}

[/code]

Notice only the ID Name and Description properties will be bound by MVC Framework.

Per Usage restriction

[code:c#]

UpdateModel(loler, new[] { "ID", "Name", "Description" });

[/code]

Action method restrictions

[code:c#]

[HttpPost]  
ActionResult Create([Bind(Include="ID,Name,Description")] Loler loler)  
{  
// implementation  
}

[/code]
