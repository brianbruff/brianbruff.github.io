---
title: "An invisible Azure Message"
date: "2011-12-29"
tags: ["Azure Service Bus"]
---

When creating an Azure queue, you specify a lock duration, once a message is read from the queue it’s marked as invisible for other readers for a period of time, e.g. one minute.

![](/images/./image.axd?picture=image_thumb_145.png)

Choosing the invisibility time is a trade-off between expected processing time and application recovery time.

When a message is dequeued, the application specifies the amount of time for which the message is invisible to workers dequeueing messages from the same queue. This time should be large enough to complete the operation specified by the queue message.

If the timeout is too large, the time it takes to finish processing the message is affected when there are failures. For example, if the invisibility time is set at 30 minutes , and the application crashes after 10 minutes, the message will not have a chance of being started again for another 20 minutes.

If the invisibility time is too small, the message may become visible when someone is still processing it. Thus, multiple workers could end up processing the same message, and one may not be able to delete the message from the queue (see the next section). 

## The application could address this as follows

1\. If the amount of time to process a message is predictable, set the invisibility timeout large enough so that a message can be completed within that time.

2\. Sometimes the processing time for different types of messages may vary significantly. In that case, one can use separate queues for different types of messages, where messages in each queue take a similar amount of time to be processed. Appropriate invisibility timeout value can then be set to each queue. 

3\. Furthermore, ensure that the operations performed on the messages are idempotent and resume-able. The following can be done to improve efficiency

a. The processing should be stopped before the invisibility time is reached to avoid redundant work. 

b. The work for a message can be done in small chunks, where a small invisibility time may be sufficient. In this way, the next time the work is picked up from the queue after it becomes visible again, the work can be resumed from where it is left off.

4\. Finally, if the message invisibility time is too short and too many dequeued messages are becoming visible before they can be deleted, applications may want to dynamically change the invisibility time that is being set for new messages put onto the queues. This could be detected by counting at the worker roles how many times message deletes are failing due to messages becoming visible. Then based on a threshold communicate that back to the front-end web roles, so they can increase the invisibility time for new messages put into the queue if the invisibility time needs to be tuned.

## Manage the invisibility on the fly

The “[Update Message](http://msdn.microsoft.com/en-us/library/hh452234.aspx)” REST API is used to extend the lease period (aka visibility timeout) and/or update the message content. A worker that is processing a message can now determine the extra processing time it needs based on the content of a message. The lease period, specified in seconds, must be >= 0 and is relative to the current time. 0 makes the message visible at that time in the queue as a candidate for processing. The maximum value for lease period is 7 days. Note, when updating the visibility timeout it can go beyond the expiry time (or time to live) that is defined when the message was added to the queue. But the expiry time will take precedence and the message will be deleted at that time from the queue.
