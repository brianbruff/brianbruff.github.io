---
title: "The happy life of a web developer"
date: "2011-05-09"
tags: []
---

Spent some of the weekend mucking about with getting a website to go with an iPhone and WP7 app I’m developing with one mister Tomas McGuinness, the whole idea is a wonderful combination of the MS stack of love with a bit of xcode thrown in for good measure.

What better way to experience new tech than to come up with a pet project and get stuck in, so far we’ve gotten down and dirty with

- MS Sync Framework: the backbone of our interoperability using OData and WCF Services.
- WP7 Silverlight : The windows phone app
- Silverlight Ria services: The rich internet application that also runs OOB (out of the browser on the desktop)
- MVC JQuery Ajax.
- Html 5: (low level stuff just now but really excited about this)
- XCode: iPhone app.
- IE9 Jump lists: quick site navigation.

Dusted off the old Photoshop shortcut, to modify a template and apply it to our MVC application, and it’s been a hell of a lot of fun, jQuery is pretty impressive at the visual end too, animations etc. are trivial and a joy to play with.

Site coming to an internet near you soon (if we manage to get some free time).

![](/images//blog/image.axd?picture=image_thumb_52.png)

Now the techie bit, a sample how to slide in a panel/div.

    @{

        ViewBag.Title1 = "Grass";

        ViewBag.Title2 = "Manager";

    }

    @section head {

        @*BEK: Add some animation using jquery*@

    }

@section is used to inject some scripts into the head of the html page.

Then you see a little bit of jQuery that hides the div “Welcome to iFarm” in the screenshot above and slide it in from top
