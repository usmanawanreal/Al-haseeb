import os
from datetime import datetime

# 1. Generate robots.txt
robots_content = """User-agent: *
Allow: /

Sitemap: https://alhaseeb.pk/sitemap.xml
"""
with open('robots.txt', 'w', encoding='utf-8') as f:
    f.write(robots_content)

# 2. Generate sitemap.xml
html_files = [f for f in os.listdir('.') if f.endswith('.html')]
today = datetime.now().strftime('%Y-%m-%d')

sitemap_urls = ""
for file in html_files:
    priority = "1.0" if file == "index.html" else "0.8"
    sitemap_urls += f"""  <url>
    <loc>https://alhaseeb.pk/{file}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{priority}</priority>
  </url>\n"""

sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{sitemap_urls}</urlset>"""

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

# 3. Inject theme-color meta tag into all HTML files
theme_meta = '<meta name="theme-color" content="#1e3a8a">'
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'name="theme-color"' not in content:
        content = content.replace('</head>', f'  {theme_meta}\n</head>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print("Generated robots.txt, sitemap.xml, and injected theme-color.")
