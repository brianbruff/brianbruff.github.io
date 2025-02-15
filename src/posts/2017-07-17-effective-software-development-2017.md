---
title: "Effective Software Development 2017"
date: "2017-07-17"
tags: []
---

I’ve been thinking a lot about the state of software development recently and moreover taking a step back trying to identify and articulate where I stand on past, present, future trends or concepts and define how to employ these ideas and approaches to become more effective in delivering successful production software. 

Now I’m as guilty as the next person of **Resume Driven Development** , for years I’ve chased that shiny new technology; why? well it was current, it was bleeding edge or at least cutting edge, I gorged on technical articles and videos and spend many a long night trying things out, in fact, I still do and I can’t see that ever changing. 

## Experience vs. Skill vs. Attitude

However this can lead to having a lot of experience, but _experience is cheap_ (as all that’s needed is time), _it doesn’t necessarily lead to skill_ , this is harder this you have to practise at but a lot of people can do that. But attitude. You either have it, or you don’t. The right sort of person is so passionate about coding that can’t be _stopped_ from doing it. They typically started before high school and never looked back. They write everything from assembly to JavaScript, on PCs to mobile phones, doing hard core computer graphics to high level social networking. They’ve tried everything!

For these type of people:

  * Learning becomes easier – The more one learns the easier new information takes root, it’s simple, you’re training your brain, you’ll find that you will develop an insatiable appetite for yet even more information, for tips, tricks, patterns, practises, anti patterns, frameworks… you name it…
  * Value identification – Because Netflix, Amazon, Microsoft [insert big name brand here] says it is shiny is no longer good enough! We’ve all been through this technology **hype cycle** where, something new comes out, everyone is really excited then one starts using it only to fall into the trough of disillusionment.  ![](/images//images/image_thumb_439.png)  

Once you’ve been through this cycle a few times you know what to expect and you will better qualify where you lie on this trend line when evaluating for example a new technology stack.  

## My Views

### Tooling

I grew up in Microsoft Land, if you take away my tools you’ll take away my productivity. Tooling in my view is critical to being productive. But tooling can be bad, tooling if not understood can abstract you so far away from the underlying technology you may not understand how it works, this could make a really trivial problem very hard to resolve.

The CTO of _Expensify_ once wrote an article something along the lines of “Why I will never hire a .NET developer”. From what I recall he faced some serious backlash on that post, but I understood the point he was trying to get across. I have watched many Asp.NET webforms developers struggle when that community started embracing ASP MVC. For those that don’t know ASP Web Forms to some degree abstracted away web applications so much with the likes of ViewState and Postbacks, that a junior dev would be forgiven for thinking he/she was writing a VB6 application. 

The point I’m getting to is that, if you understand how the underlying technology works, then you are in a much better position to leverage any tooling that increases productivity.

### DevOps

In my view everyone should be aware of what DevOps means, for a long time developers worked away in their own individual boxes and likewise operations, only to knock heads and point fingers when trying to deploy software. I don’t think the industry can afford to continue with this approach, everyone developing software should be at least aware of what is involved in operations, only by seeing the struggles from another viewpoint can we all work together to streamline this process and improve our products and processes.

### Language X versus Language Y

I’ve forgotten more languages than I know at this stage, but what I do know is **languages are easy.**_I think I'm qualified to say that after writing a few applications in objective-C (can I remember much of the syntax? Nope! but I have the github repos to prove it! and give me a few hours and I'll remember it all_).

**What is hard with a language is; its eco system and frameworks** , therein is where the effort lies. I grew up in C++ and loved it I gorged on it however when .NET arrived on the scene I knew its days were numbered (at least for the type of applications I was interested in). To this day C# is my favourite language. That said I also use Java day to day, and while I firmly believe it’s a less coherent language, the java ecosystem is much richer than its .NET counterpart. Which would I choose for a new project? This depends on the task I’m trying to achieve but moreover the team with whom I’d be working with and their technical capabilities. It’s good to expose yourself to different languages which will force you to learn different approaches to achieving an end goal, _be a polyglot_!

Try pick the Best language for the Job, keeping in mind there are many interpretations of what best means!

