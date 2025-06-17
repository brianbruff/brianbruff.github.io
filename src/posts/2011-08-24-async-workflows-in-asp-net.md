---
title: "Async Workflows in ASP.net"
date: "2011-08-24"
tags: []
---

So tonight I’m going to show you one way on calling async workflows from ASP.net. I’ve decided to use web forms this time as I’m living in MVC land and it’ll help me keep the finger in.

So lets take a look at the app we’re trying to build

Client is a simple web form, the instruments are entered in the text box, fetch button is clicked and the result is output

![](/images/./image.axd?picture=image_thumb_83.png)

Now the workflow, for the purpose of this test I won’t be connecting to any database webservice etc, I’ve just added a delay of 10 seconds and and assign the value of LastClose to

    RIC & " " & New Random().NextDouble()

![](/images/./image.axd?picture=image_thumb_84.png)

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

So as you can see, we’re waiting at least 20 seconds for our page to return, nasty. In theory we should be able to bring this down to 10 seconds as we can make the calls to the workflows async.

Let me show you some options.

## Option 1

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

Well, tasks use threadpool threads to execute. So, the query will execute on a threadpool thread. To get true asynchronous execution(no worker threads blocked), we need to jump a little higher.

You may ask yourself when should you choose an asynchronous programming model (APM)?

![](/images/./image.axd?picture=image_thumb_85.png)

So what is this telling us? Basically, if your app is I/O bound then you should use parallelism, if requests are computationally cheap to process, then parallelism is probably an unnecessary overhead.

If the incoming request rate is high, then adding more parallelism will likely yield few benefits and could actually decrease performance, since the incoming rate of work may be high enough to keep the CPUs busy.

If the incoming request rate is low, then the Web application could benefit from parallelism by using the idle CPU cycles to speed up the processing of an individual request. We can use either PLINQ or TPL (either Parallel loops or the Task class) to parallelize the computation over all the processors. Note that by default, however, the PLINQ implementation in .NET 4 will tie-up one ThreadPool worker per processor for the entire execution of the query. As such, it should only be used in Web applications that see few but expensive requests.
