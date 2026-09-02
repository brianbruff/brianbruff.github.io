---
title: "MVC Binding restriction"
date: "2010-10-10"
category: "Web & APIs"
tags: ["asp.net mvc", "model binding"]
---

There are a few options when restricting what properties of a type get automatically bound by the framework.

Take the Loler type seen in my other MVC2 blog posts.

```csharp
[Bind(Include="ID,Name,Description")]
public class Loler
{
//entity framework generated
}
```
Notice only the ID, Name and Description properties will be bound by the MVC Framework.

Per Usage restriction

```csharp
UpdateModel(loler, new[] { "ID", "Name", "Description" });
```
Action method restrictions

```csharp
[HttpPost]
ActionResult Create([Bind(Include="ID,Name,Description")] Loler loler)
{
// implementation
}
```