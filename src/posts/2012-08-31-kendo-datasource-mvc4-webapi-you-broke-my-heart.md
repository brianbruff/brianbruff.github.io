---
title: "Kendo Datasource & MVC4 WebApi, you broke my heart"
date: "2012-08-31"
tags: ["KendoUi MVC Web Api"]
---

So I’ve spend many a sleepless night this week knowing that the webapplication i was working was not doing server side paging…

This morning I decided I needed to remedy that and was I in for an experience ![Smile](./image.axd?picture=wlEmoticon-smile_18.png)

At first I was thinking why oh why had the kendo guys not got the finger out and implemented WebApi support… and I’ve come to the conclusion that they didn’t waste any time on a moving platform…. in fact I'd go as far to say as the platform was actually removed with MVC4 RTM… let me explain….

### OData support

I’ve previously mentioned that the MS guys are going to provide a more robust OData support, this is a good thing, there’s currently an alpha package for those who date <http://www.nuget.org/packages/Microsoft.AspNet.WebApi.OData>

However what I failed to notice was that they **removed the existing OData support altogether!!  
** Don’t get me wrong i think this was a good decision not ot have a half implemented solution with a fuller one on the way, it’s just it’s gone and broken many of my WebApis ![Sad smile](./image.axd?picture=wlEmoticon-sadsmile_3.png)

Not to worry, we are where we are and now I need the WebApi to support paging, which previously relied on OData $top $skip $count.

So here is my current solution.

## Server

#### 

### Return:

My return values now have a Total and the Data, I used the following class to help me out here.

![](/images/./image.axd?picture=image_thumb_215.png)

### Parameters

I added some new classes for Pagable parameters, note the Take, Skip,Page,PageSize are sent with kendoui datasource (from fiddler)

![](/images/./image.axd?picture=image_thumb_216.png)

### ApiCall

Here is a sample API call, as previously mentioned I don’t like that I’ve cluttered it up with pagination, (maybe I should consider ModelBinders or MediaFormatters…..)

![](/images/./image.axd?picture=image_thumb_217.png)

## Client

Now for the Kendo javascript side:

![](/images/./image.axd?picture=image_thumb_218.png)

The first important part I had was I had to map the parameters, the reason is that I’m updating the datasource via ajax and I call it like this:   
  
ds.read(s0); I.e. I’m passing some parameters to the query ( i know there is mention of a query object in the kendo api but I failed to get this working), in the javascript above I’m just setting these parameters again when the paging happens. Note this was where I could set e.g. $top = options.take; if odata was supported…. ![Sad smile](./image.axd?picture=wlEmoticon-sadsmile_3.png)

The next important part is that, I’m getting the result from the .Data field and I’m getting the total form the result.Total field (i also do a bit of mapping for some missing values but that’s application specific).

kr, Brian.
