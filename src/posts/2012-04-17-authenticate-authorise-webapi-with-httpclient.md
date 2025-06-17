---
title: "Authenticate, Authorise WebApi with HttpClient"
date: "2012-04-17"
tags: ["ASP WebApi login using HttpClient"]
---

Hi all, I said I’d post this because I didn’t manage to find a suitable blog post or documentation indicating how to do this with the HttpClient (beta). (bleeding edge again ey).

This post outlines how to create a simple test server that has a Json Logon endpoint.  
Then it shows how to login with the .net 4.5 HttpClient class. Lots of other post I saw were trying to set Channels on this HttpClient, I’ll have to assume this was from the developer preview or the Wcf predecessor. It appears now the solution comes in the form of a HttpClientHandler!

It’s been a long day, up at 4am for a flight and then a long day at work, so lets cut to the chase…

## Server

For setup, create a new MVC4 internet application

![](/images/./image.axd?picture=image_thumb_185.png)

Why? because it gives me a AccountController with a JsonLogin action

![](/images/./image.axd?picture=image_thumb_186.png)

Add a new ApiController

![](/images/./image.axd?picture=image_thumb_187.png)

![](/images/./image.axd?picture=image_thumb_188.png)

Add the Authorize attribute

![](/images/./image.axd?picture=image_thumb_189.png)

Now we have a simple server setup for testing (no https etc, but lets not overcomplicate this just now).

## Client

I just created a WPF client and called the following function on a button click.

    private async void Login()

    {

        var handler = new HttpClientHandler();

        CookieContainer cookieContainer = new CookieContainer();

        handler.CookieContainer = cookieContainer;

        var client = new System.Net.Http.HttpClient(handler);

        var content = new FormUrlEncodedContent(new Dictionary<string, string>

        {

            {"UserName", "brianbruff1"},

            {"Password", "password"}

        });

        var response = await client.PostAsync("http://localhost:2122/account/jsonlogin", content);

        response.EnsureSuccessStatusCode();

        var msg = await response.Content.ReadAsStringAsync();

        // just get the default value from the starter project

        response = await client.GetAsync("http://localhost:2122/api/values");

        response.EnsureSuccessStatusCode();

        var list = await response.Content.ReadAsAsyncstring>>();

    }

That’s it, next steps to clean up this code are all yours, but hopefully I’ve helped someone out.  
Remember to register the user the first time your run your MVC app, or your msg variable will indicate you couldn’t be logged on.

[Remember to include Http.Formatters for the ReadAsAsync extension.](/post/2012/04/11/Deserializing-Json.aspx)

Brian.

Credit to @tomasmcguinness for pointing me in the right direciton (my other approach was to use PKI).  
Credit to Microsoft for releasing the source so I could figure this out!
