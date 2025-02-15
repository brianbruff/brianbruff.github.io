---
title: "Flexing those Java generic PECS"
date: "2019-05-01"
tags: []
---

I believe I’ve previously covered c# generics covariance and contravariance in the past, now it’s javas turn

As you may or may not know 

The term PECS stands for “Producer Extends, Consumer Super,” which is an odd acronym coined by Joshua Block in his Effective Java book, but provides a mnemonic on what to do. It means that if a parameterized type represents a producer, use extends. If it represents a consumer, use super. If the parameter is both, don’t use wildcards at all—the only type that satisfies both requirements is the explicit type itself.

Covariance in java uses the extends keyword (yes even with interfaces), e.g. List accommodates all types that derive from Number

Contravariance on the other hand uses the super keyword e.g. List accommodates all the types that Number derives from and of course number itself.

So what exactly is PECS recommending we do?

  * Use extends when you only get values out of a data structure
  * Use super when you only put values into a data structure
  * Use the exact type when you plan on doing both

