---
title: "Linq DistinctBy"
date: "2012-04-05"
tags: ["Linq DistinctBy"]
---

Here is an extension method that I just had to share, TBH I’ve forgotten what I robbed the initial idea from, it wasn’t mine, but it’s something I found that I use over and over.

The problem is I want to use the Distinct() extension method. However the objects I’m creating don’t override the default equality comparer, nor did I want to create a functor and supply to the overload just for this scenario.

Lets have a look of what I’m dealing with.

    public class Source

    {

        public string Code { get; set; }

        public string Name { get; set; }

    }

Here’s what one would initially try

    // Remove any duplicates

     c.DependingOnSources = c.DependingOnSources.Distinct();

The problem here is that I don’t use the overload that allows me to specify an equality comparer, and the class itself doesn’t have the default equality comparer.

So what’s the solution?

    var set = new HashSet<string>();

    c.DependingOnSources = c.DependingOnSources.Where(element => set.Add(element.Name));

It’s a beauty it’s it, and quite simplistic, what I do is create a HashSet of the keys I want o compare, then I use use the Linq Where statement to select all the elements that I can add to the list. If you’re familiar with HashSet you’ll know that for first time we try add an element it will be not exist in the set and it gets added to the set and returns true, because the set.Add returns true.. we satisfy the Func in the Where clause and it gets added to the items that get returned.

Simple ey.. yes true, but it gets better, we can make this a little more generic and leverage an extension method to do the lifting for us.

    internal static class LinqExtensions

    {

        public static IEnumerable DistinctBy(

                            this IEnumerable source, Func selector)

        {

            var set = new HashSet();

            return source.Where(element => set.Add(selector(element)));

        }

    }

So now we can call our method like so

    // Remove any duplicates

    c.DependingOnSources = c.DependingOnSources.DistinctBy(k => k.Name);

    Neat ey! (another common method is to use GroupBy and Select.)
