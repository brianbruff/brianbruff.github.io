---
title: "SqlDataSource Strict Concurrency Checking–Simplistic approach"
date: "2011-02-23"
category: "Data & Persistence"
tags: ["sql server", "concurrency"]
---

Let’s say you have a simple UPDATE command.

```text
UpdateCommand="Update SEC_USERS SET FirstName=@FirstName, Department = @Department, Gender = @Gender”
```
Now, let’s assume that two end users of your system have already requested information for SEC_USER Bill who’s a male janitor.

End user 1 updates Bill’s Department as he’s been promoted to CEO (hey it’s not impossible!).  
End user 2 changes Bill’s Gender to female.

What actually ends up happening is that End user 2 overwrites the promotion and Bill (or maybe Billie now) ends up as a female janitor.

So how can we solve this problem assuming we are using a SqlDataSource?

#### Here’s how:

![](/images/blog/image_thumb_24.png)

  * Set the ConflictDetection property to CompareAllValues 
  * Set the OldValuesParameterFormatString to xxxx_{0}
  * Update your command with a WHERE restriction for XXXX_{0}

```sql
UpdateCommand= "Update SEC_USERS SET FirstName=@FirstName, Department = @Department, Gender = @Gender FROM SEC_USERS WHERE FirstName=@read_FirstName
 AND Department=@read_Department AND Gender=@read_Gender"
```

That’s it, the SqlDataSource manages the read_xxx parameters so you don’t have to.
