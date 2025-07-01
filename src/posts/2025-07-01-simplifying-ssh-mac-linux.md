---
title: "Simplifying SSH"
date: "2025-07-01"
tags: ["blog", "ssh"]
---



# How to SSH into a Linux Machine from macOS Without Typing Everything Every Time

If you're tired of repeatedly typing `ssh user@host` and entering your password every time you connect to a Linux machine from macOS, there's a much better and more secure way to streamline your workflow.

This guide will walk you through setting up **SSH key-based authentication** and using an **SSH config file** for effortless connections.

---

## ✅ Step 1: Generate an SSH Key (If You Don’t Already Have One)

First, check if an SSH key already exists:

```bash
ls ~/.ssh/id_rsa.pub
```

If it doesn't, generate a new one:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Press `Enter` to accept the default location and file name when prompted.

---

## ✅ Step 2: Copy Your SSH Key to the Linux Host

### Option A: Using `ssh-copy-id` (Recommended)

```bash
ssh-copy-id user@host
```

This will append your public key to the `~/.ssh/authorized_keys` file on the remote Linux machine and set proper permissions.

### Option B: Manual Copy (If `ssh-copy-id` is not available)

```bash
cat ~/.ssh/id_rsa.pub | ssh user@host 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

After this, you should be able to log in without a password:

```bash
ssh user@host
```

---

## ✅ Step 3: Create an SSH Config Entry

To avoid typing the full `ssh user@host` every time, create a short alias using the SSH config file.

Edit or create `~/.ssh/config`:

```bash
nano ~/.ssh/config
```

Add the following block:

```ini
Host myserver
    HostName your.remote.host
    User your_user
    IdentityFile ~/.ssh/id_rsa
```

Now you can connect with a simple command:

```bash
ssh myserver
```

---

## ✅ Bonus: Integrate with macOS Keychain

If you use a passphrase with your SSH key, macOS can remember it securely in your Keychain.

Extend your SSH config entry:

```ini
Host myserver
    HostName your.remote.host
    User your_user
    IdentityFile ~/.ssh/id_rsa
    AddKeysToAgent yes
    UseKeychain yes
```

Then add the key to your Keychain:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_rsa
```

---

## ✅ Optional: Use a Modern SSH Key Algorithm

RSA is still widely used, but you can opt for a more modern and secure algorithm like Ed25519:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

If you do this, make sure to update your SSH config to point to the new key (e.g., `~/.ssh/id_ed25519`).

---

## 🧠 Summary

By using SSH keys and the `~/.ssh/config` file, you can streamline your SSH workflow and connect to remote Linux machines quickly and securely.

### Benefits

- 🔒 More secure than using passwords
- 🚀 Faster login experience
- 💼 Easily manage multiple SSH connections with aliases
- 🍎 Seamlessly integrates with macOS Keychain

---

## 🙋‍♂️ Extras

Let me know if you'd like to:

- Alias a working directory when connecting
- Automatically run commands on login
- Manage multiple remote hosts with different credentials

Happy SSH'ing! 🧑‍💻
