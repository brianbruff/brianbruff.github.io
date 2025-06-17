---
title: "Removing sensitive data from git"
date: "2013-01-28"
tags: ["git filter-branch rm --cached --ignore-unmatch"]
---

Ok, so in my case it was not so sensitive, I had generated a publish profile for one of my projects, that said I don’t want the world and their aunty to be able to publish their apps to my server so I needed to remove my sensitive data from git.

## Here’s how

    git filter-branch --index-filter 'git rm --cached --ignore-unmatch mySensitive.data'
      --prune-empty --tag-name-filter cat -- --all

    git commit -m "Add Rakefile to .gitignore"

    git push origin master –force

The above removes the file from history, you could add it to your .gitignore to ensure it’s not accidently added again.
