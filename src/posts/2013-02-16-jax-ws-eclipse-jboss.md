---
title: "JAX-WS, Eclipse, JBoss"
date: "2013-02-16"
category: "Java & JVM"
tags: ["jax-ws", "jboss", "wcf"]
---

Ok another Java post, they are few and far between, but I’ve already polluted this blog with Objective-C, JavaScript and other non .NET languages so why not.

So I was lying in bed last night my wife was hogging the Windows machine watching some film or other, so I’d a choice between reading 50 shades of grey or firing up my MacBook Air, no contest there…

I recently interviewed a guy that had moved from Apache Axis to JAX-WS, the way he described it sounded a lot like WCF (windows communication foundation) so I wanted to see for myself.

  * Install JBoss 7.1.1 for an application server 
  * Install Eclipse Juno IDE for Java 
  * Install Mono Develop (not necessary but I had this already for iPhone dev so thought what the heck I’ll use it for the client)

So what is JAX-WS? The Java API for XML Web Services (JAX-WS) is a Java programming language API for creating web services. It is part of the Java EE platform from Sun Microsystems. Like the other Java EE APIs, JAX-WS uses annotations. Here’s how I created a sample one.

**Ensure JBoss can run**

Start the standalone shell script and check you can see <http://localhost:8080> page below in your browser

![](/images/blog/clip_image001_1.png)

**Choose JavaEE perspective in Eclipse**

![](/images/blog/clip_image002.png)

**Create a new project in Eclipse (dynamic web)**

![](/images/blog/clip_image003.png)

**Add the following webservice class**

Complete with annotations

![](/images/blog/clip_image004.png)

**Modify web.xml**

Add the highlighted section

![](/images/blog/clip_image005.png)

**Configure the Local JBoss server in Eclipse**

Right click on the server you added and choose Add/Remove

![](/images/blog/clip_image006.png)

**Add your deployment**

![](/images/blog/clip_image007.png)

Add your current deployment   
![](/images/blog/clip_image008.png)

**Start Application Server**

Click on the Play button in the server tab toolbar, you should be automatically switched to the Console pane in Eclipse. Take note that your DynamicTest war file is deployed.

![](/images/blog/clip_image009.png)

**Review the JBoss Admin Console**

Specifically the Webservice Endpoints, you should see your webservice deployed here.

![](/images/blog/clip_image010.png)

You can also browse to the wsdl

![](/images/blog/clip_image011.png)

**Create your client**

I used C# with the Mono Develop IDE to create a simple Console Application

![](/images/blog/clip_image012.png)

Just add a Webservice the way you would in Visual Studio (I went for .NET 2.0 WS because the WCF version didn’t create an app.config for me (Visual Studio you spoil me)).

**Run**

![](/images/blog/clip_image013.png)

And that’s it, your first JAX-WS! (and not a Windows machine in sight... I feel dirty but I like it :-) )

=== UPDATE ===

Ok after reading a lot of blogs and a few weeks later I've found a nicer way of doing it.

Instead of editing the XML you can choose to add a new webservice and select your webservice class (note screens below are not for the same project but are functionally the same).

![](/images/blog/2013/3/Screen_Shot_2013-03-22_at_22.08.37.png)

![](/images/blog/2013/3/Screen_Shot_2013-03-22_at_22.09.12.png)

![](/images/blog/2013/3/Screen_Shot_2013-03-22_at_22.15.45.png)
