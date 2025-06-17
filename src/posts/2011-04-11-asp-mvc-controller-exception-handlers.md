---
title: "ASP MVC Controller Exception handlers"
date: "2011-04-11"
tags: []
---

When you crate a new MVC project a view called Error.aspx is created for you in the Views/Shared folder.

    <%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master"
    Inherits="System.Web.Mvc.ViewPage" %>

    <asp:Content ID="errorTitle" ContentPlaceHolderID="TitleContent" runat="server">

        Error

    asp:Content>

    <asp:Content ID="errorContent" ContentPlaceHolderID="MainContent" runat="server">

        <h2>

            Sorry, an error occurred while processing your request.

        h2>

    asp:Content>

To instruct controller actions to use this Error handler you need to use the HandlErrorAttribute action filter, this is the default exception handler present in MVC.  
HandleError is used to specify an exception type to handle and a View (and Master View if necessary) to display if an action method throws an unhandled exception that matches or is derived from the specified exception type.

Some points to note:

- If no exception type is specified, then the filter handles all exception.
- If no view is specified then the default Error view is used.
- As mentioned earlier, exceptions are caught by base types, so it’s important to specify an order catching the most specific exception types first (much like a standard try catch code block.
- The handler won’t get called in debug builds as it checks the HttpContext.IsCustomErrorEnabled (yellow screen of death is preferred)
  e.g.

      // Dont do this

      [HandleError(Order=1, ExceptionType=typeof(Exception)]

      [HandleError(Order=2, ExceptionType=typeof(ArgumentNullException, View=ArgNull)]

You’ll need to reverse the order, because if you want the ArgumentNullException to be handled differently, the exception shouldn’t get swallowed by the typeof(Exception) handler.
