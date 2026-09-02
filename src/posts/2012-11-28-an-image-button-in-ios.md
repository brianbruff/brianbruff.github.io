---
title: "An image button in iOS"
date: "2012-11-28"
category: "Mobile"
tags: ["ios", "objective-c"]
---

So as I wait for my second iPhone application to be approved by the Apple store, I start to wonder a few little things. How can I improve my existing apps through functionality and user experience?

Given I’m pretty much a noob with iOS dev still compared to most other languages/platforms I know, you’ll have to pardon me if I’m giving you a bum steer!

I did consider a few options before proceeding down this route:

  * Subclassing UIImageView and handling the touches once I’d enabled interaction, 
  * Subclassing UIImageView and using a gesture recogniser

However I found the following method really simple.

# Where we are going

Here we see a picture of the iPhone simulator showing my button with an image, this is what we are going to produce.

![](/images/blog/Screen_Shot_2012-11-28_at_22.49.00_thumb.png)

# How we got there

I fired up photoshop and created a 32x32 png8 for this image, don’t try to figure out what it’s supposed to be, it’s just random drawing…

I then dragged this testButton.png I created to my XCode project.

![](/images/blog/Screen_Shot_2012-11-28_at_22.38.55_thumb.png)

Next in the XCode project you’re working on, drop a button onto a view in your storyboard/nib, we’re going for image only, so change type to Custom and remove the default title. If you lose selection you can regain it by selecting the button in the ViewController Scene on the left hand side.

![](/images/blog/Screen_Shot_2012-11-28_at_22.39.39_thumb.png)

So next some code, first of all, right click (ctrl+click) and drag the button onto the ViewController header file (use the assistant editor to help you), we want to create an IBOutlet so we can reference this button.

![](/images/blog/image_thumb_231.png)

Now we’re nearly there, just one line of code to set the image for the normal state.

![](/images/blog/Screen_Shot_2012-11-28_at_22.41.12_thumb.png)

That’s pretty much it… I could subclass all this into a UIImageButton but it’s probably overkill unless I go to the hassle of plugging into the XCode designer for image selection etc… something for another day perhaps...

## Edit

I did say I was a noob yes? Well I quickly came across a problem with the above method in that designing the application became a little difficult setting the coordinates given I had to run the app to see where my button was, not ideal when I'm slicing in parts of my UX.

There's an easier way to select the image for the button... set the background in the property tab!!!! (highlighted below in red)

![](/images/blog/2012/12/ipipe.png)
