---
title: "Configuring JetBrains Rider to use AWS Lambda Test Tool"
date: "2023-06-06"
tags: []
---

eveloping serverless applications using AWS Lambda can be an exciting journey into the world of event-driven programming. However, testing and debugging these applications can be a slightly more intricate process than usual. Fortunately, AWS provides a valuable tool known as the 'AWS Lambda Test Tool' that simplifies local testing and debugging of your Lambda functions.

In this blog post, we will walk you through configuring JetBrains Rider IDE to work with the AWS Lambda Test Tool. While this guide focuses on one specific method of setup, it's important to note that there are multiple ways to achieve local testing of AWS Lambda functions. Rider itself has excellent Lambda tooling capabilities that work with Docker, providing a more integrated and managed environment for your development needs.

We'll be using the latest version of Rider (2023.1.2) for this guide.

## Prerequisites

To follow this guide, you will need:

1. JetBrains Rider installed on your machine. If you don't have it installed, you can download it from the [JetBrains official website](https://www.jetbrains.com/rider/download/).
2. The AWS Toolkit for Rider, which is a plugin that integrates AWS resources into your Rider development workflow.
3. The .NET Core SDK.
4. AWS Lambda Test Tool.

## Steps to Configure

### Step 1: Install AWS Lambda Test Tool

The AWS Lambda Test Tool is a .NET Core Global Tool. You can install it using the following command:

    dotnet tool install -g Amazon.Lambda.TestTool-6.0

### Step 2: Configure Rider

Once the AWS Lambda Test Tool is installed, we need to configure Rider to use it. This involves modifying the launch settings, which can be found within your project folder, typically at the following path:

    YOUR_PROJECT_NAME/Properties/launchSettings.json

Open the `launchSettings.json` file in Rider, and replace the existing content with the following JSON:

    {
      "profiles": {
        "Mock Lambda Test Tool Rider": {
          "commandName": "Executable",
          "commandLineArgs": "\\Amazon.Lambda.TestTool.BlazorTester.dll --port 5050",
          "workingDirectory": "$(ProjectDir)",
          "executablePath": "dotnet"
        }
      }
    }

Please replace ``with the actual path to the`Amazon.Lambda.TestTool.BlazorTester.dll` on your system. Save your changes and close the file.

### Step 3: Test Your Setup

With all configurations set, it's time to test your setup. Go back to Rider and from the `Run` menu, select `Edit Configurations...` Here, you should be able to see the `Mock Lambda Test Tool Rider` profile you just added.

Select this profile and then click on the 'Run' button. This should launch the AWS Lambda Test Tool, and a new browser window should open at `http://localhost:5050` where you can interact with your Lambda function locally.

## Alternate Method: Using Docker with Rider

As previously mentioned, Rider has built-in support for Docker, which can be leveraged to create a more controlled environment for testing your AWS Lambda functions. This approach would involve using AWS's docker-lambda images to replicate the live AWS Lambda environment and debug your functions.

This approach offers several benefits, such as:

1. Running your function in an environment that closely mimics the live AWS Lambda environment.
2. Simulating event sources like Amazon S3, Amazon DynamoDB, and others.
3. Easier management of dependencies and environment variables.

To use this approach, you'll need Docker installed

on your machine, and you may also need to adjust your Rider settings to enable Docker support.

## Conclusion

The AWS Lambda Test Tool greatly facilitates the local testing of serverless applications. Coupled with the powerful features of JetBrains Rider, integrating this testing process into your development workflow becomes a breeze. While we have covered one particular setup method in this guide, it's important to remember that there are multiple ways to achieve local testing of AWS Lambda functions, including leveraging Docker with Rider's built-in support. Happy coding!
