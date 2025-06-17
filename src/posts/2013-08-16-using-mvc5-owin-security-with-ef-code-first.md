---
title: "Using MVC5 Owin Security with EF Code First"
date: "2013-08-16"
tags:
  [
    "Owin",
    "Security",
    "EF Code First",
    "Identity",
    "IdentityStoreManager",
    "IdentityStoreContext",
    "IdentityDbContext",
  ]
---

Good evening, I’d like to share my solution for using MVC5 Owin security with VS2013 Update 1.  
I wanted to have my own DBContext contain both my own DBSets and also the security tables.

Now I could find zero documentation on this and I actually walked away from the bleeding edge last week and reverted to MVC4. Tonight I had some free time and like a dog with a bone I wanted to figure this out. I’m not saying I came up with the nicest or correct solution, but alas I came up with something that appears to be working for me.  
Please feel free to give me any feedback I’d appreciate it.

## The problem

I wanted one single database containing my own entities and also the security entities.  
I wanted to use the latest MVC5 built on the [OWIN](http://owin.org/) (open web interface for .net).  
I wanted to use code first migrations to keep my database up to date.  
I could find no documentation..

## The Solution

- Create my own entity class  
  ![](/images/./image.axd?picture=image_thumb_271.png)

- Create my own DBContext and IdentityStoreContext (the secret sauce)

![](/images/./image.axd?picture=image_thumb_272.png) The SiteCertDbContext derives from the IdentityDbContext used by default in MVC5 Update1.

- Tell the account controller use this new DbContext

![](/images/./image.axd?picture=image_thumb_273.png)

-

That’s pretty much it, hope it helps someone else out you can now open the Nuget package manager and Enable-Migrations.
