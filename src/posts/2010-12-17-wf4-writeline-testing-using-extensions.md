---
title: "WF4 WriteLine testing using extensions"
date: "2010-12-17"
tags: [".net 4.0", "wf4"]
---

If you wish to test specific writelines on a console application: you can do so by adding a StringWriter object to the workflow extensions.  
The writeline activity will use the textwriter if it exists as opposed to the console.

[TestMethod]   
public void CheckWorkflowWriteLine()   
{   
var wi = new WorkflowInvoker(new HelloWorld());

//Add string writer to extensions   
var writer = new StringWriter();   
wi.Extensions.Add(writer);   
wi.Invoke();   
Assert.AreEqual("Hello Workflow", writer.ToString());   
}
