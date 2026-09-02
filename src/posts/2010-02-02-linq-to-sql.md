---
title: "LINQ to SQL"
date: "2010-02-02"
category: "Data & Persistence"
tags: ["linq", "sql server"]
---

### Requirement:

Northwind SQL Database

## Advantages of LINQ to SQL

While everything with LINQ to SQL can be done with ADO.NET, there are a few advantages:

  * Less code: you don't need to write ADO.NET code for querying the database. You can use a tool to generate the data classes you need.
  * Flexible querying capabilities: Rather than struggle with SQL, you can use the LINQ querying model. Ultimately, you'll be able to use one consistent model (LINQ expressions) to access many different types of data, from databases to XML.
  * Change tracking and batch updates: This is the most important one for me (because I already have ADO.NET tools and I don't mind writing SQL). You can change multiple details about the data you've queried and commit a batch update.

Add a new LINQ to SQL item to your project.

![](/images/blog/2010/2/addLinq.png)

## Sample usage

```csharp
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
        Table<Order> table = dc.GetTable<Order>();
        foreach (var order in table)
        {
            Console.WriteLine(order.Order_Details[0].Product.ProductName);
        }
    }

    private void ListAllOrderProductsForCustomer(string custId = "ALFKI")
    {
        CustomerOrdersDataContext dc = new CustomerOrdersDataContext();
        var result =
            from order in dc.GetTable<Order>()
            where order.CustomerID == custId
            select order;

        foreach (var x in result)
        {
            Console.WriteLine(x.Order_Details[0].Product.ProductName);
        }
    }
}
```