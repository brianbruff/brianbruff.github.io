---
title: "Xamarin UIDeviceFamily"
date: "2013-05-17"
tags: []
---

I was releasing an app to the the Apple App store tonight (actually two apps, I've done an Atley Hunter ;-) )

One of my apps encountered a problem when I tried to upload my archive: 

"This bundle is invalid. The UIDeviceFamily key must be present when requiring a MinimumOSVersion of at least 3.2."

This did confuse me for a while, I did a bit of research and this information is supposed to be set automatically with XCode when I set the target platform. 

Given I was using Xamarin Studio I was a little unsure where I stood so i took a shot in the dark.   
I changed the platform in Xamarin to Universal and then back to iPhone/iPod problem solved,

hope this tip helps someone 
