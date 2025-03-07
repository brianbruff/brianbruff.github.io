---
title: "Understanding AWS Lambda Concurrent Execution Quota"
date: "2025-03-07"
description: "A comprehensive guide on AWS Lambda concurrent execution quota, how to increase it, and best practices for managing reserved capacity."
---

# Understanding AWS Lambda Concurrent Execution Quota

AWS Lambda is a powerful serverless computing service that allows you to run code without provisioning or managing servers. One of the key aspects of using AWS Lambda effectively is understanding and managing the concurrent execution quota.

## What is Concurrent Execution Quota?

The concurrent execution quota is the maximum number of Lambda function instances that can run simultaneously in your AWS account. This quota is important because it determines how many requests your Lambda functions can handle at the same time.

## How to Increase Concurrent Execution Quota

To increase the concurrent execution quota, you can use the AWS CLI to request a quota increase. Here are the steps:

### Request Quota Increase

```sh
aws service-quotas request-service-quota-increase --service-code lambda --quota-code L-B99A9384 --desired-value 10000 --region us-west-1
```

### Check Status

```sh
aws service-quotas get-requested-service-quota-change --service-code lambda --quota-code L-B99A9384 --region us-west-1
```

## Best Practices for Managing Reserved Quota

### Reserved Capacity

Reserved capacity allows you to allocate a portion of your concurrent execution quota to specific functions. This ensures that critical functions have the capacity they need to run, even during peak times.

### When to Assign Reserved Capacity

Assign reserved capacity when you have functions that are critical to your application's performance and cannot afford to be throttled. This is especially important for functions that handle high-priority tasks or real-time processing.

### Impact on Bursting

Reserved capacity puts a cap on the number of instances that can run concurrently for a specific function. While this ensures availability for critical functions, it also means that these functions cannot burst beyond the reserved limit. Therefore, it's important to carefully plan and monitor your reserved capacity settings.

### Determining Values to Set

To determine the appropriate values for reserved capacity, monitor your Lambda function metrics, such as concurrent executions and throttles. Use this data to identify patterns and set values that provide a balance between availability and cost.

## Conclusion

Managing the concurrent execution quota and reserved capacity is crucial for optimizing the performance and reliability of your AWS Lambda functions. By following best practices and using the AWS CLI to manage your quotas, you can ensure that your serverless applications run smoothly and efficiently.

Stay tuned for more technical content!
