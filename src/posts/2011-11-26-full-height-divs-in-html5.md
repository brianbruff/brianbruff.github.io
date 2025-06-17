---
title: "Full height divs in html5"
date: "2011-11-26"
tags: ["height:100% html5"]
---

Hi all,

This has probably been beaten to death elsewhere, but somehow it’s the first time I’ve ever come across it.

I’m working on the LiveResume website this evening (hey it was this or watch XFactor.

Anyway, I wanted to ensure that all different views of my web app filled the screen, for example if the personal details only occupied 30% of the height, I wanted to containing div to go the whole way to the bottom of the screen given it is a different color.

This secret to this is ensuring that the parent has an explicit height or the div reverts to auto.

So lets look at the simplified sample I’ve put together.

    DOCTYPE html>

    <html>

    <head>

    head>

    <style>

    BODY {

         BACKGROUND:#ff0000; height:100%;

    }

    #one {

         BACKGROUND:#00ff00; height:100%;

    }

    #two {

         BACKGROUND:#0000ff; height:100%;

    }

    style>

    <body>

        <div id="one">

            <div id="two">

                gdxg

            div>

        div>

    body>

    <html>

This is what the rendered webpage looks like in IE9

![](/images/./image.axd?picture=image_thumb_116.png)

I was expecting the green section to be full height, I mean this always worked fine before.

## So what has happened

html5 DOCTYPE html>

requires a height on the html element too…and for whatever reason I never noticed this before.

### Solution:

Add html to the first style

![](/images/./image.axd?picture=image_thumb_117.png)

![](/images/./image.axd?picture=image_thumb_118.png)
