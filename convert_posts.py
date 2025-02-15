import os
import xml.etree.ElementTree as ET
from html import unescape
import re
from datetime import datetime
import html2text
import shutil
import requests
from urllib.parse import urlparse

def download_image(url, output_dir):
    try:
        # Extract filename from URL, handling both image.axd and normal URLs
        if 'image.axd?picture=' in url:
            filename = url.split('image.axd?picture=')[-1].split('&')[0]
        else:
            filename = os.path.basename(urlparse(url).path)
        
        output_path = os.path.join(output_dir, filename)
        
        # Only download if file doesn't exist
        if not os.path.exists(output_path):
            response = requests.get(url)
            response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded image: {filename}")
            
        return filename
    except Exception as e:
        print(f"Error downloading image {url}: {str(e)}")
        return None

def clean_markdown(content):
    # Remove horizontal rules that were converted from tables
    content = re.sub(r'\n\s*---\s*\n', '\n\n', content)
    
    # Clean up image references to use simple Markdown syntax
    content = re.sub(r'\[!\[.*?\]\((.*?)\)\]\(.*?\)', r'![](/images/\1)', content)
    
    # Remove extra newlines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    return content

def process_image_references(content, input_files_dir, output_images_dir):
    # Create images directory if it doesn't exist
    os.makedirs(output_images_dir, exist_ok=True)
    
    # First handle any HTML img tags
    img_pattern = r'<img[^>]+src=[\'"]([^\'"]+)[\'"]'
    matches = re.finditer(img_pattern, content)
    for match in matches:
        old_url = match.group(1)
        if old_url.startswith('http'):
            # Download remote image
            filename = download_image(old_url, output_images_dir)
            if filename:
                content = content.replace(old_url, f"/images/{filename}")
        else:
            # Handle local file
            filename = os.path.basename(old_url)
            src_path = os.path.join(input_files_dir, filename)
            dst_path = os.path.join(output_images_dir, filename)
            if os.path.exists(src_path):
                shutil.copy2(src_path, dst_path)
                print(f"Copied image: {filename}")
                content = content.replace(old_url, f"/images/{filename}")
    
    # Convert HTML to Markdown
    h = html2text.HTML2Text()
    h.body_width = 0  # Don't wrap lines
    content = h.handle(content)
    
    # Then handle any remaining Markdown image references
    img_pattern = r'!\[.*?\]\((.*?)\)'
    matches = re.finditer(img_pattern, content)
    for match in matches:
        old_path = match.group(1)
        if old_path.startswith('http'):
            # Download remote image
            filename = download_image(old_path, output_images_dir)
            if filename:
                content = content.replace(old_path, f"/images/{filename}")
        else:
            # Handle local file
            filename = os.path.basename(old_path)
            src_path = os.path.join(input_files_dir, filename)
            dst_path = os.path.join(output_images_dir, filename)
            if os.path.exists(src_path):
                shutil.copy2(src_path, dst_path)
                print(f"Copied image: {filename}")
                content = content.replace(old_path, f"/images/{filename}")
    
    # Clean up the Markdown content
    content = clean_markdown(content)
    
    return content

def convert_xml_to_md(xml_path, output_dir, input_files_dir, output_images_dir):
    # Parse XML
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Extract metadata
    title = root.find('title').text
    pub_date = datetime.strptime(root.find('pubDate').text, '%Y-%m-%d %H:%M:%S')
    content = unescape(root.find('content').text or '')
    tags = [tag.text for tag in root.find('tags').findall('tag')]
    
    # Process and update image references (before converting to Markdown)
    content = process_image_references(content, input_files_dir, output_images_dir)
    
    # Create frontmatter
    frontmatter = f"""---
title: "{title}"
date: "{pub_date.strftime('%Y-%m-%d')}"
tags: [{', '.join(f'"{tag}"' for tag in tags)}]
---

"""
    
    # Combine frontmatter and content
    full_content = frontmatter + content
    
    # Create filename from date and title
    slug = re.sub(r'[^a-zA-Z0-9-]', '-', title.lower())
    slug = re.sub(r'-+', '-', slug)  # Replace multiple hyphens with single hyphen
    filename = f"{pub_date.strftime('%Y-%m-%d')}-{slug}.md"
    
    # Save to file
    output_path = os.path.join(output_dir, filename)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_content)
    
    return output_path

# Process all XML files
input_dir = "engine/posts"
output_dir = "src/posts"
input_files_dir = "engine/files"
output_images_dir = "static/images"  # Gatsby conventionally serves static files from here

# Create output directories if they don't exist
os.makedirs(output_dir, exist_ok=True)
os.makedirs(output_images_dir, exist_ok=True)

for filename in os.listdir(input_dir):
    if filename.endswith('.xml'):
        input_path = os.path.join(input_dir, filename)
        try:
            output_path = convert_xml_to_md(input_path, output_dir, input_files_dir, output_images_dir)
            print(f"Converted {filename} to {os.path.basename(output_path)}")
        except Exception as e:
            print(f"Error converting {filename}: {str(e)}")