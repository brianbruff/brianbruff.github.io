---
title: "Asyncronous WF4 activities"
date: "2011-01-02"
tags: ["wf4"]
---

Anyone that's ever written UX/GUI code will know that while it once was acceptable (unavoidable) to block the UX thread with long running operations, it's now almost always done in a background thread/task etc.

Well with WF4 it's pretty much the same story, it's not the best idea to block the workflow thread while preforming longing running operations.

Take the following example, where I make a webservice call to a server for some information, webservices can take quite some time depending on network load latency etc.

public sealed class GetCurveTenor : AsyncCodeActivity

{

public InArgument<string> CurveUri { get; set; }

public OutArgument<Dictionary<DateTime, double>> CurveDetail { get; set; }

protected override IAsyncResult BeginExecute(

AsyncCodeActivityContext context, AsyncCallback callback,

object state)

{

Func<string, Dictionary<DateTime, double>> asyncWork =

curveUri => RetrieveCurveDetail(curveUri);

context.UserState = asyncWork;

return asyncWork.BeginInvoke(

CurveUri.Get(context), callback, state);

}

protected override void EndExecute(

AsyncCodeActivityContext context, IAsyncResult result)

{

Dictionary<DateTime, double> curveDetail =

((Func<Int32, Dictionary<DateTime, double>>)

context.UserState).EndInvoke(result);

if (curveDetail != null)

{

CurveDetail.Set(context, curveDetail);

}

}

private Dictionary<DateTime, double> RetrieveCurveDetail(string curveUri)

{

Dictionary<DateTime, double> result = new Dictionary<DateTime, double>();

// Do server stuff ...

return result;

}

}

Most of the code above should be self explanatory.   
If you've not seen the "Func" syntax before it's basically just a delegate defined like this (in .NET 4)

public delegate TResult Func<in T, out TResult>(T arg); (Note the .NET 4 in modifier to indicate contravariance)  

I've used lambdas to point to delegate towards the RetrieveCurveDetails function, it's this function that gets executed on the background thread.

Hope this has been of some assistance.
