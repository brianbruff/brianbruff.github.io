---
title: "JAX-WS, Eclipse, JBoss"
date: "2013-02-16"
tags: ["Java", "JBoss", "Eclipse", "JAX-WS"]
---

Ok another Java post, they are few and far between, but I’ve already polluted this blog with objective-c, javascript and other non .net languages so why not.

So I was lying in bed last night my wife was hogging the windows machine watching some film or other, so I’d a choice between reading 50 shades of grey or firing up my mac book air, no contest there…

I recently interviewed a guy that had moved from Apache Axis to JAX-WS, the way he described it sounded a lot like WCF (windows communication foundation) so I wanted to see for myself.

- Install Jboss 7.1.1 for an application server
- Install Eclipse juno IDE for Java
- Install Mono Develop (not necessary but i had this already for iPhone dev so thought what the heck I’ll use it for the client)

So what is JAX-WS? The Java API for XML Web Services (JAX-WS) is a Java programming language API for creating web services. It is part of the Java EE platform from Sun Microsystems. Like the other Java EE APIs, JAX-WS uses annotations. Here’s how I created a sample one.

**Ensure JBoss can run**

Start the standalone shell script and check you can see <http://localhost:8080> page below in your browser

![](/images/./image.axd?picture=clip_image001_1.png)

**Choose JavaEE perspective in Eclipse**

![](/images/./image.axd?picture=clip_image002.png)

**Create a new project in Eclipse\*\***(dynamic web)\*\*

![](/images/./image.axd?picture=clip_image003.png)

**Add the following webservice class**

Complete with annotations

![](/images/./image.axd?picture=clip_image004.png)

**Modify web.xml**

Add the highlighted section

![](/images/./image.axd?picture=clip_image005.png)

**Configure the Local JBoss server in eclipse**

Right click on the server you added and choose Add/Remove

![](/images/./image.axd?picture=clip_image006.png)

**Add your deployment**

![](/images/./image.axd?picture=clip_image007.png)

Add your current deployment  
![](/images/./image.axd?picture=clip_image008.png)

**Start Application Server**

Click on the Play button in the server tab toolbar, you should be automatically switched to the Console pane in Eclipse. Take note that your DynamicTest war file is deployed.

![](/images/./image.axd?picture=clip_image009.png)

**Review the JBoss Admin Console**

Specifically the Webservice Endpoints, You should see your webservice deployed here.

![](/images/./image.axd?picture=clip_image010.png)

You can also browse to the wsdl

![](/images/./image.axd?picture=clip_image011.png)

**Create your client**

I used C# with the Mono Develop IDE to create a simple Console Application

![](/images/./image.axd?picture=clip_image012.png)

Just add a Webservice the way you would in Visual Studio (I went for .net 2.0 WS because the WCF version didn’t create an app.config for me (visual studio you spoil me)).

**Run**

![](/images/./image.axd?picture=clip_image013.png)

And that’s it your first JAX-WS! (and not a windows machine in sight.. I feel dirty but I like it :-) )

=== UPDATE ===

Ok after reading a lot of blogs and a few weeks later i've found a nicer way of doing it.

Instead of editing the xml you can choose to add a new webservice and select your webservice class (note screens below are not for the same project but are functionaly the same

![](/image.axd?picture=2013%2f3%2fScreen+Shot+2013-03-22+at+22.08.37.png)

![](/image.axd?picture=2013%2f3%2fScreen+Shot+2013-03-22+at+22.09.12.png)

![](/image.axd?picture=2013%2f3%2fScreen+Shot+2013-03-22+at+22.15.45.png)
