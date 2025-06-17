---
title: "It's my football and I'm going home"
date: "2010-12-13"
tags: [".net security"]
---

We've all created API libraries, and libraries by their nature encourage resuse.  
However what happens if you want to be selective in who else uses your assembly?  
One simplistic approach would be to ensure that the calling assembly has the same public key

private void CheckCallerAllowed()  
{  
var myPubKeyToken = Assembly.GetExecutingAssembly().GetName().GetPublicKeyToken();  
var entryPubKeyToken = Assembly.GetEntryAssembly().GetName().GetPublicKeyToken();

if (myPubKeyToken.Length != entryPubKeyToken.Length)  
throw new ApplicationException("Assembly not licensed");

for (int idx = 0; idx < myPubKeyToken.Count(); ++idx)  
if (myPubKeyToken[idx] != entryPubKeyToken[idx])  
throw new ApplicationException("Assembly not licensed");  
}

Place a call to the function above in your public interface.
