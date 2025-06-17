---
title: "scoped_ptr in C#"
date: "2011-08-05"
tags: ["Disposing"]
---

Is there a better way? Or at least a more generic way to leverage the dispose pattern? Well here’s one I thought of tonight

       1:      public class ScopeMngr : IDisposable

       2:      {

       3:          private Action _dispose = null;

       4:   

       5:          public ScopeMngr(Action init, Action dispose)

       6:              : this(dispose)

       7:          {

       8:              init();

       9:          }

      10:   

      11:          public ScopeMngr(Action dispose)

      12:          {

      13:              _dispose = dispose;

      14:          }

      15:   

      16:          public void Dispose()

      17:          {

      18:              if (_dispose != null)

      19:              {

      20:                  _dispose();

      21:                  _dispose = null;

      22:              }

      23:          }

      24:      }

Sample usage:

       1:      public partial class Form1 : Form

       2:      {

       3:          public Form1()

       4:          {

       5:              InitializeComponent();

       6:          }

       7:   

       8:          private void button1_Click(object sender, EventArgs e)

       9:          {

      10:              using (var sm = new ScopeMngr(() => Cursor = Cursors.WaitCursor, () => Cursor = Cursors.Default))

      11:              {

      12:                  Thread.Sleep(TimeSpan.FromSeconds(10));

      13:              }

      14:   

      15:              bool updating = false;

      16:              using (var sm = new ScopeMngr(() => updating = true, () => updating = false))

      17:              {

      18:                  // updating is true here

      19:                  // update the UX etc.

      20:              }

      21:              // updating is false here

      22:   

      23:          }

      24:      }

P.s. I know creating an object to reset a boolean is a bit of overkill, but see my comments and argument for same in my c++ [post](/blog/post/2011/08/04/C++-11%E2%80%93shared_ptr.aspx)

Enjoy.

p.s. you could also just use a try {} finally {}
