---
title: "Syncronization Context"
date: "2010-09-08"
tags: []
---

A sample of using SyncronizationContext to post a message back to the UX thread

[code:c#]

private void Window_Loaded(object sender, RoutedEventArgs e)  
{  
SynchronizationContext ctx = SynchronizationContext.Current;

ThreadPool.QueueUserWorkItem(\_ =>  
{

WebClient client = new WebClient();

string html = client.DownloadString("https://www.briankeating.net");  
ctx.Post(state =>  
{  
tbDetails.Text = (string)state;

}, html);

});

}

[/code]
