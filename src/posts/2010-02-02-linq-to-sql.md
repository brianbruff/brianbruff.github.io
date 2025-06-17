---
title: "Linq to SQL"
date: "2010-02-02"
tags: []
---

### Requirment:

Nothwind Sql Database

## Advantages of Linq to SQL

While everything with Linq to Sql ca be done with Ado.Net, there are a few advantages

- Less code: you don't need to write ADO.NET code for querying the database. You can use a tool to generate the data classes you need.
- Flexible querying capabilities: Rather than struggle with SQL, you can use the LINQ querying model. Ultimately, you'llbe able to use one consistent model (LINQ expressions) to access many different types of data, from databases to XML.
- Change tracking and batch updates: This is the most important one for me, (because I already have ado.net tools and i don't mindwriting sql) You can change multiple details about the data yo've queried and commit a batch update.

Add a new linq to sql item to your project

![](/blog/image.axd?picture=2010%2f2%2faddLinq.png)

## Sample usage

[code:c#]

class Program  
{  
static void Main(string[] args)  
{  
Program prog = new Program();  
prog.ListAllOrderProducts();  
prog.ListAllOrderProductsForCustomer();  
Console.ReadLine();  
}

private void ListAllOrderProducts()  
{  
CustomerOrdersDataContext dc = new CustomerOrdersDataContext();  
Table table = dc.GetTable();  
foreach (var order in table)  
{  
Console.WriteLine(order.Order_Details[0].Product.ProductName);  
}  
}

private void ListAllOrderProductsForCustomer(string custId = "ALFKI")  
{  
CustomerOrdersDataContext dc = new CustomerOrdersDataContext();  
var result =  
from order in dc.GetTable()  
where order.CustomerID == custId  
select order;

foreach (var x in result)  
{  
Console.WriteLine(x.Order_Details[0].Product.ProductName);  
}  
}  
}

[/code]
