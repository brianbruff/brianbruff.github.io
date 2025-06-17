---
title: "VS2019 Docker ASP Core Environment Vars"
date: "2019-01-03"
tags: ["vs2017", "vs2019", "docker"]
---

## Tip

If you are debugging with VS2017/9 and want to pass environment variables to your container then read this post, if you are looking for picture of cats then sorry but leave a comment how you got here

### Step 1

Create a new text file, the name doesn’t matter, but i called mine Dockerfile.env

![](/images//images/image_thumb_441.png)

![](/images//images/image_thumb_442.png)

### Step 2

Add this file to your .csproj file.

![](/images//images/image_thumb_443.png)

### Step 3

Not really a step but you you can simply query your Environment variable in the usual fashion (_Environment.GetEnvironmentVariable()_)

![](/images//images/image_thumb_444.png)

## Note:

Needless to say when you run in production you’ll need to pass the Environment variable according to Docker documentation which I don’t cover here
