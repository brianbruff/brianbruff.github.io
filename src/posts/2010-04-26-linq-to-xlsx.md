---
title: "Linq to Xlsx"
date: "2010-04-26"
tags: ["openxml linq"]
---

A sample how to read a Excel 2007/2010 using Open XML SDK V2

(forgive the bad syntax highlighting)

[code:c#]

using System;  
using System.Collections.Generic;  
using System.Linq;  
using System.Text;  
using DocumentFormat.OpenXml.Spreadsheet;  
using DocumentFormat.OpenXml.Packaging;

namespace ConsoleApplicationLinqToXlsx  
{  
class Program  
{  
static void Main(string[] args)  
{  
//Declare variables to hold refernces to Excel objects.  
Workbook workBook;  
SharedStringTable sharedStrings;  
IEnumerable workSheets;  
WorksheetPart custSheet;  
WorksheetPart orderSheet;

//Declare helper variables.  
string custID;  
string orderID;  
List customers;  
List orders;

//Open the Excel workbook.  
using (SpreadsheetDocument document =  
SpreadsheetDocument.Open(@"d:\Temp\ConsoleApplicationLinqToXlsx\TestOpenXMl.xlsx ", true))  
{  
//References to the workbook and Shared String Table.  
workBook = document.WorkbookPart.Workbook;  
workSheets = workBook.Descendants();  
sharedStrings =  
document.WorkbookPart.SharedStringTablePart.SharedStringTable;

//Reference to Excel Worksheet with Customer data.  
custID =  
workSheets.First(s => s.Name == @"Customer").Id;  
custSheet =  
(WorksheetPart)document.WorkbookPart.GetPartById(custID);

//Load customer data to business object.  
customers =  
Customer.LoadCustomers(custSheet.Worksheet, sharedStrings);

//Reference to Excel worksheet with order data.  
orderID =  
workSheets.First(sheet => sheet.Name == @"Order").Id;  
orderSheet =  
(WorksheetPart)document.WorkbookPart.GetPartById(orderID);

//Load order data to business object.  
orders =  
Order.LoadOrders(orderSheet.Worksheet, sharedStrings);

//List all customers to the console.  
//Write header information to the console.  
Console.WriteLine("All Customers");  
Console.WriteLine("{0, -15} {1, -15} {2, -5}",  
"Customer", "City", "State");

//LINQ Query for all customers.  
IEnumerable allCustomers =  
from customer in customers  
select customer;

//Execute query and write customer information to the console.  
foreach (Customer c in allCustomers)  
{  
Console.WriteLine("{0, -15} {1, -15} {2, -5}",  
c.Name, c.City, c.State);  
}  
Console.WriteLine();  
Console.WriteLine();

//Write all orders over $100 to the console.  
//Write header information to the console.  
Console.WriteLine("All Orders over $100");  
Console.WriteLine("{0, -15} {1, -10} {2, 10} {3, -5}",  
"Customer", "Date", "Amount", "Status");

//LINQ Query for all orders over $100.  
//Join used to display customer information for the order.  
var highOrders =  
from customer in customers  
join order in orders on customer.Name equals order.Customer  
where order.Amount > 100.00  
select new  
{  
customer.Name,  
order.Date,  
order.Amount,  
order.Status  
};

//Execute query and write information to the console.  
foreach (var result in highOrders)  
{  
Console.WriteLine("{0, -15} {1, -10} {2, 10} {3, -5}",  
result.Name, result.Date.ToShortDateString(),  
result.Amount, result.Status);  
}  
Console.WriteLine();  
Console.WriteLine();

//Report on customer orders by status.  
//Write header information to the console.  
Console.WriteLine("Customer Orders by Status");

//LINQ Query for summarizing customer order information by status.  
//There are two LINQ queries.   
//Internal query is used to group orders together by status and   
//calculates the total order amount and number of orders.  
//External query is used to join Customer information.  
var sumoforders =  
from customer in customers  
select new  
{  
customer.Name,  
statusTotals =  
from order in orders  
where order.Customer == customer.Name  
group order.Amount by order.Status into statusGroup  
select new  
{  
status = statusGroup.Key,  
orderAmount = statusGroup.Sum(),  
orderCount = statusGroup.Count()  
}  
};

//Execute query and write information to the console.  
foreach (var customer in sumoforders)  
{  
//Write Customer name to the console.  
Console.WriteLine("-{0}-", customer.Name);  
foreach (var x in customer.statusTotals)  
{  
Console.WriteLine(" {0, -10}: {2,2} orders totaling {1, 7}",  
x.status, x.orderAmount, x.orderCount);  
}  
Console.WriteLine();  
}

//Keep the console window open.  
Console.Read();  
}  
}

///   
/// Used to store customer information for analysis.  
///   
public class Customer  
{  
//Properties.  
public string Name { get; set; }  
public string City { get; set; }  
public string State { get; set; }

///   
/// Helper method for creating a list of customers   
/// from an Excel worksheet.  
///   
public static List LoadCustomers(Worksheet worksheet,  
SharedStringTable sharedString)  
{  
//Initialize the customer list.  
List result = new List();

//LINQ query to skip first row with column names.  
IEnumerable dataRows =  
from row in worksheet.Descendants()  
where row.RowIndex > 1  
select row;

foreach (Row row in dataRows)  
{  
//LINQ query to return the row's cell values.  
//Where clause filters out any cells that do not contain a value.  
//Select returns the value of a cell unless the cell contains  
// a Shared String.  
//If the cell contains a Shared String, its value will be a   
// reference id which will be used to look up the value in the   
// Shared String table.  
IEnumerable textValues =  
from cell in row.Descendants()  
where cell.CellValue != null  
select  
(cell.DataType != null  
&& cell.DataType.HasValue  
&& cell.DataType == CellValues.SharedString  
? sharedString.ChildElements[  
int.Parse(cell.CellValue.InnerText)].InnerText  
: cell.CellValue.InnerText)  
;

//Check to verify the row contained data.  
if (textValues.Count() > 0)  
{  
//Create a customer and add it to the list.  
var textArray = textValues.ToArray();  
Customer customer = new Customer();  
customer.Name = textArray[0];  
customer.City = textArray[1];  
customer.State = textArray[2];  
result.Add(customer);  
}  
else  
{  
//If no cells, then you have reached the end of the table.  
break;  
}  
}

//Return populated list of customers.  
return result;  
}  
}

///   
/// Used to store order information for analysis.  
///   
public class Order  
{  
//Properties.  
public string Number { get; set; }  
public DateTime Date { get; set; }  
public string Customer { get; set; }  
public Double Amount { get; set; }  
public string Status { get; set; }

///   
/// Helper method for creating a list of orders   
/// from an Excel worksheet.  
///   
public static List LoadOrders(Worksheet worksheet,  
SharedStringTable sharedString)  
{  
//Initialize order list.  
List result = new List();

//LINQ query to skip first row with column names.  
IEnumerable dataRows =  
from row in worksheet.Descendants()  
where row.RowIndex > 1  
select row;

foreach (Row row in dataRows)  
{  
//LINQ query to return the row's cell values.  
//Where clause filters out any cells that do not contain a value.  
//Select returns cell's value unless the cell contains  
// a shared string.  
//If the cell contains a shared string its value will be a   
// reference id which will be used to look up the value in the   
// shared string table.  
IEnumerable textValues =  
from cell in row.Descendants()  
where cell.CellValue != null  
select  
(cell.DataType != null  
&& cell.DataType.HasValue  
&& cell.DataType == CellValues.SharedString  
? sharedString.ChildElements[  
int.Parse(cell.CellValue.InnerText)].InnerText  
: cell.CellValue.InnerText)  
;

//Check to verify the row contains data.  
if (textValues.Count() > 0)  
{  
//Create an Order and add it to the list.  
var textArray = textValues.ToArray();  
Order order = new Order();  
order.Number = textArray[0];  
order.Date = new DateTime(1900, 1, 1).AddDays(  
Double.Parse(textArray[1]) - 2);  
order.Customer = textArray[2];  
order.Amount = Double.Parse(textArray[3]);  
order.Status = textArray[4];  
result.Add(order);  
}  
else  
{  
//If no cells, then you have reached the end of the table.  
break;  
}  
}

//Return populated list of orders.  
return result;  
}  
}

}  
}

[/code]
