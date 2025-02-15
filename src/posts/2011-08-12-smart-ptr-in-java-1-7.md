---
title: "smart_ptr in java 1.7"
date: "2011-08-12"
tags: []
---

Darn it but I’ve being doing a lot of Java recently and u know what, I’m no expert but it I think I could even a raise the rating on my C.V. at this stage. My first experience of Java was reading a book back in 2001 belonging to a student friend of mine, the book was lying about so picked it up and read it over the course of a week (yes I had an early addiction to technologies even though I was living in c++ land at the time). I ended up helping with one Final year project a java applet game suite if I remember correctly and in a JBuilder IDE.

Over the years I quickly forgot about my little affair with java and got deeper into c++ which I have to say I loved, around the same time I was having another affair (yes i was a slut) with Microsoft .net beta2. I can’t put my finger exactly on why c# won out for me, but I spent the next few years working on c++ and c#, Java was just something I always left to one side. I always though hey java will be easy, I’ve programmed in c#, same concepts, and moreover I knew c++, so well then c# or java are a walk in the part; while this I guess is partially true, but you’re not prepared you for the curve/slope/cliff you’ve got to climb to learn the IDE and the libraries needed these days.

I’m currently working for a data management company our products are written in java and .net. For the first two years I managed to live in the .net world but lately and mostly due to the success of some of our newer components I’ve been doing quite a lot of java, (a lot more than I ever expected). I’ve also started reading some good books on the subject and you know what I’m as likely to start a test application in Eclipse as I am in VS2010 these days (at least as far as the product components are concerned).

So what’s changed? Well for one the java language is evolving once again which is exciting; so to continue on my smart_ptr series of posts, we can now achieve resource cleanup with java 1.7 with the AutoClosable interface.

For .net people this will be very familiar to IDisposable and the using(var x = new IDisposableDerivedType())

       1:  File file = new File("input.txt");

       2:   

       3:  InputStream is = null;

       4:   

       5:  try {

       6:      is = new FileInputStream(file);

       7:   

       8:      // do something with this input stream

       9:      // ...

      10:   

      11:  }

      12:  catch (FileNotFoundException ex) {

      13:      System.err.println("Missing file " + file.getAbsolutePath());

      14:  }

      15:  finally {

      16:      if (is != null) {

      17:          is.close();

      18:      }

      19:  }

      20:   

      21:  Java 7: Try with resources

      22:   

      23:  File file = new File("input.txt");

      24:   

      25:  try (InputStream is = new FileInputStream(file)) {

      26:      // do something with this input stream

      27:      // ...

      28:  }

      29:  catch (FileNotFoundException ex) {

      30:      System.err.println("Missing file " + file.getAbsolutePath());

      31:  }

We’re guaranteed that the

    is.close(); gets called automatically for us. Have to say I'm a bit jealous that the c# team didn't think of the try() syntax over using.

