---
title: "Ajax with jQuery"
date: "2011-05-17"
category: "Front-end & JavaScript"
tags: ["jquery", "json", "asp.net mvc"]
---

Hi all,

I’m sitting here waiting for a 50meg upload to finish... god my internet is slow.

May as well add a post ey.

So I’ll show you how you can request some JSON data from a MVC action using jQuery. You are probably familiar with AJAX.BeginForm extension from Microsoft, but let’s do this the jQuery way.

  * Set up your action method to return some JSON

```csharp
public ActionResult GetJson()
{
     return Json(new { Id = 1, value = "First" }, JsonRequestBehavior.AllowGet);
}
```
  * Set up a div to hold the JSON data and some jQuery to request it on document load,   
the getJSON takes the action url and when it returns it places the formatted JSON into the DIV.   
Pretty simple ey...

```html
@{
    ViewBag.Title = "Home Page";
}


@section head {

}

<h2>@ViewBag.Message</h2>


<DIV id=json></DIV>


@section footer {

<script type="text/javascript">
    $(function () {

        $.getJSON('@Url.Action("GetJson")', function (obj) {
            $('#json').html(obj.Id.toString() + " : " + obj.value.toString());
        });

    });
</script>

}
```
