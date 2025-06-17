---
title: "Resource Cleanup and Lambda Expressions"
date: "2009-11-03"
tags: ["c# 3.0"]
---

A neat way of always cleaning up resources is to use Lambdas as data.

Take the following

## Source

[code:c#]

internal interface ITryCatchReport  
{  
void Try(Action action);  
}

internal class TryCatchReport : ITryCatchReport  
{  
public TryCatchReport(IServer server)  
{  
\_server = server;  
}

public void Try(Action action)  
{  
try  
{  
action(\_server);  
}  
catch (Exception e)  
{  
Trace.WriteLine(e.Message);  
// Clean up resources  
// Report errors  
}  
}

private IServer \_server;  
}

[/code]

## Usage

[code:c#]

TryCatchReport safeInvoker = new TryCatchReport(\_data.Server);  
safeInvoker.Try(x =>  
{  
x.MakeInterfaceCall();  
});

[/code]

We are now guaranteed that in the case of an exception that the resources will get cleaned up.

## Usage with code blocks

If you wish to execute many statements in the action look at this sample.

[code:c#]

private List GetActionDefinitions()  
{  
if (\_actionDefinitions == null)  
{  
safeInvoker.Try(x =>  
{  
x.Do1();  
x.DoSomething();  
OtherFunc();  
});  
}

return \_actionDefinitions;  
}

[/code]
