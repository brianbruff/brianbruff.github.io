---
title: "A magical concoction ASP, Web API, jQuery, Kendo UI, Knockout.js, WCF, Async, Moq"
date: "2012-07-22"
category: "Web & APIs"
tags: ["web api", "knockout", "kendo ui", "wcf"]
---

So the heading for this post is a little bit of a mouthful, but I want to tell you a story of how some of these technologies play together, so often in blog posts we are presented with a trivial example (I’m holding my hands up here too) and what we really want to see is that next step, i.e. is the tech in question just a nice concept or can it be utilized practically?

Let me tell you what I’ve come up with, the application in question could be written with any web tech and just render some static HTML and we’re done. But we’re moving into web 3.0 (don’t google that I’ve just coined it!), where our ajax-ey applications are going to the new level.   
We’ve all heard the stories of these 2.0 web applications that are many hundred thousand lines of code and hard to maintain, so can it be made easier? Of course!

There are many new frameworks out these days, and to be honest it’s impossible to keep up with them all, the main thing to know is what they are for so you can investigate their effectiveness if needed; after your investigation you can decide if you want to continue the relationship a little further, in the post I will present some of the technologies I’ve encountered/like/love want to know better. I’ll explain where I used them and how, hopefully you’ll see that they play quite well together.

## WCF

I’m using WCF in the application to talk to some back end Java webservices, these webservices will supply the business objects that my web application is dealing with. I’m not sure I need to explain how I get a service reference but I’ll do so all the same, just right click on project References (or service references if that already exists) and choose the Add Service Reference Option.

![](/images/blog/image_thumb_196.png)

Type in the location of the webservice (a Soap webservice in my case) and press Go.

![](/images/blog/image_thumb_197.png)

Give your service a meaningful namespace and click OK. That’s pretty much it, in my case I needed to perform additional Kerberos security configuration in the web.config but you’ll have to figure out what configuration you need for your own webservices yourself.

## RavenDB or EF Code First (undecided)

Ok I really want to use RavenDB because I’ve used it in other projects and I love the document database approach, it’s got some limitations for reporting etc, but it would be a good fit for our application. Also Entity Framework Code First is another good approach and we do already have SQL Server licenses so that’s pretty compelling… The great thing is I can pretty much decide later. For now I’m just writing my poco (Plain Old CLR) objects.

## Web API

I love this tech, _(btw: Microsoft if you’re listening please don’t break too much with the RTM version! please please)_. It allows me to offer a nice RESTful service to my data (coming both from the WCF webservice and my application database). One of the beauties of this API is that it gives some clear direction on how to implement RESTful services. MS developers previously we were faced with a decision between WCF and MVC Controllers, while it’s true now we are faced with a decision between Controllers and ApiControllers, for me it’s now clearer; I use my ApiControllers for data access, and I use my standard MVC controllers for rendering the view!

Confused? Look at this diagram.

![](/images/blog/image_thumb_198.png)

  * Here the browser makes a request, it gets routed to the MVC controller, this controller generates the HTML with whatever context is needed.
  * Once the browser loads the page we make an ajax request to the Web API, the Web API in turn makes an Async request to the Java webservice thereby freeing up the ASP thread pool to service other requests and providing better scalability.   
How?: .NET 4.5 **async/await**   
  
![](/images/blog/image_thumb_199.png)
  * When the response arrives back to the await the state machine restores the context and a (possibly) new thread picks up from where the first thread left off and returns the data to the browser. 

To sum up, the advantages of the above approach are:

  1. A hugely more responsive experience for the end user, as compared with full page refreshes or even partial page refreshes (as in traditional Ajax).
  2. The server-side UI code is extremely simple, as it needs only to transmit an initial block of markup referencing the necessary JavaScript libraries. It doesn’t need to render data.
  3. Using WebAPI services as the basic data endpoint creates the opportunity to use multiple client technologies. For example, you could create a native smartphone application that connects to the same data endpoints without needing any additional server-side code.

## jQuery

The data returned is in JSON format as we query data via jQuery $.getJson() that sets the appropriate header (content negotiation is handled via ASP MVC4 for us).   
  
![](/images/blog/image_thumb_200.png)

## Knockout.js

So this is one of the frameworks I knew about but had not used before. Those of you from a Silverlight/WPF background will be familiar with the MVVM pattern and love the raw powerful databinding capabilities. Knockout.js is one such JavaScript framework.

### Markup

![](/images/blog/image_thumb_201.png)

### JavaScript

![](/images/blog/image_thumb_202.png)

Above you can see that I’ve got a DataFeedsViewModel, this is the top level view model ($root) that my html is databound to, looking at it with the markup you can see that I’m rendering an unordered list of suppliers IFF there are items in my array. The observable array is used so that the UX/GUI can update should the underlying list of array items change. Each list item has a click handler that is bound to the contentClick function in the $root view model, the beauty of this is the variable ‘e’ is just the single SupplierDetail object that was clicked!! Nothing to do with any DOM elements... nice...

## Kendo UI – by Telerik

I’ve used Telerik many times, Silverlight/WPF/ASP ajax etc, I also listen to lots of technical podcasts and had heard some interviews with the authors/designers of Kendo UI so I decided to check it out for myself. The first control I used was the grid. Let’s have a look at my markup and the associated JavaScript.

### Markup

![](/images/blog/image_thumb_203.png)

### JavaScript

![](/images/blog/image_thumb_204.png)

I’m using the revealing module pattern above to initialize my grid, you can see it’s using a kendoDataSource object to talk to the Web API, the url parameter would be the url of my api,   
/DataFeedApi for all records   
/DataFeedApi?contentId=XXX for getting a subset of records from the WebApi

## Moq

As I mentioned above I’m using WCF, WCF is composed of three concerns, the ABCs of WCF, (Address, Binding, Contract) in simple terms the Contract is the wsdl and when we add a service reference a .NET Interface gets generated for same.

The beauty of this is that in my Unit tests I can mock this interface so I don’t need a real connection to the webservice to test my concerns. For those of you that don’t use mocking frameworks, you should, it saves you creating endless dummy classes that implement interfaces just for testing.

![](/images/blog/image_thumb_205.png)

Above you can see I’m mocking the interface DataContentActionsServiceType so that when I call the (It’s Java hence the non standard .NET naming convention IXxx)

  * getAllDataSupplierInfos method that I return ECB and APX. 
  * getDataSupplierForCode(“APX”) returns the Netherland Stuff record. 

That about sums up what I wanted to show, hope it encourages someone to start playing with any of the above technologies and see if you can leverage them in your own applications.

Brian.
