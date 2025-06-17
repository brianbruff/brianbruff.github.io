---
title: "Async MVC Controllers"
date: "2012-03-14"
tags: ["MVC4 AsyncControllers"]
---

I previously wrote a [post on MVC async controllers](/post/2011/01/17/Thread-starvation-in-MVC.aspx). Now I want to follow up on something that’s more cutting edge, unfortunately I’m one of those people that like nosing about with what new, how it will affect me and how I could leverage it in future etc., Often, I’ll readily admit it’s more bleeding edge than cutting edge (xaml support in Blend5 for example ![Thumbs down](./image.axd?picture=wlEmoticon-thumbsdown.png)).

However in this post I want to show you something that you might agree is pretty nice.

### A historical example

So lets take a look at the app we’re trying to build.

Client is a simple web form (yes it’s webforms but I’m trying to catch the non MVC microsofties too), the instruments are entered in the text box, fetch button is clicked and the result is output

![](/images/./image.axd?picture=image_thumb1_thumb.png)

Now the workflow, for the purpose of this test I won’t be connecting to any database webservice etc, I’ve just added a delay of 10 seconds and and assign LastClose to RIC & " " & New Random().NextDouble()

![](/images/./image.axd?picture=image_thumb4_thumb.png)

Here’s the code behind for the **non-async** button event handler

            protected void Button1_Click(object sender, EventArgs e)

            {

                Contract.Requires(!string.IsNullOrWhiteSpace(tbInst1.Text) || !string.IsNullOrWhiteSpace(tbInst2.Text), "Please enter values for instruments");

                // Make the call to the workflow to get the close for each instrument

                try

                {

                    var args = new Dictionary<string, object>();

                    args.Add("RIC", tbInst1.Text);

                    var res = WorkflowInvoker.Invoke(_getPricesWFDefinition, args);

                    Label1.Text = res["LastClose"].ToString();

                    args.Clear();

                    args.Add("RIC", tbInst2.Text);

                    res = WorkflowInvoker.Invoke(_getPricesWFDefinition, args);

                    Label2.Text = res["LastClose"].ToString();

                }

                catch (Exception exp)

                {

                    Trace.Warn(exp.Message);

                }

            }

So as you can see, we’re waiting at least 20 seconds for our page to return, **nasty**.  
In theory we should be able to bring this down to 10 seconds as we can make the calls to the workflows in parallel.

Let me show you one way to “incorrectly” achieve this

            private void Option1()

            {

                var t1 = Option1TaskCreater(tbInst1, Label1);

                var t2 = Option1TaskCreater(tbInst2, Label2);

                Task.WaitAll(t1, t2);

            }

            private Task Option1TaskCreater(TextBox tb, Label lb)

            {

                var t1 = Task.Factory.StartNew(() =>

                {

                    var args = new Dictionary<string, object>();

                    args.Add("RIC", tb.Text);

                    var res = WorkflowInvoker.Invoke(_getPricesWFDefinition, args);

                    lb.Text = res["LastClose"].ToString();

                });

                return t1;

            }

So we’re using the task library to make the two workflow requests async, and results look promising, down to about 10 seconds now… so any problems with doing this?

Well, tasks use threadpool threads to execute. So, the query will execute on a threadpool thread. To get true asynchronous execution(no worker threads blocked), we need to jump through a few more hoops. For webform people, there’s a very [good explanation here](http://msdn.microsoft.com/en-us/magazine/cc163725.aspx). MVC people read on!

## But Why/When use async?

The response to this question has been discussed many times in both books and magazines. ASP.NET uses threads from a common language runtime (CLR) thread pool to process requests. As long as there are threads available in the thread pool, ASP.NET has no trouble dispatching incoming requests. But once the thread pool becomes saturated-that is, all the threads inside it are busy processing requests and no free threads remain-new requests have to wait for threads to become free. If the jam becomes severe enough and the queue fills to capacity, ASP.NET throws up its hands and responds with a "Server Unavailable" to new requests.

Often to solve the problem of horizontal scalability more servers are added to the webfarm, however this only provided temporary relief to what in fact is an underlying design problem, it’s not a case of adding more processors(threads) but a case of using the threads more efficiently, as you can see from the diagram below, if you are CPU bound, there is little more you can do but add some more servers.

![](/images/./image.axd?picture=image_thumb2_thumb.png)

So what is this telling us? Basically, if your app is I/O bound then you should use parallelism, if requests are computationally cheap to process, then parallelism is probably an unnecessary overhead.

If the incoming request rate is high, then adding more parallelism will likely yield few benefits and could actually decrease performance, since the incoming rate of work may be high enough to keep the CPUs busy.

If the incoming request rate is low, then the Web application could benefit from parallelism by using the idle CPU cycles to speed up the processing of an individual request. We can use either PLINQ or TPL (either Parallel loops or the Task class) to parallelize the computation over all the processors. Note that by default, however, the PLINQ implementation in .NET 4 will tie-up one ThreadPool worker per processor for the entire execution of the query. As such, it should only be used in Web applications that see few but expensive requests.

## MVC4

In MVC4 it becomes even easier that my previous post on AsyncControllers, actually to me it looks quite like the WinRT async calls in .net 4.5 and C#5

### Sample using task support for asynchronous controllers

You can now write asynchronous action methods as single methods that return an object of type _Task_ or _Task_.

e.g.

    public async Task Index(string city)

    {

        var newsService = new NewsService();

        var sportsService = new SportsService();

        return View("Common",

                    new PortalViewModel

                    {

                        NewsHeadlines = await newsService.GetHeadlinesAsync(),

                        SportsScores = await sportsService.GetScoresAsync()

                    });

    }

In the previous action method, the calls to _newsService.GetHeadlinesAsync_ and _sportsService.GetScoresAsync_ are called asynchronously and do not block a thread from the thread pool.

Asynchronous action methods that return _Task_ instances can also support timeouts. To make your action method cancellable, add a parameter of type _CancellationToken_ to the action method signature. The following example shows an asynchronous action method that has a timeout of 2500 milliseconds and that displays a _TimedOut_ view to the client if a timeout occurs.

    [AsyncTimeout(2500)]

    [HandleError(ExceptionType = typeof(TaskCanceledException), View = "TimedOut")]

    public async Task Index(string city, CancellationToken cancellationToken)

    {

        var newsService = new NewsService();

        var sportsService = new SportsService();

        return View("Common",

            new PortalViewModel

            {

                NewsHeadlines = await newsService.GetHeadlinesAsync(cancellationToken),

                SportsScores = await sportsService.GetScoresAsync(cancellationToken)

            });

    }

## Conculsion

MVC4 Makes programming of async controllers even easier.
