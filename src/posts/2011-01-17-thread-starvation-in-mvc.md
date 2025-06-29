---
title: "Thread starvation in MVC"
date: "2011-01-17"
tags: []
---

On IIS, the .NET Framework maintains a pool of threads that are used to service ASP.NET requests. When a request arrives, a thread from the pool is dispatched to process that request. If the request is processed synchronously, the thread that processes the request is blocked while the request is being processed, and that thread cannot service another request.

This is generally not a problem insofar as ASP.net may have enough threads (depending on version) to accommodate a few blocked threads, however when all threads are blocked you’ll see a 503 http error presented – now in thread starvation.

Firstly, lets talk about standard asp.NET, how can we overcome this problem?

Seasoned .NET developers may attempt to begin invoke on a delegate (using lambdas these days ![Hot smile](/blog/image.axd?picture=wlEmoticon-hotsmile_1.png)) or use the ThreadPool.QueueUserWorkItem, however both these approaches are futile as the both draw from the same thread pool as asp.NET ![Confused smile](/blog/image.axd?picture=wlEmoticon-confusedsmile.png)

Another naïve approach would be to serve up your own thread, think about this for a second, your website is there to handle multiple requests…! Needless to say it could promptly run out of resources as a new thread would be created for each request.

The asp.NET solution is to use async pages , <%@ Page Async=”true” …> / Page.AddOnPreRenderCompleteAsync 

So what about mvc?

# MVC – Async Actions

![](/images//blog/image.axd?picture=clip_image001_thumb.png)

  1. The Web server gets a thread from the thread pool (the worker thread) and schedules it to handle an incoming request. This worker thread initiates an asynchronous operation. 

  1. The worker thread is returned to the thread pool to service another Web request. 

  1. When the asynchronous operation is complete, it notifies ASP.NET. 
  2. The Web server gets a worker thread from the thread pool (which might be a different thread from the thread that started the asynchronous operation) to process the remainder of the request, including rendering the response. 

SYNC

public class PortalController: Controller {   
public ActionResult News(string city) {   
NewsService newsService = new NewsService();   
ViewStringModel headlines = newsService.GetHeadlines(city);   
return View(headlines);   
}   
}

ASYNC

public class PortalController : AsyncController {   
public void NewsAsync(string city) {

AsyncManager.OutstandingOperations.Increment();   
NewsService newsService = new NewsService();   
newsService.GetHeadlinesCompleted += (sender, e) =>   
{   
AsyncManager.Parameters["headlines"] = e.Value;   
AsyncManager.OutstandingOperations.Decrement();   
};   
newsService.GetHeadlinesAsync(city);   
}

public ActionResult NewsCompleted(string[] headlines) {   
return View("News", new ViewStringModel   
{   
NewsHeadlines = headlines   
});   
}   
}

Note:

  1. New derivation 
  2. Matching Async/Completed calls 

