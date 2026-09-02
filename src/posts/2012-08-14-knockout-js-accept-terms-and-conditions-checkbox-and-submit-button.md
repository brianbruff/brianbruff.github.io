---
title: "Knockout.js accept terms and conditions checkbox and submit button"
date: "2012-08-14"
category: "Front-end & JavaScript"
tags: ["knockout", "data binding"]
---

Here’s a nice way of enabling a button on a form IFF the Accept T&C checkbox has been clicked.

## Knockout script

![](/images/blog/image_thumb_209.png)

So we have a simple acceptTerms variable that is observable.

## Markup

![](/images/blog/image_thumb_210.png)

In the markup above you can see that the input of id “agree” has bound its checked state to the observable, we also see that the submit button has bound its enable state.

Pretty simple client side solution if you’re already using knockout in your application.
