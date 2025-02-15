---
title: "SqlDatasource Strict Concurrency Checking–Simplistic approach"
date: "2011-02-23"
tags: ["SqlDataSource"]
---

Lets say you have simple UPDATE command

    UpdateCommand="Update SEC_USERS SET FirstName=@FirstName, Department = @Department, Gender = @Gender”

Now, lets assume that two end users of your system have already requested information for SEC_USER Bill whose a male janitor.

End user 1 updates Bills Department as he’s been promoted to CEO (hey it not impossible!).  
End user 2 changes Bills Gender to female.

What actually ends up happening is the End user 2 overwrites the promotion and Bill (or maybe billie now ) ends up as a female janitor.

So how can we solve this problem assuming we are using a SqlDataSource.

#### Here’s how:

![](/images//blog/image.axd?picture=image_thumb_24.png)

  * Set the ConflictDetection property to CompareAllValues 
  * Set the OldValuesParameterFormatString to xxxx_{0}
  * Update your command with a WHERE restriction for XXXX_{0}

        UpdateCommand= "Update SEC_USERS SET FirstName=@FirstName, Department = @Department, Gender = @Gender FROM SEC_USERS WHERE [FirstName=@read_FirstName](mailto:FirstName=@read_FirstName)
    
         AND Department=@read_Department AND Gender=@read_Gender"

That’s it, the SqlDataSource manages the read_xxx parameters so you don’t have to.
