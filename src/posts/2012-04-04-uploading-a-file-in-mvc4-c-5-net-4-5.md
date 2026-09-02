---
title: "Uploading a file in MVC4 C#5 .NET 4.5"
date: "2012-04-04"
category: "Web & APIs"
tags: ["web api", "asp.net mvc", "html5"]
---

Back on the bleeding edge again. I’m in the early stages of my next killer app and I’m investigating the pros and cons of using the new ASP WebApi.

One of the features of this so called killer app will be to upload pictures (nothing special I agree). But how would I do this for all the clients I hope to support (WinRT/WP7/HTML5/iOS).

Let me first present the server that will be used for all these clients, I’ll then follow up with what I consider to be the simplest client an HTML5 browser!

# Server

So I fired up VS11 and created a new MVC4 application using .NET 4.5 / C# and the WebApi template.

I then added a controller called FileUploadController.cs

```csharp
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MvcApplication16.Controllers
{
    public class FileUploadController : ApiController
    {
        public async Task<IEnumerable<string>> PostMultipartStream()
        {
            // Check we're uploading a file
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            // Create the stream provider, and tell it sort files in my c:\temp\uploads folder
            var provider = new MultipartFormDataStreamProvider("c:\\temp\\uploads");

            // Read using the stream
            var bodyparts = await Request.Content.ReadAsMultipartAsync(provider);

            // Create response.
            return provider.BodyPartFileNames.Select(kv => kv.Value);
        }
    }

}
```
You can see from line 12 that I’ve made this operation async, you’ve really got to admire the simplicity of async/await construct in .NET 4.5! In line 22 you can see that the compiler and some state machine magic allow the freeing up of the asp worker thread... (If you have read my previous posts you may be a little confused now... didn’t I say that Tasks will use the same threadpool!? [have a look at this link for someone that pondered the very same concerns](http://stackoverflow.com/questions/9772998/mvc-4-web-api-returning-tasks-from-actions))

# HTML5 Client

The client couldn’t have been easier, first a look at it in the browser:

![](/images/blog/image_thumb_173.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>ASP.NET Web API</title>
    <link href="@Url.Content("~/Content/Site.css")" rel="stylesheet" type="text/css" />
    <meta name="viewport" content="width=device-width" />
</head>
<body>
    @using (Html.BeginForm("FileUpload", "api", FormMethod.Post, new { enctype = "multipart/form-data" }))
    {
        <div>Please select some files</div>
        <input name="data" type="file" multiple>
        <input type="submit" />
    }
</body>
</html>
```
The important part above is using the enctype attribute, in fact line 10 loosely translates to:

```xml
<form action="~/api/FileUpload" enctype="multipart/form-data" method="POST">
```
Don’t believe me? Then try VS11’s awesome new feature – page inspector

Right click on the HTML and choose view in page inspector.

![](/images/blog/image_thumb_175.png)

And we’re done! Of course in the real world we’ll use ajax with a few tricks re sandbox, but here’s the response in the browser with xml.

![](/images/blog/image_thumb_174.png)

I’ll hopefully follow up with the samples for the client list below when I get to the respective development machines.

  * WinRT (C#/XAML) 
  * iPhone (Objective-C) 
  * Android (Java)

