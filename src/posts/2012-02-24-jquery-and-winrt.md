---
title: "jQuery and WinRT"
date: "2012-02-24"
tags: []
---

As part of this WinRT comparison I’m doing, I next need to recreate my apps in html+js.

This is my first WinRT app I’ve written in html+js and right off the mark I hit a problem with the WinRT sandbox. These days I won’t write a web app without jQuery it’s just awesome. so I wanted it in my app.

My first instinct was to use Nuget to bring down jQuery for me, but alas no Nuget extension that I could find for vs11, so next easiest step was to use the CDN. ![Sad smile](./image.axd?picture=wlEmoticon-sadsmile_2.png) doesn’t work.

So I go to jQuery.com, download it, and then use add the local script, now it all works.

![](/images/./image.axd?picture=image_thumb_158.png)

hopefully this post might save someone a few minutes of head scratching.
