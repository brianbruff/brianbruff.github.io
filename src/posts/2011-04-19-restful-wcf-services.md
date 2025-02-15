---
title: "RESTful WCF Services"
date: "2011-04-19"
tags: []
---

WCF not only provides SOAP, it’s also capable of providing RESTful services through use of the WebGet and WebInvoke attributes in the System.ServiceModel.Web assembly in conjunction with the webHttpBinding and webHttp behaviour. In fact, WebGet/WebInvoke are not really required required (however PUT is the default Http Verb and you won’t be able to specify what methods correspond to urls.

Here’s a sample;

    [ServiceContract]

        public interface IPersonInfo

        {

            [OperationContract]

            [WebGet(UriTemplate = "/Details")]

            string Details();

            [OperationContract]

            [WebGet(UriTemplate = "/Person")]

            Person GetRandomPerson();

            [OperationContract]

            [WebGet(UriTemplate = "/Person?format=xml", ResponseFormat = WebMessageFormat.Xml)]

            Person GetRandomPersonXml();

            [OperationContract]

            [WebGet(UriTemplate = "/Person?format=json", ResponseFormat = WebMessageFormat.Json)]

            Person GetRandomPersonJson();

        }

    [ServiceBehavior(InstanceContextMode = InstanceContextMode.Single)]

        public class PersonService : IPersonInfo

        {

            public string Details()

            {

                WebOperationContext.Current.OutgoingResponse.StatusCode = System.Net.HttpStatusCode.OK;

                return "Mon-Fri 9am to 5pm";

            }

            public Person GetRandomPerson()

            {

                return new Person { Address = "Limerick", Name = "Brian", Country = "Ireland" }; // not so random..

            }

            public Person GetRandomPersonXml()

            {

                return new Person { Address = "Limerick", Name = "Brian", Country = "Ireland" }; // not so random..

            }

            public Person GetRandomPersonJson()

            {

                return new Person { Address = "Limerick", Name = "Brian", Country = "Ireland" }; // not so random..

            }

        }

Host this service in IIS for example and you’ll be able to get the following results

![](/images//blog/image.axd?picture=image_thumb_38.png)

As REST support only arrived in WCF 3.5 there is still a lack of support in certain areas, e.g. error handling, caching etc; what I’ve seen done in practise is people continue to use the REST Starter kit from codeplex.
