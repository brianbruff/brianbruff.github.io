---
title: "Supporting WSE plain text password with WCF BasicHttpBinding"
date: "2011-11-16"
tags: ["WSE Security"]
---

Hi all,

Ok, so I did a bit of googling to see if this had been done by someone else, turns out I failed to find a suitable solution, just many frustrated people.

So this post is an attempt to make those people a little happier.

The solutions is as follows(, It’s a bit rough around the edges at the moment as I have just got it working and have not yet cleaned up the code).

- Firstly, I created a binding to manage the header

  public class MyBehavior : BehaviorExtensionElement, IEndpointBehavior

      {

          public MyBehavior(string userName, string password)

          {

              this.UserName = userName;

              this.Password = password;

          }

          #region IEndpointBehavior Members

          public void AddBindingParameters(ServiceEndpoint endpoint, BindingParameterCollection bindingParameters)

          {

          }

          public void ApplyClientBehavior(ServiceEndpoint endpoint, ClientRuntime clientRuntime)

          {

              clientRuntime.MessageInspectors.Add(new MyMessageInspector(this.UserName, this.Password));

          }

          public void ApplyDispatchBehavior(ServiceEndpoint endpoint, EndpointDispatcher endpointDispatcher)

          {

          }

          public void Validate(ServiceEndpoint endpoint)

          {

          }

          #endregion

          public override Type BehaviorType

          {

              get

              {

                  return typeof(MyBehavior);

              }

          }

          protected override object CreateBehavior()

          {

              return new MyBehavior(this.UserName, this.Password);

          }

          public string UserName { get; set; }

          public string Password { get; set; }

      }

Ok so now we can see this behavior adds a MessageInspector to every message. lets take a look at what the message inspector does.

- MessageInspector

  class MyMessageInspector : IClientMessageInspector
  {
  public MyMessageInspector(string username, string password)
  {
  \_username = username;
  \_password = password;
  }

      public void AfterReceiveReply(ref System.ServiceModel.Channels.Message reply, object correlationState)
      {

      }

      public object BeforeSendRequest(ref System.ServiceModel.Channels.Message request, System.ServiceModel.IClientChannel channel)
      {
          var header = new WseHeader(_username, _password);

          request.Headers.Add(header);

          return null;
      }

      private string _username;
      private string _password;

  }

So here in my message inspector I add a new header.

In fact it’s this header that was making life hard for most people.

- WseHeader

  class WseHeader : MessageHeader

      {

          public WseHeader(string userName, string password)

          {

              this.UserName = userName;

              this.Password = password;

          }

          public string UserName

          {

              get;

              private set;

          }

          private string Password

          {

              get;

              set;

          }

          protected override void OnWriteStartHeader(System.Xml.XmlDictionaryWriter writer, MessageVersion messageVersion)

          {

              base.OnWriteStartHeader(writer, messageVersion);

              writer.WriteAttributeString("s:mustUnderstand", "0");

              writer.WriteAttributeString("xmlns:wsse", WsseNamespaceToken);

              writer.WriteAttributeString("xmlns:s", "http://schemas.xmlsoap.org/soap/envelope/");

          }

          protected override void OnWriteHeaderContents(System.Xml.XmlDictionaryWriter writer, MessageVersion messageVersion)

          {

              writer.WriteRaw(Properties.Resources.WseHeaderText.Replace("{USERNAME}",

                  this.UserName).Replace("{PASSWORD}", this.Password));

          }

          public override string Name

          {

              get { return "wsse:Security"; }

          }

          public override string Namespace

          {

              get { return ""; }

          }

          public override bool MustUnderstand

          {

              get

              {

                  return false;

              }

          }

          private const string WsseNamespaceToken = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd";

      }

This class will create a header like this

    <wsse:Security s:mustUnderstand="0" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">

        <wsse:UsernameToken wsu:Id="SecurityToken-3f7f983f-66ce-480d-bce6-170632d33f92" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">

            <wsse:Username>bek@anchorwsse:Username>

            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">dotnetrockswsse:Password>

        wsse:UsernameToken>

        wsse:Security>

- Please note I’m getting the body of the header from a project resource, here it is WseHeaderText

  "SecurityToken-3f7f983f-66ce-480d-bce6-170632d33f92" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">

      {USERNAME}

      "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">{PASSWORD}

I just replace the username and password in code in the MessageHeader. I could probably do all this neater with the API but it’s good enough for my investigation tonight, I usually just add the WSE header directly into my configuration file and not bother with the behavior.

e.g.

    <client>

              <endpoint address="http://anchor:8083/gdm/TemplateActionsService/TemplateActionsService" binding="basicHttpBinding" bindingConfiguration="TemplateActionsServiceSoapBinding" contract="TemplateActionsProxy.TemplateActionsServiceType" name="TemplateActionsServicePort">

              endpoint>

            client>

So I hope this helps somebody else. ![Ninja](./image.axd?picture=wlEmoticon-ninja_1.png)
