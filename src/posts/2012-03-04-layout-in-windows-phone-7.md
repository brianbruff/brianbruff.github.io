---
title: "Layout in Windows Phone 7"
date: "2012-03-04"
category: "Mobile"
tags: ["windows phone", "silverlight", "expression blend"]
---

So my wife left me for a hen weekend and I needed something to do with my time.   
Friday night I dedicated to my real work to clear my conscience and then I went to play.

## Windows 8

I spent a few frustrating hours on Saturday working on a Win8 application to complement a certain website, frustrating… in so far as the XAML designer in VS11/Blend on Windows 8 hangs like a good one. Actually at several points in time I considered changing my app to html5/js, because, for at least for the search section of the app I could see no blockers. However I want to add some pretty nifty features going forward and I don’t feel like implementing them in JavaScript.   
I guess I may the possibility of writing them in C++/C# as a library and using this from the UX application if it continues to slow me down. I’ll have to consider cutting my losses soon if it keeps hanging the development environment that’s for sure (the joys of working with not only a Beta application, but a beta OS!)

## WP7

So for a bit of fresh air I started writing the WP7 app, at least this is more familiar ground to me having written quite a few of them already, and I just took my resource dictionaries from the WinRT app. To start with I just used some sample data in Expression Blend, dropped on a list box and bound my sample data to it.

![](/images/blog/image_thumb_162.png)

But the layout wasn’t really what I wanted. I’m hoping that the API for the real data may provide me with a list of categories, one wouldn’t really want to have to release a new app every time a new section was added would they.   
So my approach would be just to bind the data to a list for now (it may well turn out to be an ordered list in the API). The problem as you can see above was that I was getting a single row for each item... not what I wanted.

Would you believe this was the first time I’ve not wanted this default layout in a WP7 app, so I decided to use the WrapPanel container that I’ve previously used in a WPF app… but alas it doesn’t exist out of the box!

### Silverlight WP7 Toolkit to the rescue.

A quick Google indicated that the WP7 toolkit had the WrapPanel I was looking for, I fired up the Nuget package manager and added it to my project.

![](/images/blog/image_thumb_163.png)

### Items Panel

One more change was needed in my XAML, I needed to specify where to use this wrap panel.   
This I specified in the ItemsPanelTemplate of the listbox in question.

![](/images/blog/image_thumb_164.png)

The final result!

![](/images/blog/image_thumb_165.png)

Hopefully this helps someone else out.
