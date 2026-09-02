---
title: "Parameterized Unit Tests with JUnit"
date: "2013-07-31"
category: "Java & JVM"
tags: ["unit testing", "java"]
---

I’ve been shown a lovely little utility for testing with JUnit 4.11 whereby one can have a list of items performed as part of the single unit test.

First add the annotations you see below and set your inputs and expected outputs. (Arrange and Assert)   
![](/images/blog/image_thumb_265.png)

Then create a constructor and some static variables to store each Tuple.

![](/images/blog/image_thumb_266.png)

Then define your single unit test (the business logic is your Action).

![](/images/blog/image_thumb_267.png)

That’s it, a really nice way to have a single unit test that can be run multiple times with different parameters.

![](/images/blog/image_thumb_268.png)

If you would like to do the same sort of testing in .NET you have some choices to make.

You could use NUnit and use the TestCaseAttribute.

![](/images/blog/image_thumb_269.png)

Or if like me you prefer MSTest then you can opt for a data driven unit test.   
See this vs2013 page (has worked at least since vs2010):   
[_http://msdn.microsoft.com/en-US/library/ms182527(v=vs.120)_](http://msdn.microsoft.com/en-US/library/ms182527\(v=vs.120\))   
  
![](/images/blog/image_thumb_270.png)