#### Static vs Dynamic Languages

A few years ago, after I’d heavily invested in my Javascript knowledge, I ended up writing a high level design document for a rather sophisticated Web application framework, I distinctly remember deliberating to no end on whether to insist on JavaScript or Typescript, the exact phrase I remember leaving my lips was “My heart says JavaScript, my Head says Typescript”, well with Hindsight, I’m glad to say my head was proven correct, I ended up prototyping and working on the initial version of that product and I firmly believe that Typescript has made large scale web applications more tolerable. I think dynamic languages are great for POC’s and early versions of products, why you can nearly type in the code and see the results in real time. However dynamic languages are harder to support, tooling is more difficult and a compile is your first unit test!

### SOAP vs REST

Unfortunately, there is a lot of misinformation and misconceptions around REST, in fact they can’t really be compared directly given one is a protocol and the other an architectural style. But If i was to go out on a limb on the general expectation of what this comparison means, then I would say choose REST.

I listened to a talk from the **Uber** CTO talking about what he learned after writing 1000 microservices, and one of his points was the REST approach requires tooling that supports building and documenting the API. One such example I have experience with is Swagger. Tooling always wins out in my book, I don’t want if at all possible to have to learn the Swagger syntax, much the same way for these last 20 years I’ve never explicitly learned WSDL, once I understand how it works and what it’s for I’ll use a tool to generate it faster and with less errors that I could ever hope to achieve.

### Clouds…

For years I’ve been saying, “bet on the web”, now I say “bet on the cloud”.

I think public clouds are the single biggest game changers in todays software industry, by lowering the barrier to entry, companies can get off the ground quickly, with limited resources and short times to market. My preference for Azure (where possible) is no secret.

A client of mine once told me how back in the .COM boom he was paying 100k $ a month to have a geo-redundant solution that involved a container up some mountain some where in the US. With the cloud the infrastructure already exists, and with a flip of a switch it’s possible, sometimes with no changes to the underlying application itself.

But sadly cloud can be used in all the wrong ways and the costs can quickly ramp up. I would suggest the following guidelines when looking at the cloud

  * If you are lifting and shifting, then you are probably doing it wrong 
  * If you stay in IaaS you are missing out on the advantages of PaaS 
  * If you use serverless, then use it correctly, don’t turn your application into one giant RPC call just to be sexy.

### Understand your Business

You may have very smart people in your business that can’t innovate as they don’t understand the big picture, identify these people and ensure they are in a position to contribute. Developers and business need to speak the same language if innovation is to be expected.

Be aware of the innovators dilemma and don’t stagnate,.

### Microservices

How many times have you heard people moving to microservice architecture to escape the problems they have with their current monolithic approach? 

Yes microservices can help one avoid some of the pitfalls of monolits however I would argue that if someone can’t write a good monolit then they won’t write a good set of microservices. Some backgrounds like the Microsoft stack naturally fit well into Microservices while other like J2EE are in stark contrast.

#### The Promise

Microservices are certainly one of the areas where people encounter the hype cycle in early attempts. They break up big application in the hope of: 

  * having greater flexibility and scalability 
  * having to ability to deploy services independently with different teams 
  * have more agility 

#### The Result

  * It is more brittle than ever before 
  * Performance is terrible 
  * Services needed to be deployed together and in specific order 
  * It was impossible to follow the flow of messages through the system. 
  * Distributed systems are HARD 
  * Eventual consistency is a paradigm shift 
  * Legacy habits created a distributed “big ball of mud” 

I’m not looking to frighten anyone, I’m pro microservice but one needs to understand what they are buying into and what approaches exist to overcome these limitations.

### Architecture 

Architecture is never just about the technology, it’s about the team, are they agile, do they “do agile” or neither, is there a DevOps culture, what are the underlying business decisions driving the change?

Keep the follow in mind when architecting a solution:

  * Keep it simple 
  * Don't build what you don’t need 
  * Don’t build what you might need 
  * TCO and ROI are important 
  * Research new approaches,   
e.g. I’d rather drink battery acid than do 2 phase commit, there are other approaches…. research them!

Always be learning! 
