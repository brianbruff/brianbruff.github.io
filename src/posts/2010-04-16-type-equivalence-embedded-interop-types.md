---
title: "Type Equivalence Embedded Interop Types"
date: "2010-04-16"
tags: []
---

Beginning with the .NET Framework version 4, the common language runtime supports embedding type information for COM types directly into managed assemblies, instead of requiring the managed assemblies to obtain type information for COM types from interop assemblies. Because the embedded type information includes only the types and members that are actually used by a managed assembly, two managed assemblies might have very different views of the same COM type. Each managed assembly has a different [Type](http://msdn.microsoft.com/en-us/library/system.type\(v=VS.100\).aspx) object to represent its view of the COM type. The common language runtime supports type equivalence between these different views for interfaces, structures, enumerations, and delegates.

Type equivalence means that a COM object that is passed from one managed assembly to another can be cast to the appropriate managed type in the receiving assembly.

![Note](http://i.msdn.microsoft.com/Hash/030c41d9079671d09a62d8e2c1db6973.gif)**Note**  

Type equivalence and embedded interop types simplify the deployment of applications and add-ins that use COM components, because it is not necessary to deploy interop assemblies with the applications. Developers of shared COM components still have to create primary interop assemblies (PIAs) if they want their components to be used by earlier versions of the .NET Framework.  
  
Type Equivalence

* * *

Equivalence of COM types is supported for interfaces, structures, enumerations, and delegates. COM types qualify as equivalent if all of the following are true:

  * The types are both interfaces, or both structures, or both enumerations, or both delegates.

  * The types have the same identity, as described in the next section.

  * Both types are eligible for type equivalence, as described in the Marking COM Types for Type Equivalence section.

### Type Identity

Two types are determined to have the same identity when their scopes and identities match, in other words, if they each have the [TypeIdentifierAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute\(v=VS.100\).aspx) attribute, and the two attributes have matching [Scope](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.scope\(v=VS.100\).aspx) and [Identifier](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.identifier\(v=VS.100\).aspx) properties. The comparison for [Scope](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.scope\(v=VS.100\).aspx) is case-insensitive.

If a type does not have the [TypeIdentifierAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute\(v=VS.100\).aspx) attribute, or if it has a [TypeIdentifierAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute\(v=VS.100\).aspx) attribute that does not specify scope and identifier, the type can still be considered for equivalence as follows:

  * For interfaces, the value of the [GuidAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.guidattribute\(v=VS.100\).aspx) is used instead of the [TypeIdentifierAttribute.Scope](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.scope\(v=VS.100\).aspx) property, and the [Type.FullName](http://msdn.microsoft.com/en-us/library/system.type.fullname\(v=VS.100\).aspx) property (that is, the type name, including the namespace) is used instead of the [TypeIdentifierAttribute.Identifier](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.identifier\(v=VS.100\).aspx) property.

  * For structures, enumerations, and delegates, the [GuidAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.guidattribute\(v=VS.100\).aspx) of the containing assembly is used instead of the [Scope](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.scope\(v=VS.100\).aspx) property, and the [Type.FullName](http://msdn.microsoft.com/en-us/library/system.type.fullname\(v=VS.100\).aspx) property is used instead of the [Identifier](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute.identifier\(v=VS.100\).aspx) property.

### Marking COM Types for Type Equivalence

You can mark a type as eligible for type equivalence in two ways:

  * Apply the [TypeIdentifierAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.typeidentifierattribute\(v=VS.100\).aspx) attribute to the type.

  * Make the type a COM import type. An interface is a COM import type if it has the [ComImportAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.comimportattribute\(v=VS.100\).aspx) attribute. An interface, structure, enumeration, or delegate is a COM import type if the assembly in which it is defined has the [ImportedFromTypeLibAttribute](http://msdn.microsoft.com/en-us/library/system.runtime.interopservices.importedfromtypelibattribute\(v=VS.100\).aspx) attribute.

