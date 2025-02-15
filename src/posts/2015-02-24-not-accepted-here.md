---
title: "Not accepted here"
date: "2015-02-24"
tags: ["OData", "HttpStatus 406", "Not Accepted", "ODataConventionModelBuilder."]
---

_and it's not because I'm Irish ;-)_

## ODataController - 406

So I’m working on a project that returns some entities from an OData endpoint, I wanted to remove the unnecessary parts of my entities so I created some DTO’s (which in itself is a good idea btw). The screenshot below shows the changes, I’m now returning a TimeSheetDto list (previously just a TimeSheet list) and I’m just projecting _(using automapper)_ the Timesheets from my database into these DTO’s .

![](/images//images/image_thumb_363.png)  

However when I test said entities I see nothing come back in my browser, nada,zilch,zippo… so what is happening?   
Well I fired up fiddler and saw that I was getting a HTTP status code of 406, but why?   
It worked before and I changed nothing…. oh wait!….

Configure OData entities

You know that message that gets scaffolded with new OData end points!? We’ll it explicitly tells us what entities are to be considered, so with a quick addition of my Dto Suffix in my OData config I’m back in action.

![](/images//images/image_thumb_364.png)  

