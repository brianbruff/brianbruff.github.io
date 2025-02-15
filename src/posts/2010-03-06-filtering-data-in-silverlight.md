---
title: "Filtering data in Silverlight"
date: "2010-03-06"
tags: ["lmabda", "silverlight", "wpf"]
---

Ever want to filter data in Silverlight? here's a simple example that uses a lambda expression to search on name (case sensitive)

[code:c#]

ComboBox cbx = ((ComboBox)sender);

ICollectionView dataView =  
CollectionViewSource.GetDefaultView(this.DataContext);  
if (!string.IsNullOrEmpty(cbx.Text))  
dataView.Filter = f => ((Job)f).Name.Contains(cbx.Text);  
else  
dataView.Filter = null;

[/code]
