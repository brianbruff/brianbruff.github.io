---
title: "Ensuring S3 Files Update with Terraform: The Power of etags"
date: "2025-02-27"
tags: ["AWS", "Terraform", "S3", "Infrastructure as Code"]
---

## The Challenge with S3 File Updates in Terraform

When managing infrastructure as code with Terraform, one common challenge is ensuring that file content in S3 buckets actually updates when the source files change. By default, Terraform will upload a file to S3 once but may not detect content changes in subsequent runs. This can be particularly frustrating when you're updating scripts, configuration files, or other assets that your infrastructure depends on.

## Understanding the Problem

Consider this simple Terraform resource that uploads a Python script to an S3 bucket:

```hcl
resource "aws_s3_object" "python_script" {
  bucket = aws_s3_bucket.data_processing_bucket.bucket
  key    = "scripts/process_data.py"
  source = "../scripts/process_data.py"
}
```

This works fine initially. However, let's say you update the Python script with important fixes or enhancements. When you run `terraform apply` again, Terraform might not detect that the source file has changed, and therefore won't update the file in S3. This happens because Terraform is tracking the resource's configuration, not the content of the source file.

## The Solution: Using etags with filemd5()

To solve this problem, we can use the `etag` attribute with Terraform's `filemd5()` function. The etag acts as a fingerprint of the file's content, changing whenever the file content changes:

```hcl
resource "aws_s3_object" "python_script" {
  bucket = aws_s3_bucket.data_processing_bucket.bucket
  key    = "scripts/process_data.py"
  source = "../scripts/process_data.py"
  etag   = filemd5("../scripts/process_data.py")
}
```

With this addition, whenever the content of `process_data.py` changes, the MD5 hash calculated by `filemd5()` will change. This new etag value will then trigger Terraform to update the S3 object during the next apply.

## Real-World Example

Here's a more comprehensive example from a data processing pipeline:

```hcl
resource "aws_s3_object" "glue_news_extract_python_script" {
  bucket = aws_s3_bucket.brian_news_infra.bucket
  key    = "glue/news/brian_news/scripts/extract-history-bronze.py"
  source = "../../brian_news/glue/scripts/extract-history-bronze.py"
  etag   = filemd5("../../brian_news/glue/scripts/extract-history-bronze.py")
}

resource "aws_s3_object" "glue_config_json" {
  bucket = aws_s3_bucket.brian_news_infra.bucket
  key    = "glue/news/brian_news/config/settings.json"
  source = "../../brian_news/glue/config/settings.json"
  etag   = filemd5("../../brian_news/glue/config/settings.json")
}
```

In this example, both the Python script and a JSON configuration file will be updated in S3 whenever their content changes.

## Understanding filemd5()

The `filemd5()` function in Terraform:

1. Reads the file from disk
2. Calculates its MD5 hash
3. Returns the hash as a hex-encoded string

This MD5 hash acts as a unique identifier for the file's content, changing if even a single byte in the file changes.

## Best Practices

When using etags with S3 objects:

1. **Always use the same path** for both the `source` and `etag` parameters to ensure consistency
2. **Consider using content_type** if you need proper MIME types for your files:
   ```hcl
   content_type = "application/python"
   ```
3. **Add server-side encryption** for sensitive files:
   ```hcl
   server_side_encryption = "AES256"
   ```
4. **Be aware of large files** - calculating MD5 hashes for very large files might impact performance during Terraform planning

## Conclusion

Using the `etag` attribute with `filemd5()` is a simple but powerful technique to ensure your S3 files stay in sync with their sources when managed by Terraform. This approach makes your infrastructure as code more reliable by ensuring that content changes are always properly deployed.

Next time you're managing files in S3 with Terraform, remember to add that etag to avoid the frustration of unchanged files!
