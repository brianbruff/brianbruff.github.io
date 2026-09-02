---
title: "Windows Forms Validation"
date: "2009-11-05"
category: "XAML & Desktop"
tags: ["wpf", "validation"]
---

One approach for validating child controls on Windows Forms is to

## Validation.

  * Add a Validated event handler to all child controls you're interested in.
  * On a button event handler call this.ValidateChildren();

This will ensure the validation routine on all child controls will be called. If for example you've added an ErrorProvider control extender to your form you can set it up in the validated event handlers.
