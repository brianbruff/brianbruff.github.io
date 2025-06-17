---
title: "Using Telerik RadScheduler with MVC3"
date: "2011-02-23"
tags: []
---

The cool hip thing these days is MVC, hang ur head in shame if you are still plodding along with plain old asp.net.

Actually that’s not quite right, in fact it couldn’t be further from the truth, asp.net is alive and strong and will be for a long long time, don’t mind those people complaining about

- Not having direct (easy) control over what html gets rendered
- Testing lets a little to be desired
- You can’t get ur grubby little hands on the @razor (at least i’m not currently aware if it can be used outside MVC3);

ASP is alive and strong and Microsoft are actively working on it, what’s more you’ve most likely already have some pretty good controls that you slaved over or bought ready made…

I’m a bit partial to Telerik controls and tonight I wanted to use the RadScheduler in a webportal i’m working on, and here it is in action

![](/images//blog/image.axd?picture=image_thumb_25.png)

![](/images//blog/image.axd?picture=image_thumb_26.png)

So how did I manage to do this?

Well I started out with a HtmlHelper extension and then realized it was even easier.

Telerik RadScheduler works directly with webservices (please read their documentation for full info (because my posts are more pointers then full working samples)

The View contains the following (apologies in all my talk I didn’t use razor ![Embarrassed smile](/blog/image.axd?picture=wlEmoticon-embarrassedsmile_1.png))

       1:  <%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

       2:  <%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>

       3:  "HeaderCnt" ContentPlaceHolderID="TitleContent" runat="server">

       4:

       5:

       6:   

       7:

      13:  "BdyCnt" ContentPlaceHolderID="MainContent" runat="server">

      14:

    ## Index

      15:      "server" ID="SampleRadScheduler" EnableAdvancedForm="false">

      16:          "~/Models/FeedWebService.asmx" />

      17:          "false" />

      18:

      19:

That’s pretty muich it, I’m using a plain old .net 2.0 style Webservice as outlined in Telerik help samples but expect I can use WCF too (another post maybe).

enjoy..
