---
title: "Azure Service Bus"
date: "2011-12-28"
tags: ["Scalability on the Azure Platform"]
---

When communicating between roles in an Azure application we’ve a few options; to name a few:

- Http
- Tcp
- Queues

While Http and Tcp are tried and trusted they do come with some limitations that queues help overcome.

In the last few months Microsoft have released pub/sub service bus to the world. This is similar to a basic queue, in the basic queue, each message is consumed by an individual consumer, but with subscription topics, multiple clients can consume the same message, each subscription logically maintains its own queue of messages.

![](/images/./image.axd?picture=image_thumb_143.png)

The diagram above shows a typical communication between worker roles and web roles on the Azure platform.

As previously stated, this decoupling has several advantages over direct messaging.

### Load Leveling

In the system the load can vary over time, where the amount of effort in processing the mid-tier business logic remains somewhat constant, with the queue in place it’s only necessary to have enough servers to handle the average load irrelevant of peak load. This can save money in terms of infrastructure required to handle peak load.

### Temporal Decoupling

With queues decoupling the messaging effectively making the messaging async, publishers and subscriber need not be online at the same time, the service bus reliably stored the messages in the queue until the subscriber pulls them off and processes them. This allows different roles to be taken offline for maintenance etc.

### Load Balancing

As load increases more worker roles can be added to service the queue (e.g. an online toy shop around the Christmas period). The system ensures that only one worker role will process the message, also in given that the worker roles are pulling the messages off the queue, they don’t have to be running on the same infrastructure, (Azure favours multiple low power roles in comparison the fewer higher powered roles).

![](/images/./image.axd?picture=image_thumb_144.png)
