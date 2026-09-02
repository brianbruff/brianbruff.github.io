---
title: "MVC Action Filters"
date: "2011-08-03"
category: "Web & APIs"
tags: ["asp.net mvc", "design patterns"]
---

So what are MVC Filters? To quote Professional ASP.NET MVC2 ISBN 978-0-470-64318-1   
  
“Filters are a declarative attribute-based means of providing cross-cutting behavior to an action method.”

So what are MVC Filters? Well let's discuss the M, the V and the C. The model is the data we wish to display in the View, which is how we present the data, the responsibility of the controller is to coordinate the view with the model. But what about orthogonal functionalities, e.g. logging, error handling, authentication etc.

In MVC the responsibility for these activities is undertaken by Filters. Out of the box MVC provides the following Filters:

  * Authorize 
  * HandleError 
  * OutputCache 
  * RequireHttps
  * ValidateAntiForgeryToken
  * ChildOnlyAction
  * ValidateInput

```csharp
[HandleError[ExceptionType = typeof(RuntimeException), View='RuntimeError']
public ActionResult Test()
{
    throw new RuntimeException("oops");
}
```
What happens here is that we get directed towards the RuntimeError view.

The attributes can be added to the Controller or Action.

In MVC3 we get the possibility to add these filters Globally. The advantage of this is you no longer need to decorate every controller or action with an attribute that you wanted executed whenever it ran, now you can register in one place and have it executed across multiple controllers and actions. 

You add these global filters in your Global.asax as follows:

```csharp
public static void RegisterGlobalFilters(GlobalFilterCollection filters)
{
    filters.Add(new HandleErrorAttribute());
}
```