---
title: "INotifyPropertyChanged diagnostics"
date: "2010-05-13"
category: "XAML & Desktop"
tags: ["data binding", "wpf", "mvvm"]
---

Those of you that use INotifyPropertyChanged may have noticed it's easy to break the code if you choose to refactor/rename as the property name string does not get refactored.

Here is a mechanism to catch this problem at the implementation stage.

```csharp
#region Debugging Aides

/// <summary>
/// Warns the developer if this object does not have
/// a public property with the specified name. This
/// method does not exist in a Release build.
/// </summary>
[Conditional("DEBUG")]
[DebuggerStepThrough]
public void VerifyPropertyName(string propertyName)
{
    // Verify that the property name matches a real,
    // public, instance property on this object.
    if (TypeDescriptor.GetProperties(this)[propertyName] == null)
    {
        string msg = "Invalid property name: " + propertyName;

        if (this.ThrowOnInvalidPropertyName)
            throw new Exception(msg);
        else
            Debug.Fail(msg);
    }
}

/// <summary>
/// Returns whether an exception is thrown, or if a Debug.Fail() is used
/// when an invalid property name is passed to the VerifyPropertyName method.
/// The default value is false, but subclasses used by unit tests might
/// override this property's getter to return true.
/// </summary>
protected virtual bool ThrowOnInvalidPropertyName { get; private set; }

#endregion // Debugging Aides

#region INotifyPropertyChanged Members

/// <summary>
/// Raised when a property on this object has a new value.
/// </summary>
public event PropertyChangedEventHandler PropertyChanged = (s, e) => { };

/// <summary>
/// Raises this object's PropertyChanged event.
/// </summary>
/// <param name="propertyName">The property that has a new value.</param>
protected virtual void OnPropertyChanged(string propertyName)
{
    this.VerifyPropertyName(propertyName);
    this.PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
}

#endregion // INotifyPropertyChanged Members
```