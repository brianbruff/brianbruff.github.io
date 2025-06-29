---
title: "Asp MVC Entity Framework and Data annotations"
date: "2011-02-28"
tags: ["entity framework", "data annotations"]
---

![](/images//blog/image.axd?picture=image_thumb_30.png)

When you create a MVC view for data entry it already has the scaffolding in place to handle client side validation (and server)   
However you need to specify the data annotations you need.

You’ve two options.

1) Modify the T4 code generation templates

2) Use meta data classes (this post)

The generated EF classes are partial classes, this allows us to do the following

       1:  #region Feed

       2:   

       3:      [MetadataType(typeof(FeedMetadata))]

       4:      public partial class Feed

       5:      {

       6:      }

       7:   

       8:   

       9:      public class FeedMetadata

      10:      {

      11:          [Required(ErrorMessage="Please enter a valid name for this feed")]

      12:          public string Name { get; set; }

      13:      }

      14:   

      15:      #endregion Feeds

Note: while mvc3 supports these annotations they are limited to [range/required/stringlength/regularexpression]. If you wish to have a bigger offering consider the extensions offered.

Here’s how.

Go the NuGet Extension Manager (right click on references and select add Library Package Reference) and search for “DataAnnotationsExtensions.” You should see the following two packages, choose the second (includes client side validation, first is server side only.)

![](/images/image_1642CC06.png)

Btw: If NuGet is alien to you, then don’t worry, it’s basically a packet manager to make your life a littler easier… a post for another day!
