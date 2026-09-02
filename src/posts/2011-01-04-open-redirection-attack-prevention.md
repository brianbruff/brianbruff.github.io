---
title: "Open Redirection Attack prevention"
date: "2011-01-04"
category: "Web & APIs"
tags: ["asp.net mvc", "security", "authentication"]
---

If you've had a look at the MVC3 preview generated code you will notice the Url.IsLocalUrl method getting called from the LogOn action.

```csharp
[HttpPost]
public ActionResult LogOn(LogOnModel model, string returnUrl)
{
    if (ModelState.IsValid)
    {
        if (MembershipService.ValidateUser(model.UserName, model.Password))
        {
            FormsService.SignIn(model.UserName, model.RememberMe);
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
        else
        {
            ModelState.AddModelError("",
            "The user name or password provided is incorrect.");
        }
    }

    // If we got this far, something failed, redisplay form
    return View(model);
}
```
This prevents phishing attacks by ensuring that after a successful log on the user only gets directed to the local site and not another site.

Take for example I send you an email with a link to [/Account/LogOn?returnUrl=http://brainkeating.net/Account/LogOn](/Account/LogOn?returnUrl=http://brainkeating.net/Account/LogOn)  
After you successfully enter your log on details @ briankeating.net you would get redirected to [www.brAInkeating.net](http://www.brAInkeating.net). If you are not quick enough to notice you could now be presented with an identical logon page at this different url. Oh darn, I typed my password wrong... BrAIn Keating is a nasty piece of work, he will log your login details to his database and then use them to access briankeating.net with your credentials. Now after you login @ brAInkeating.net you will get redirected back here to briankeating.net (where you've already authenticated and be none the wiser).

So what if you are still on MVC2 (most of my web apps these days are...), what can you do to avoid this attack...

That's an easy one to answer, I've been a lazy bugger and lifted this code from [www.asp.net](http://www.asp.net).

```csharp
public bool IsLocalUrl(string url) {
    return System.Web.WebPages.RequestExtensions.IsUrlLocalToHost(
        RequestContext.HttpContext.Request, url);
}
```
The IsUrlLocalToHost method contains the actual validation logic below.

```csharp
public static bool IsUrlLocalToHost(this HttpRequestBase request, string url) {
    if (url.IsEmpty()) {
        return false;
    }

    Uri absoluteUri;
    if (Uri.TryCreate(url, UriKind.Absolute, out absoluteUri)) {
        return String.Equals(request.Url.Host, absoluteUri.Host,
            StringComparison.OrdinalIgnoreCase);
    }
    else {
        bool isLocal = !url.StartsWith("http:", StringComparison.OrdinalIgnoreCase)
            && !url.StartsWith("https:", StringComparison.OrdinalIgnoreCase)
            && Uri.IsWellFormedUriString(url, UriKind.Relative);
        return isLocal;
    }
}
```