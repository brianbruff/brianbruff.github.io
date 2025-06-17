---
title: "So what is this – javascript"
date: "2014-05-26"
tags: []
---

To the uninitiated **this** can be really confusing in JavaScript. Consider the following:

![](/images/./image.axd?picture=image_thumb_319.png)

The code above logs **this** three times, but what is _this?_

The main source of confusion is a quirk of the language where depending on the invocation pattern this can be set to the global variable (e.g. window in a browser). But there are come other gotchas.

In the example above **this** is 3 different objects.

- Window
- ATest
- Object

## Function Invocation Patterns

In order to explain this we need to know what function invocation patterns are in JavaScript, of which there are 4.

- method
- function
- constructor
- apply/call

I’ve covered the first 3 above in my example

### Method

![](/images/./image.axd?picture=image_thumb_320.png) In the method invocation patters, the method is called bare. Javascript assigns the global variable to **this** in this instance.

### Constructor

![image](./image.axd?picture=image_thumb_321.png)In this constructor invocation pattern (i.e. new) this is assigned to the object getting created, ATest

### Function

![](/images/./image.axd?picture=image_thumb_322.png) In the function invocation pattern this is the enclosing type also, however this is just object in this case i.e. the object literal returned from ATest constructor.

### Apply

I’m not covering this here but the Apply (and the call) invocation patterns basically let you set the value of **this.**

---

**Note** : Object Literal can be avoided in this example above as follows.  
What we do is set the methods on **this** explicitly.

![](/images/./image.axd?picture=image_thumb_323.png)

---

-
