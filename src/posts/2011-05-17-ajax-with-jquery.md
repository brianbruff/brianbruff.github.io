---
title: "Ajax with jQuery"
date: "2011-05-17"
tags: []
---

Hi all,

I’m sitting here waiting for a 50meg upload to finish,,, god my internet is slow.

May as well add a post ey ![Smile](/blog/image.axd?picture=wlEmoticon-smile_1.png)

So I’ll show you how you can request some JSON data from a MVC action using jQuery, You are probably familiar with AJAX.BeginForm extension from Microsoft, but lets do this the jQuery way.

  * Set up your action method to return some JSON

    public ActionResult GetJson()

    {

         return Json(new { Id = 1, value = "First" }, JsonRequestBehavior.AllowGet);

    }

  * Set up a div to hold the json data and some jQuery to request it on document load,   
the getJSON takes the action url and when it returns it places the formatted JSON into the DIV.   
pretty simple ey..

       1:  @{

       2:      ViewBag.Title = "Home Page";    

       3:  }

       4:   

       5:   

       6:  @section head {

       7:   

       8:  }

       9:   

      10:  
    
    ## @ViewBag.Message

      11:   

      12:   

      13:  

      14:   

      15:   

      16:  @section footer {

      17:   

      18:  

      27:   

      28:  }
