---
title: "jQuery–Preventing default link behaviour"
date: "2011-06-16"
tags: []
---

This sample shows you how to hijack the default behaviour of the anchor tag and do something different.  
The interesting part is that we use the event arg in the click function, once we have this actual arg we can call preventDefault(); on it to stop the navigation if necessary.

In this sample I just toggle the visibility of my div with a default animation (now you see it now you don’t)

     DOCTYPE html>

     <html lang="en">

     <head>

       <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

       <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js" type="text/javascript">script>


