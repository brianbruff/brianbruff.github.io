---
title: "LINQ in ASP.NET"
date: "2010-09-25"
category: "Web & APIs"
tags: ["linq", "asp.net mvc"]
---

A quick sample of how to use LINQ in your webpages.

```xml
<% Model.ToList().ForEach(item =>
{ %>
  <tr>
      <td>
          <%: Html.ActionLink("Edit", "Edit", new { id = item.AlbumId })%> |
          <%: Html.ActionLink("Delete", "Delete", new { id = item.AlbumId })%>
      </td>
      <td><%: Html.Truncate(item.Title, 25)%></td>
      <td><%: Html.Truncate(item.Artist.Name, 25)%></td>
      <td><%: item.Genre.Name%></td>
  </tr>
<% }); %>
```
I said quick ey! :-)
