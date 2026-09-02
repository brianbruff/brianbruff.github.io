---
title: "RIA Service in 5 minutes"
date: "2011-04-27"
category: "XAML & Desktop"
tags: ["silverlight", "entity framework", "data binding"]
---

Hi all,

I’ve previously blogged about how mind blowing WCF RIA Services are [here](/blog/post/2010/03/15/RIA-Services.aspx).

This week I found myself working with RIA Services again and this time I’ve got to show you just how easy it is (in case you didn’t take my advice and go look it up).

So, fire up VS2010 and create a new Silverlight Business Application.

![](/images/blog/image_thumb_49.png)

Two projects will be created for you, the Web project is where your DataAccess and Business logic lies, the other project is your Silverlight application.

Create an entity framework model ORM for your data (you know how to do this right?)

Next create a new Domain Service Class in the Web/Services folder.

![](/images/blog/image_thumb_50.png)

![](/images/blog/image_thumb_51.png)

Compile... that’s your server ready to serve up your data.

Now let’s move into the Silverlight app, and add the following mark-up to your XAML

First add the domain datasource, set it to auto load and set the Query name to the name of the query that has been injected into your client app, (let intellisense help you; it will be in the Web.Services namespace context object).

```xml
        <domainControls:DomainDataSource x:Name="dataPads" LoadSize="20" AutoLoad="True" QueryName="GetPadocks">
            <domainControls:DomainDataSource.DomainContext>
                <data:FarmContext />
            </domainControls:DomainDataSource.DomainContext>
        </domainControls:DomainDataSource>
```

Add a datagrid using ElementBinding to the domainDataSource above (I’ve also put it in a telerik busyindicator to provide feedback that the data is loading).

```xml
<telerik:RadBusyIndicator IsBusy="{Binding ElementName=dataPads, Path=IsLoadingData}">
    <dataControls:DataGrid x:Name="padocksGrid" MinHeight="100"
         ItemsSource="{Binding ElementName=dataPads, Path=Data}"  />
</telerik:RadBusyIndicator>
```
Ok I’ve once again skimped on some of the detail but it’s a really nifty approach and I encourage you to give it a go.

(Also seeing your service is a DomainContext you can expose your data as OData, a post for another day.)
