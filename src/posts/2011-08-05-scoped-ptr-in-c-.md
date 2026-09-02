---
title: "scoped_ptr in C#"
date: "2011-08-05"
category: ".NET & C#"
tags: ["idisposable", "design patterns", "c++"]
---

Is there a better way? Or at least a more generic way to leverage the dispose pattern? Well here’s one I thought of tonight.

```csharp
public class ScopeMngr : IDisposable
    {
        private Action _dispose = null;

        public ScopeMngr(Action init, Action dispose)
            : this(dispose)
        {
            init();
        }

        public ScopeMngr(Action dispose)
        {
            _dispose = dispose;
        }

        public void Dispose()
        {
            if (_dispose != null)
            {
                _dispose();
                _dispose = null;
            }
        }
    }
```
Sample usage:

```csharp
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            using (var sm = new ScopeMngr(() => Cursor = Cursors.WaitCursor, () => Cursor = Cursors.Default))
            {
                Thread.Sleep(TimeSpan.FromSeconds(10));
            }

            bool updating = false;
            using (var sm = new ScopeMngr(() => updating = true, () => updating = false))
            {
                // updating is true here
                // update the UX etc.
            }
            // updating is false here

        }
    }
```
P.s. I know creating an object to reset a boolean is a bit of overkill, but see my comments and argument for same in my C++ [post](/blog/post/2011/08/04/C++-11%E2%80%93shared_ptr.aspx).

Enjoy.

P.s. You could also just use a try {} finally {}.
