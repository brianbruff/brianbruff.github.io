---
title: "WPF Routed events"
date: "2010-01-07"
category: "XAML & Desktop"
tags: ["wpf", "events"]
---

Ever have a control on a window and want to be able to receive button clicks from this child control?  
More than once I've done this the hard way, but now...

```csharp
public VariablesWindow()
  {
   this.InitializeComponent();
   variables.AddHandler(Button.ClickEvent, new RoutedEventHandler(HandleChildClick));
  }

  private void HandleChildClick(object sender, RoutedEventArgs args)
        {
            Button senderButton = args.OriginalSource as Button;
            if (senderButton != null && senderButton.Content != null)
            {
                string buttonText = senderButton.Content as string;
                if (buttonText == "_Cancel")
                {
                    this.DialogResult = false;
                    Close();
                }
                else if (buttonText == "_OK")
                {
                    this.DialogResult = true;
                    Close();
                }
            }
        }
```