---
title: "ASP WebApi query single entity"
date: "2012-04-09"
tags: ["Using Raven with Asp Web Api"]
---

What’s wrong with this?

       1:  public class UsersController : RavenController

       2:  {  

       3:      public User Get(int userId)

       4:      {

       5:          this.AutoSave = false;

       6:          var user = RavenSession.Load(userId);

       7:          if (user == null)

       8:             throw new HttpResponseException("Unable to find user for it " + userId);

       9:          return user;

      10:      }

      11:   

      12:      // GET /api/values

      13:      public IQueryable GetAll()

      14:      {

      15:          this.AutoSave = false;

      16:          return RavenSession.Query();            

      17:      }        

      18:  }

The problem is the variable name used for getting a single user the function would never be called.

E.g. if we put <http://localhost:65487/api/users/1> into our browser what will happen is the GetAll gets called! 

What we need to call is

       1:  public class UsersController : RavenController

       2:  {  

       3:      public User Get(int id)

       4:      {

       5:          this.AutoSave = false;

       6:          var user = RavenSession.Load(id);

       7:          if (user == null)

       8:              throw new HttpResponseException("Unable to find user for it " + id);

       9:          return user;

      10:      }

      11:   

      12:      // GET /api/values

      13:      public IQueryable GetAll()

      14:      {

      15:          this.AutoSave = false;

      16:          return RavenSession.Query();            

      17:      }        

      18:  }

Now you see that the Get takes** _a variable name of “id” this is key to getting this work_**.

Note: I’m using IQuerable as this allows me to add some query parameters to my request, e.g.

**$filter**   
A Boolean expression for whether a particular entry should be included in the feed, e.g. Categories?$filter=CategoryName eq 'Produce'. The Query Expression section describes OData expressions.

**$orderby**   
One or more comma-separated expressions with an optional “asc” (the default) or “desc” depending on the order you’d like the values sorted, e.g. Categories?$orderby=CategoryName desc.

**$select**   
Limit the properties on each entry to just those requested, e.g. Categories?$select=CategoryName,Description.

**$skip**   
How many entries you’d like to skip, e.g. Categories?$skip=4.

**$top** \-   
Return entries from the top of the feed, e.g. Categories?$top=4

See MSDN for more options.

\-- Updated Post --

Thanks to James Hancock for pointing this one out for me. This post is a little misleading in that the $select is currently not supported. Please see <http://forums.asp.net/t/1771116.aspx/1?OData%20Support> for more information on this. The other query string parameters listed above are supported.
