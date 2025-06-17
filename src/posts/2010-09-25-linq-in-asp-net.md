---
title: "Linq in asp.net"
date: "2010-09-25"
tags: []
---

A quick sample of how to use linq in your webpages

[code:c#]

<% Model.ToList().ForEach(item =>  
{ %>

<%: Html.ActionLink("Edit", "Edit", new { id = item.AlbumId })%> |  
<%: Html.ActionLink("Delete", "Delete", new { id = item.AlbumId })%>

| <%: Html.Truncate(item.Title, 25)%>  
| <%: Html.Truncate(item.Artist.Name, 25)%>  
| <%: item.Genre.Name%>

<% }); %>

[/code]

I said quick ey! :-)
