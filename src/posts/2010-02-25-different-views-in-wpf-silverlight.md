---
title: "Different views in WPF/Silverlight"
date: "2010-02-25"
category: "XAML & Desktop"
tags: ["wpf", "silverlight", "data binding"]
---

In my early WPF days I noticed the magic that having two different controls bound to the same ObservableCollection meant that when I selected an item in one control, the same item got selected in the other... which I didn't want.

## CollectionViewSource To the rescue

