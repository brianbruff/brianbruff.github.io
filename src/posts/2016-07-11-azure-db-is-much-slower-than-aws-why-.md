---
title: "Azure DB is much slower than AWS, why?"
date: "2016-07-11"
tags: []
---

This is a rather unusual post for me, while I’ve gone to the trouble of getting certified on both Azure and AWS platforms and try to make my posts on the same as unbiased as possible, the fact is that I’m pro Azure, and always have been, perhaps it’s because I’ve grown up on Microsoft Stacks, perhaps it’s because other platforms offer such a myriad of options that’s it not only hard to pick some, but getting the to work cohesively is beyond painful.

Whether I remain pro Azure is at a tipping point as it appears I’m struggling to get Azure to offer the same performance when it comes to relational databases ( both with Oracle and Sql Server). Let me be clear that I don’t have all the answers for what I’m about to present, I have some ideas sure, but this post will not answer them, I simply intent to present a few scenarios with various applications that I’ve attempted to lift and shift to the cloud and why in a near like for like comparison with similar infrastructure with AWS, AWS is much much faster, in fact it’s near 2x faster!

### Use cases

The following 3 scenarios behaved much better on AWS than Azure, we’re going to focus on 1 & 2 below and ignore the fact that the general responsiveness of the applications using Azure database we much worse (because we didn’t benchmark any of them).

- Scenario 1: Writing 500MB raw numeric to DB in 5 records
- Scenario 2: Writing 1MB raw data to database
- Scenario 3: General responsiveness

#### Scenario 1

The database of choice for this scenario was Oracle Standard Edition.

Hardware Platforms

##### Laptop

Dual core hyper treaded i7 mobile chip. 2.9GHZ  
16GB Ram  
Local SSD ScanDisk, approx 90k IOPS

##### Azure

4 Core Xeon 2.4GHZ  
14GB Ram  
20K premium disks  
12,8K IOPS throttle

##### AWS

4 Core Xeon, 2.9GHZ  
16GB RAM  
20k provisioned I/O  
Unadvertised throttling

##### RESULTS

![](/images/./image.axd?picture=image_thumb_434.png)

######

TODO CHANGE NAME  
azure  
Processed 1387264 pages for database 'dbEonDev', file 'dbEonDev_Data' on file 1.  
Processed 10 pages for database 'dbEonDev', file 'dbEonDev_Log' on file 1.  
BACKUP DATABASE successfully processed 1387274 pages in 42.542 seconds (254.761 MB/sec).

local Processed 1427504 pages for database 'dbEonDev', file 'dbEonDev_Data' on file 1.  
Processed 8 pages for database 'dbEonDev', file 'dbEonDev_Log' on file 1.  
BACKUP DATABASE successfully processed 1427512 pages in 28.870 seconds (386.298 MB/sec).  
ec2 Processed 1339168 pages for database 'dbEonDev', file 'dbEonDev_Data' on file 1.  
Processed 2 pages for database 'dbEonDev', file 'dbEonDev_Log' on file 1.  
BACKUP DATABASE successfully processed 1339170 pages in 86.767 seconds (120.578 MB/sec).  
![](/images/./image.axd?picture=image_thumb_427.png)

### Azure

![](/images/./image.axd?picture=image_thumb_428.png)

8k IOPS, on all workers

All workers:

![](/images/./image.axd?picture=image_thumb_429.png)

One Worker, started out with 80k IOPS, degrading to 14k over I minute run

![](/images/./image.axd?picture=image_thumb_430.png)

Azure premium

![](/images/./image.axd?picture=image_thumb_431.png)

Attached 6 disks, each 5k, for a total of 30k IOPS RAID0

![](/images/./image.axd?picture=image_thumb_432.png)

###

### AWS

Provisioned 20k IOPS, getting 13.5K sustained

![](/images/./image.axd?picture=image_thumb_433.png)

C: Drive SSD (1TB 3k IOPS drive)

Costs
