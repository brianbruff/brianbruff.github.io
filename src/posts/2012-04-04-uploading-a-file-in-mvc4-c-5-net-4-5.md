---
title: "Uploading a file in MVC4 C#5 .NET 4.5"
date: "2012-04-04"
tags: []
---

Back on the bleeding edge again ![Hot smile](./image.axd?picture=wlEmoticon-hotsmile_2.png) I’m in the early stages of my next killer app and I’m investigating the pros and cons of using the new ASP WebApi.

One of the features of this so called killer app will be to upload pictures (nothing special I agree). But how would I do this for all the clients I hope to support (WinRT/WP7/Html5/IOS).

Let me first present the server that will be used for all these clients, I’ll then follow up with what I consider to be the simplest client a html5 browser!

# Server

So I fired up VS11 and created a new MVC4 application using .net 4.5 / C# and the WebApi template.

I then added a controller called FileUploadController.cs

       1:  using System.Collections.Generic;

       2:  using System.Linq;

       3:  using System.Net;

       4:  using System.Net.Http;

       5:  using System.Threading.Tasks;

       6:  using System.Web.Http;

       7:   

       8:  namespace MvcApplication16.Controllers

       9:  {

      10:      public class FileUploadController : ApiController

      11:      {

      12:          public async Taskstring>> PostMultipartStream()

      13:          {

      14:              // Check we're uploading a file

      15:              if (!Request.Content.IsMimeMultipartContent("form-data"))

      16:                  throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

      17:

      18:              // Create the stream provider, and tell it sort files in my c:\temp\uploads folder

      19:              var provider = new MultipartFormDataStreamProvider("c:\\temp\\uploads");

      20:   

      21:              // Read using the stream

      22:              var bodyparts = await Request.Content.ReadAsMultipartAsync(provider);

      23:

      24:              // Create response.

      25:              return provider.BodyPartFileNames.Select(kv => kv.Value);

      26:          }

      27:      }

      28:

      29:  }

You can see from line 12 that I’ve made this operation async, you’ve really got to admire the simplicity of async/await construct in .net 4.5! In line 22 you can see that the compiler and some state machine magic allow the freeing up of the asp worker thread….. (If you have read my previous posts you may be a little confused now.. didn’t I say that Tasks will use use the same threadpool!? [have a look at this link for someone that pondered the very same concerns](http://stackoverflow.com/questions/9772998/mvc-4-web-api-returning-tasks-from-actions) )

# HTML5 Client

The client couldn’t have been easier, fist a look at it in the browser

![](/images/./image.axd?picture=image_thumb_173.png)

       1:  DOCTYPE html>

       2:  <html lang="en">

       3:  <head>

       4:      <meta charset="utf-8" />

       5:      <title>ASP.NET Web APItitle>

       6:      <link href="@Url.Content("~/Content/Site.css")" rel="stylesheet" type="text/css" />

       7:      <meta name="viewport" content="width=device-width" />

       8:  head>

       9:  <body>

      10:      @using (Html.BeginForm("FileUpload", "api", FormMethod.Post, new { enctype = "multipart/form-data" }))

      11:      {

      12:          <div>Please select some filesdiv>

      13:          <input name="data" type="file" multiple>

      14:          <input type="submit" />

      15:      }

      16:  body>

      17:  html>

The important part above is using the enctype attribute, in fact line 10 loosely translates to

    "~/api/FileUpload" enctype="multipart/form-data" method="POST">

Don’t believe me? Then try VS11’s awesome new feature – page inspector

Right click on the html and choose view in page inspector

![](/images/./image.axd?picture=image_thumb_175.png)

and we’re done! Of course in the real world we’ll use ajax with a few trick re sandbox, but here’s the response in the browser with xml.

![](/images/./image.axd?picture=image_thumb_174.png)

I’ll hopefully follow up with the samples for the client list below when I get to the respective development machines.

- WinRT (c#/xaml)
- iPhone (objective c)
- Android (java)
