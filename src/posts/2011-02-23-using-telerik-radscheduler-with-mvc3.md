---
title: "Using Telerik RadScheduler with MVC3"
date: "2011-02-23"
category: "Web & APIs"
tags: ["kendo ui", "asp.net mvc"]
---

The cool hip thing these days is MVC, hang ur head in shame if you are still plodding along with plain old ASP.NET.

Actually that’s not quite right, in fact it couldn’t be further from the truth, ASP.NET is alive and strong and will be for a long long time, don’t mind those people complaining about 

  * Not having direct (easy) control over what HTML gets rendered
  * Testing leaves a little to be desired 
  * You can’t get ur grubby little hands on the @razor (at least I’m not currently aware if it can be used outside MVC3); 

ASP is alive and strong and Microsoft are actively working on it, what’s more you most likely already have some pretty good controls that you slaved over or bought ready made…

I’m a bit partial to Telerik controls and tonight I wanted to use the RadScheduler in a webportal I’m working on, and here it is in action.

![](/images/blog/image_thumb_25.png)

![](/images/blog/image_thumb_26.png)

So how did I manage to do this?

Well I started out with a HtmlHelper extension and then realized it was even easier.

Telerik RadScheduler works directly with webservices (please read their documentation for full info (because my posts are more pointers than full working samples)).

The View contains the following (apologies in all my talk I didn’t use razor).

```html
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>
<%@ Register Assembly="Telerik.Web.UI" Namespace="Telerik.Web.UI" TagPrefix="telerik" %>
<asp:Content ID="HeaderCnt" ContentPlaceHolderID="TitleContent" runat="server">

</asp:Content>

<script runat="server">
    public override void VerifyRenderingInServerForm(Control control)
    {

    }
</script>
<asp:Content ID="BdyCnt" ContentPlaceHolderID="MainContent" runat="server">
    <h2>Index</h2>
    <telerik:RadScheduler runat="server" ID="SampleRadScheduler" EnableAdvancedForm="false">
        <WebServiceSettings Path="~/Models/FeedWebService.asmx" />
        <AdvancedForm Modal="false" />
    </telerik:RadScheduler>
</asp:Content>
```
That’s pretty much it, I’m using a plain old .NET 2.0 style Webservice as outlined in Telerik help samples but expect I can use WCF too (another post maybe).

Enjoy...
