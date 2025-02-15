---
title: "Enabling Facebook OAuth in MVC4 SPA"
date: "2013-03-09"
tags: ["Facebook OAuth", "MVC4"]
---

There are two steps, the first step is to register a facebook application, after you register you will have a key and password. The next step will be to insert these into you application.

## Step 1.

#### Enable OAuth login using Facebook, Twitter

**Steps to get keys for Facebook**

     * Go to the [Facebook developers site](https://developers.facebook.com/apps) (log in if you're not already logged in). 
     * Choose the Create New App button, and then follow the prompts to name and create the new application. 
     * In the section Select how your app will integrate with Facebook, choose the Website section. 
     * Fill in the Site URL field with the URL of your site (for example, [http://www.example.com](http://www.example.com/)). The Domain field is optional; you can use this to provide authentication for an entire domain (such as example.com).   
Note If you are running a site on your local computer with a URL like [http://localhost:12345](http://localhost:12345/) (where the number is a local port number), you can add this value to the Site URL field for testing your site. However, any time the port number of your local site changes, you will need to update the Site URL field of your application. 
     * Choose the Save Changes button. 
     * Choose the Apps tab again, and then view the start page for your application. 
     * Copy the App ID and App Secret values for your application, here is what it looks like, I’ve blurred my app id and secret.
     * ![](/images/./image.axd?picture=image_thumb_249.png)
     * Exit the Facebook developer site

## 

## Step 2.

Edit your App_Start/AuthConfig.cs with these new settings

![](/images/./image.axd?picture=image_thumb_250.png)

That’s it, you can no log in with facebook, see the placeholder template below. ![](/images/./image.axd?picture=image_thumb_251.png) 

