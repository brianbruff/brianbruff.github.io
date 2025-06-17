---
title: "A magical concoction Asp,WebApi,jQuery,KenodoUi,Knockout.js,WCF,Async,Moq"
date: "2012-07-22"
tags: ["asp webapi", "jquery", "kenodUI", "Knockout.js", "Wcf", "Async", "Moq"]
---

So the heading for this post is a little bit of a mouthful, but I want to tell you a story of how some of these technologies play together, so often in blog posts we are presented with a trivial example (I’m holding my hands up here too) and what we really want to see is that next step, i.e is the tech in question just a nice concept or can it be utilized practically?

Let me tell you what I’ve come up with, the application in question could be written with any web tech and just render some static html and we’re done. But we’re moving into web 3.0 (don’t google that I’ve just coined it!), where our ajax-ey applications are going to the new level.  
We’ve all heard the stories of these 2.0 web applications that are many hundred thousand lines of code and hard to maintain, so can it be made easier? Of Course!

There are many new frameworks out these days, and to be hones it’s impossible to keep up with them all, the main thing to know is what they are for so you can investigate their effectiveness if needed; after your investigation you can decide if you want to continue the relationship a little further, in the post I will present some of the technologies I’ve encountered/like/love want to know better. I’ll explain where I used them and how, hopefully you’ll see that they play quit well together.

## WCF

I’m using WCF in the application to talk to some back end Java webservices, these webservices will supply the business objects that my web application is dealing with. I’m not sure I need to explain how I get a service reference but I’ll do so all the same, just right click on project References (or service references if that already exists) and choose the Add Service Reference Option

![](/images/./image.axd?picture=image_thumb_196.png)

Type in the location the the webservice (a Soap webservice in my case) and press Go.

![](/images/./image.axd?picture=image_thumb_197.png)

Give your service a meaningful namespace and click OK. That’s pretty much it, In my case I needed to perform addition Kerberos security configuration in the web.config but you’ll have to figure out what configuration you need for your own webservices yourself.

## RavenDB or EF Code First (undecided)

Ok I really want to use RavenDB because I’ve used it in other project and I love the document database approach, it’s got some limitations for reporting etc, but it would be a good fit for our application. Also Entity Framework Code Fist is another good approach and we do already have SqlServer licenses so that’s pretty compelling… The great thing is i can pretty much decide later ![Smile](./image.axd?picture=wlEmoticon-smile_16.png) for now I’m just writing my poco (Plain Old CLR ) objects.

## WebApi

I love this tech, _(btw: Microsoft if you’re listening please don’t break too much with the RTM version! please please)_. It allows me to offer a nice RESTFull service to my data (coming both from the WCF webservice and my application database), One of the beauties of this API is that it gives some clear direction on how to implement restfull services. MS developers previously we were faced with a decision between WCF and MVC Controllers, while it’s true now we are faced with a decision between Controllers and ApiControllers, for me it’s now clearer; I use my ApiControllers for data access, and I use my standard mvc controllers for rendering the view!

Confused? Look at this diagram

![](/images/./image.axd?picture=image_thumb_198.png)

- Here the browser makes a request, it gets routed to the MVC controller, this controller generates the html with with ever context is needed,
- Once the browser loads the page we make a ajax request to the web api, the web api in turn makes an Async request to the java webservice thereby freeing up the ASP thread pool to service other requests and providing better scalability.  
  How? : .net 4.5 **async await**

![](/images/./image.axd?picture=image_thumb_199.png)

- When the response arrives back to the await the state machine restores the context and a (possibly) new thread picks up from where the first thread left off and returns the data to the browser.

To sum up, the advantages of the above approach are:

1. A hugely more responsive experience for the end user, as compared with full page refreshes or even partial page refreshes (as in traditional Ajax).
2. The server-side UI code is extremely simple, as it needs only to transmit an initial block of markup referencing the necessary JavaScript libraries. It doesn’t need to render data.
3. Using WebAPI services as the basic data endpoint creates the opportunity to use multiple client technologies. For example, you could create a native smartphone application that connects to the same data endpoints without needing any additional server-side code.

## jQuery

The data returned in in JSON format as we queries data via jQuery $.getJson() that sets the appropriate header (content negotiation is handled via Asp MVC4 for us).

![](/images/./image.axd?picture=image_thumb_200.png)

## Knockout.js

So this is one of the frameworks I knew about but had not used before. Those of you from a Silverlight/Wpf background will be familiar with the MVVM pattern and love the raw powerfull databinding capabilities. Knockout.js is one such javascript framework.

### Markup

![](/images/./image.axd?picture=image_thumb_201.png)

### Javascript

![](/images/./image.axd?picture=image_thumb_202.png)

Above you can see that I’ve got a DataFeedsViewModel, this is the top level view model ($root) that my html is databound to, looking at it with the markup you can see that I’m rendering an unordered list of suppliers IFF there are items in my array. The observable array is used so that the UX/GUI can update should the underlying list of array items change. Each list item has a click handler that is bound to the contentClick function in the $root view model, the beauty of this is the variable ‘e’ is just the single SupplierDetail object that was clicked!! nothing to do with any DOM elements…. nice..

## KendoUI – by telerik

I’ve used telerik many times, silverlight/wpf/asp ajax etc, I also listen to lots of technical podcasts and had heard some interviews with the authors/designers of KendoUI so I decided to check it out for myself. The first control I used was the grid. Lets have a look at my markup and the associated javascript

### Markup

![](/images/./image.axd?picture=image_thumb_203.png)

### Javascript

![](/images/./image.axd?picture=image_thumb_204.png)

I’m using the revealing module pattern above to initialize my grid, you can see it’s using a kendoDataSource object to talk to the WebApi, the url parameter would be the url of my api,  
/DataFeedApi for all records  
/DataFeedApi?contentId=XXX for getting a subset of records from the WebApi

## Moq

As I mentioned above I’m using WCF, WCF is composed of three concerns, the ABCs of WCF, (Address, Binding, Contract) is simple terms the Contract is the wsdl and when we add a service reference that a .net Interface gets generated for same.

The beauty of this is that in my Unit tests I can mock this interface so I don’t need a real connection to the webservice to test my concerns. For those of you that don’t use mocking frameworks, you should, it saves you creating endless dummy classes that implement interfaces just for testing.

![](/images/./image.axd?picture=image_thumb_205.png)

Above you can see I’m mocking the interface DataContentActionsServiceType so that when I call the (It’s java hence the non standard .net naming convention IXxx)

- getAllDataSupplierInfos method that I return ECB and APX.
- getDataSupplierForCode(“APX”) returns the Netherland Stuff record.

That about sums up what I wanted to show, hope it encourages someone to start playing with any of the above technologies and see if you can leverage them in your own applications.

Brian.
