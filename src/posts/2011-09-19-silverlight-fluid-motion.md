---
title: "Silverlight Fluid Motion"
date: "2011-09-19"
tags: ["expression blend silverlight animation"]
---

You know what?   
I love Silverlight!

The only reason I don’t spend more time in it is the ASP is more suited to non enterprise applications.   
However tonight for you dear reader I’ve got an enterprise application (below)

![](/images/./image.axd?picture=image_thumb_90.png)

(because every enterprise had an application that shows pictures ![Smile](./image.axd?picture=wlEmoticon-smile_9.png); yes really this was a requirement honest ![Be right back](./image.axd?picture=wlEmoticon-berightback.png))

# Blend

So you are writing a sliverlight app, or course you could code it all by hand.

In the last year, I’ve even met Silverlight/WPF programmers, lets call them Xamlers, that turn their nose up at using a designer, hey I’m sure it’s got it’s advantages and these people know XAML better than me, but IMO life is too short and programmers are too expensive to be living in notepad. Would you code your designer code in a windows forms app? not use scaffolding in MVC? etc etc..

For me Blend is blessing in disguise, I’m not sure the mythical devigner that is both an amazing designer AND an amazing coder (term coined by Scott Hanselman I think) exists, but Blend does really help.

# Overview

The application is simple, It selects some pictures in a folder and displays them in a list. When an item is selected in the list the picture should zoom out from the listbox item and scale to it’s full size.

Simple ey… yes of course (when you know how).

# Steps

### 1\. Create a new expression blend silverlight project

![](/images/./image.axd?picture=image_thumb_91.png)

### 2\. Add a sample datasource, some text and a picture

![](/images/./image.axd?picture=image_thumb_92.png)

![](/images/./image.axd?picture=image_thumb_93.png)

![](/images/./image.axd?picture=image_thumb_94.png)

### 3\. Drag the collection onto the page

### ![](/images/./image.axd?picture=image_thumb_95.png)

### 4) Select details mode in the properties pane, and drag out property 2

![](/images/./image.axd?picture=image_thumb_96.png)

![](/images/./image.axd?picture=image_thumb_97.png)

If you were now to run your application you’d see that when you select a picture it appears in the main picture also. But our requirements were to slide out the picture from the list itself.

### 5) Select the big picture and drag fluid move behaviour onto it

![](/images/./image.axd?picture=image_thumb_98.png)

### 6) Change the tag property to datacontext

![](/images/./image.axd?picture=image_thumb_99.png)

Now do the same for the Itemtemplate

![](/images/./image.axd?picture=image_thumb_100.png)

### 7) Drop a FluidMotionSetTagBehaviour onto the image part,setting the datacontext

![](/images/./image.axd?picture=image_thumb_101.png)

That’s all that’s needed, you app should now run, animations and all.

![](/images/./image.axd?picture=image_thumb_102.png)

I would provide the sample but I’ve used 11megs of pictures so it’s a little too big to expect you to wait for ![Smile](./image.axd?picture=wlEmoticon-smile_9.png)

I might get some time to reproduce this app in html5, android, c++, java would be nice to compare and contrast.

Start blending xamlers!
