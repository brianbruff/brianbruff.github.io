---
title: "Azure AD Angular7 .net Core 2.2 ADAL"
date: "2018-12-27"
tags: []
---

Hi Everyone,

I thought it worth sharing how to configure Azure Active Directory to work with a .net core 2.2 webapi backend and an angular7 front end that uses ADAL (i.e. v1 of Azure AD)

## AD Versions

As you may or may not be aware, Azure AD has two implementations of security protocols, v1 is the common one but v2 is becoming more popular. From an Angular point of view you will pull in either the ADAL library for v1 or the MSAL library for v2, I’m not going to dwell on what the differences are or why to use either, in a recent project I was working on we found that there was no Java springboot support for v2 at the time, so went with the v1 endpoints to get our POC up and running quickly.

## Asp Web Api

To configure Asp.net core 2.2 for use with v1 you’ll need a jwt token

## Angular 7

For angular7 I used the adal-angular4 library (this is an unfortunate name as it is not limited to v4)

The application settings are configured in the environment

The module then adds adal and interceptors via the providers statement

Now when you make a http request the bearer token will be added by the angular interceptor and recognised by the webapi
