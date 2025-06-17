---
title: "Using RavenDb with Mvc WebApi"
date: "2012-04-07"
tags: ["Using RavenDb with Mvc WebApi"]
---

I’m starting this post with a disclaimer. I’m not a RavenDb expect, actually far from it, in fact I’ve only started working with it this evening!

I’m working on a pet project and getting the initial building blocks in place. I read about RavenDB in a recent edition of CODE magazine. The same magazine dealt with some other NoSql databases, e.g. Mongo Db, I’ve had a passing interest in NoSql in the last while so I wanted to get me a piece of the pie, and RavenDB jumped out at me for a few reasons.

- Written in .NET
- Scalability over RDBMS
- RestAPI (although i won’t be using it, my app will have its own REST API using RavenDb managed api underneath)
- .NET API with Linq querying
- Automatic indexing
- Scalability

So lets get started, We want to follow what’s advised in this article: <http://ravendb.net/kb/3/using-ravendb-in-an-asp-net-mvc-website> however we will be using an ApiController not your standard Controller so we have to modify the solution a little.

## Create project

Fire up visual studio and create an new MVC4 project

![](/images/./image.axd?picture=1.png)

## Add the RavenDb package,

![](/images/./image.axd?picture=2.png)

## Global.asax.cs

Do the very same that is indicated on the Raven website, We need a single Document Store in our application.

     protected void Application_Start()
            {
                AreaRegistration.RegisterAllAreas();

                RegisterGlobalFilters(GlobalFilters.Filters);
                RegisterRoutes(RouteTable.Routes);

                BundleTable.Bundles.RegisterTemplateBundles();

                InitRaven();
            }

            private void InitRaven()
            {
                Store = new DocumentStore { ConnectionStringName = "RavenDB" };
                Store.Initialize();

                IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), Store);

            }

            public static DocumentStore Store;

## Create RavenController

    public abstract class RavenController : ApiController
        {
            public RavenController()
            {
                this.AutoSave = true;
                RavenSession = TickTockBaby.Mvc.WebApiApplication.Store.OpenSession();
            }

            public bool AutoSave { get; set; }

            public IDocumentSession RavenSession { get; protected set; }

            protected override void Dispose(bool disposing)
            {
                if (disposing)
                {
                    if (RavenSession != null)
                    {
                        using (RavenSession)
                        {
                            if (this.AutoSave)
                                RavenSession.SaveChanges();
                            RavenSession.Dispose();
                            RavenSession = null;
                        }
                    }
                }

                base.Dispose(disposing);
            }
        }

Let me explain what I’ve done here…

I’ve initialized the session in the constructor, and cleaned it up in dispose, I also SaveChanges by default unless it gets switched off in a derived class.

## Derive from RavenController

    public class UsersController : RavenController
        {
            // GET /api/values
            public IEnumerable<string> Get()
            {
                this.AutoSave = false;
                return RavenSession.Query<User>().Select(u => u.Name);
            }
        }

That’s my initial attempt, hope it helps someone out a little.

I’ll post my final solution possibly using Ninject DI after I’ve used RavenDb for a while and get a better feel for it.

## Raven Studio

![](/images/./image.axd?picture=3.png)

## Check results in browser

![](/images/./image.axd?picture=4.png)
