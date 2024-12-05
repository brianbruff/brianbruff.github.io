---
layout: post
title:  "Getting Started"
date:   2024-12-03 14:16:03 +0000
categories: jekyll update
---
Welcome to hell

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight python %}

import boto3
 
# Specify the bucket name
bucket_name = 'my-bucket'
 
s3 = boto3.resource('s3')
 
bucket = s3.Bucket(bucket_name)
 
# Initialize oldest_file and oldest_date to None
oldest_file = None
oldest_date = None
 
# Iterate through all files in the bucket
for obj in bucket.objects.all():
    # If oldest_file is None, or this file was modified before the oldest file
    # then update oldest_file and oldest_date to this file's name and last_modified date
    if oldest_file is None or obj.last_modified < oldest_date:
        oldest_file = obj.key
        oldest_date = obj.last_modified
 
# Print the oldest file's name and its last_modified date
if oldest_file is not None:
    print('The oldest file is {0} and was last modified on {1}'.format(oldest_file, oldest_date))
else:
    print('No files in bucket')

{% endhighlight %}

