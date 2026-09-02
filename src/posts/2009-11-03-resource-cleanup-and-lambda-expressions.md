---
title: "Resource Cleanup and Lambda Expressions"
date: "2009-11-03"
category: ".NET & C#"
tags: ["lambdas", "design patterns"]
---

A neat way of always cleaning up resources is to use Lambdas as data.

Take the following.

## Source

```csharp
    internal interface ITryCatchReport
    {
        void Try(Action<IServer> action);
    }

    internal class TryCatchReport : ITryCatchReport
    {
        public TryCatchReport(IServer server)
        {
            _server = server;
        }

        public void Try(Action<IServer> action)
        {
            try
            {
                action(_server);
            }
            catch (Exception e)
            {
                Trace.WriteLine(e.Message);
                // Clean up resources
                // Report errors
            }
        }

        private IServer _server;
    }
```
## Usage

```csharp
TryCatchReport safeInvoker = new TryCatchReport(_data.Server);
safeInvoker.Try(x =>
{
 x.MakeInterfaceCall();
});
```
We are now guaranteed that in the case of an exception the resources will get cleaned up.

## Usage with code blocks

If you wish to execute many statements in the action look at this sample.

```csharp
 private List<WFActionDefinition> GetActionDefinitions()
{
    if (_actionDefinitions == null)
    {
        safeInvoker.Try(x =>
            {
                x.Do1();
                x.DoSomething();
                OtherFunc();
            });
    }

    return _actionDefinitions;
}
```