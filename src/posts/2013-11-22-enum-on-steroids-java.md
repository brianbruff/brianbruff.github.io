---
title: "Enum on steroids – java"
date: "2013-11-22"
tags: ["java", "enum"]
---

Hi was reviewing some java code this week and came across this wonderful way of establishing structured enums.

## Code

//Declaration   
private enum ServerType {   
DEV("[https://server1:8001](https://server1:8001)", "customservicesuser", "xzy"),   
TEST("[http://server2:8001](http://server2:8001)", "customservicesuser", "xzy"),   
PROD("[http://server3:8001](http://server3:8001)", "customservicesuser", "xzy"),   
LOCALHOST("[http://localhost:8001](http://localhost:8001)", "customservicesuser", "xzy");

private String serverUrl;   
private String username;   
private String password;

ServerType(String serverUrl, String username, String password) {   
this.serverUrl = serverUrl;   
this.username = username;   
this.password = password;   
}   
}

// Usage   
try {   
serverType = ServerType.valueOf(server);   
} catch (Exception e) {   
System.out.println("Unable to get the server info, options are:   
DEV, TEST, PROD, LOCALHOST");   
}

Enjoy!
