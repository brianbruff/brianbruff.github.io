---
title: "Migrate SqlServer DB to Azure Sql"
date: "2011-12-27"
tags: ["Migrating SqlServer DB to the cloud"]
---

Here’s one way to migrate your SqlServer Database to the Azure platform.

1) Get the SQL Azure Migration Wizard <http://sqlazuremw.codeplex.com/>

![](/images/./image.axd?picture=image_thumb_129.png)

2) Start the wizard and select SQL Database Migrate option

![](/images/./image.axd?picture=image_thumb_130.png)

3) Select your source database

![](/images/./image.axd?picture=image_thumb_131.png)

4) Choose the objects you wish to migrate (all in my case)

![](/images/./image.axd?picture=image_thumb_132.png)

![](/images/./image.axd?picture=image_thumb_133.png)

5) See the results and review the SQL Script if necessary.

![](/images/./image.axd?picture=image_thumb_134.png)

6) Now we need Sql Azure in the cloud for the next part, log into your <http://windows.azure.com> account (get a 3 month free trial if you don’t have one)

Select your Azure Server and create a new database. 

![](/images/./image.axd?picture=image_thumb_135.png)

7) You’ll be prompted to select where you want your server located if you don’t already have one.

![](/images/./image.axd?picture=image_thumb_136.png)

![](/images/./image.axd?picture=image_thumb_137.png)

8) Add some rules to your database, you’ll need to do this to allow access for MS Services and Visual Studio

![](/images/./image.axd?picture=image_thumb_138.png)

![](/images/./image.axd?picture=image_thumb_139.png)

9) So now that you have a database in the cloud you’ll need to continue with your migration wizard by selecting this database.

![](/images/./image.axd?picture=image_thumb_140.png)

![](/images/./image.axd?picture=image_thumb_141.png)

![](/images/./image.axd?picture=image_thumb_142.png)

10) That’s pretty much it. Hope these screenshots helps someone out.
