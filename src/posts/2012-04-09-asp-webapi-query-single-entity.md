---
title: "ASP Web API query single entity"
date: "2012-04-09"
category: "Web & APIs"
tags: ["web api", "ravendb"]
---

What’s wrong with this?

```csharp
public class UsersController : RavenController
{
    public User Get(int userId)
    {
        this.AutoSave = false;
        var user = RavenSession.Load<User>(userId);
        if (user == null)
         throw new HttpResponseException("Unable to find user for it " + userId);
        return user;
    }

    // GET /api/values
    public IQueryable<User> GetAll()
    {
        this.AutoSave = false;
        return RavenSession.Query<User>();
    }
}
```
The problem is the variable name used for getting a single user, the function would never be called.

E.g. if we put <http://localhost:65487/api/users/1> into our browser what will happen is the GetAll gets called! 

What we need to call is:

```csharp
public class UsersController : RavenController
{
    public User Get(int id)
    {
        this.AutoSave = false;
        var user = RavenSession.Load<User>(id);
        if (user == null)
            throw new HttpResponseException("Unable to find user for it " + id);
        return user;
    }

    // GET /api/values
    public IQueryable<User> GetAll()
    {
        this.AutoSave = false;
        return RavenSession.Query<User>();
    }
}
```
Now you see that the Get takes **_a variable name of “id”, this is key to getting this to work_**.

Note: I’m using IQueryable as this allows me to add some query parameters to my request, e.g.

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
