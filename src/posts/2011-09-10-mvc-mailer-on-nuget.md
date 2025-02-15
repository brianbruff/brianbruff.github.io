---
title: "MVC Mailer on NuGet"
date: "2011-09-10"
tags: ["Mvc Mailer ASP"]
---

So have you ever found yourself doing this?

![](/images/./image.axd?picture=image_thumb_89.png)

Well no there’s a nicer alternative whereby you can build up your mail in html.   
Check out the MVCMailer package on Nuget.

PM> Install-Package MvcMailer   
Attempting to resolve dependency 'T4Scaffolding (≥ 0.9.7)'.   
Attempting to resolve dependency 'EntityFramework (≥ 4.1.10311.0)'.   
Successfully installed 'MvcMailer 1.1'.   
Successfully added 'MvcMailer 1.1' to TCF.

\---------------------------READ ME---------------------------------------------------

Your default Mailer Scaffolder is set to Mailer.Razor

You can generate your Mailers and Views using the following Scaffolder Command

PM> Scaffold Mailer UserMailer Welcome,GoodBye

Edit the smtp configuration at web.config file before you send an email

You can find more at: <https://github.com/smsohan/MvcMailer/wiki/MvcMailer-Step-by-Step-Guide>

\-------------------------------------------------------------------------------------

PM> 
