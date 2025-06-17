---
title: "KendoUi Web Grid and ASP MVC Web Api"
date: "2012-08-23"
tags: ["KendoUi", "Grid", "HttpPost", "Grid refresh."]
---

I’ve just been through the mill trying to get kendo grid working with a ASP MVC Web Api Http Post Action.  
I think it may help someone if I post my findings.

## OData

If you use KendoUi you know that the datasource has v.good support of OData, but you’ll most likely also be aware that the WebApi _currently_ is not fully OData compliant (did you notice i said currently!!! I’ve seen some heated discussions regarding OData support with WebApi, and it looks like some headway has been made [http://blogs.msdn.com/b/alexj/archive/2012/08/15/odata-support-in-asp-net-web-api.aspx?CommentPosted=true](http://blogs.msdn.com/b/alexj/archive/2012/08/15/odata-support-in-asp-net-web-api.aspx?CommentPosted=true)). Now while I’m all on for living on the bleeding edge I’ve decided to give the alpha a miss for now as I need to get this solution into production.

## But we are, where we are.

> So in the interim I needed to perform the simple task of getting the Kendo grid to
>
> - Use Http Post verb
> - Refresh when the async operation of loading data has finished.
>
> ### How hard could that be?
>
> Well looking back, not all that difficult, but it’s easy when you know how.

> #### Getting kendo dataset to use Http Post verb.

Lets first have a look at my MVC Action

![](/images/./image.axd?picture=image_thumb_211.png)

##

Don’t get hooked up on the implementation or where I’ve put it for now, the important part is to notice the HttPostAttribute aspect. The endpoint url would be something like localhost/MyApp/api/Data/MyId where MyId would be the first parameter, the second parameter SearchOptionsFilters on the other hand are posted; here’s how:

![](/images/./image.axd?picture=image_thumb_212.png)

Here we see we’re passing the sf object (that the model binder parses into it’s .net counterpart) to the read function of the dataset, AND we are explicitly setting the transport.options.read.type to “POST”.

Now I found a good few posts demonstrating how to do this but they mostly showed javascript object literals with the “POST” set on the transport which wouldn’t work for me, i.e.

![](/images/./image.axd?picture=image_thumb_213.png)

#### Getting the grid to refresh once the data becomes available

Look in the screenshot above, I’ve already given this game away! The change callback refreshes the grid once the datasource changes underneath, this it appears is required when going down the ajax route.

Kr,  
Brian.
