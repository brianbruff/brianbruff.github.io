---
title: "Sql Server Compact Edition"
date: "2010-01-26"
tags: []
---

I've been playing with a workflow service hosted here [/PSService/PSService.svc  
](/PSService/PSService.svc)Feel free to give it a bash _[August 2012, removed]_) Endpoint is using basic http binding.

Tonight I whipped a Sql Server Compact Database out of another little app I have lying around so I could sit it behind the webservice persist data.

## But

To my horror it doesn't work..

I get the following exception " sql compact is not intended for asp.net development"

I can imagine why I guess.. bit what a pity.. it's not allowed..

_[August 2012: It is allowed, just needs a setting]_
