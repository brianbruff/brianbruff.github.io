---
title: ".NET 4.0 Code Contracts"
date: "2011-06-10"
tags: []
---

Yesterday I read an interesting [article](http://msdn.microsoft.com/en-us/magazine/gg983479.aspx) on a flight home from Amsterdam and though I would share it with you.

One of the generally excepted approaches of writing functions is to validate you input arguments before using them, If-Then-Throw pattern.

Now .Net 4.0 supports Design by Contract approach to software design .NET 4 code contracts. Lets dive straight in (as always ![Smile](/blog/image.axd?picture=wlEmoticon-smile_3.png))

       1:  using System.Diagnostics.Contracts;

       2:   

       3:  public class Calculator

       4:  {

       5:      public Int32 Sum(Int32 x, Int32 y)

       6:      {

       7:          Contract.Requires(x >= 0 && y >= 0);

       8:          Contract.Ensures(Contract.Result() >= 0);

       9:

      10:          if (x == y)

      11:          return 2 * x;

      12:          return x + y;

      13:      }

      14:

      15:      public Int32 Divide(Int32 x, Int32 y)

      16:      {

      17:          Contract.Requires(x >= 0 && y >= 0);

      18:          Contract.Requires(y > 0);

      19:          Contract.Ensures(Contract.Result() >= 0);

      20:          return x / y;

      21:      }

      22:  }

Here we see just how powerful contracts can be, have a look at Dino Esposito’s article above for more information.
