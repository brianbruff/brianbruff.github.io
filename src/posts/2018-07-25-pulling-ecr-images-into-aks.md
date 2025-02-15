---
title: "Pulling ECR images into AKS"
date: "2018-07-25"
tags: ["imagePullSecrets", "AKS", "ECR", "job", "cronjob"]
---

Hi everyone,

Recently I found myself using Azure managed Kubernetes (AKS), however the images I wanted to pull were in AWS ECR. If my k8s cluster was in AWS it would be transparent to me provided the IAM user had permission but, in order to pull such an image from Azure; one can create a secret and to pull the image, sadly (or maybe thankfully) this secret expires after 12 hours so we need to keep refreshing.

Below I present an approach which could be used, it creates a service account (note I apply the permissions to the default account also as some of my deployments dont reference this service account yet) for pulling the image with RBAC, permissions, there is a kubernetes job that will execute immediately and a cronjob that will execute every 8 hours thereafter

Just use this secret in your deployments 

spec:

imagePullSecrets:

\- name: dg-ecr-pull

Hope this is of benefit to others! remember to update those  sections!
