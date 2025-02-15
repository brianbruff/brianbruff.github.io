---
title: "Powershell Oracle Db Backup"
date: "2017-04-25"
tags: ["Oracle Export 7-Zip and upload to S3"]
---

Hi all,

I thought I would share with you this quick Powershell script I created to Export an oracle database, 7Zip it and then upload it to AmazonS3

## Export.ps1

param([String]$dumpname=(get-date -format dd-MM-yyyy)) Set-Alias sz "$env:ProgramFiles\7-Zip\7z.exe" expdp / DIRECTORY=dmpdir DUMPFILE=$dumpname.dmp LOGFILE=$dumpname.log sz a -mx "$dumpname.7z" "$dumpname.*" Write-S3Object -bucket "company-ps" -profilename brian.keating  -file "$dumpname.7z" -key "customer/dbdumps/$dumpname.7z" remove-item "$dumpname.dmp" remove-item "$dumpname.log"   

## How it works:

It uses the current date as the dumpname variable (unless specified as a parameter to the script)

It uses Oracle DbPump to export the database (assumes 7-Zip is installed in %\program files\\)

It then writes the 7z file to AWS S3

Finally it removes the dump and log files.

### AWS Powershell

ASW Powershell is installed on this server and I have already set a profile “brian.keating” with the following command.

set-awscredentials –AccessKey  –SecretKey  -storeAs brian.keating

## Trivia

The server in this case is running in AWS, the 7zipped db is about 4Gb, and it uploads to S3 in about 30seconds (nice!)
