import os
import re

seo_tags = """  <meta name="keywords" content="Home Healthcare, Shakargarh, Narowal, Medical Services at Home, 24/7 Emergency Medical, IV Drip at home, Wound care at home, Injection at home, Catheter Care, Blood Sampling">
  <meta property="og:title" content="Al-Haseeb Medical Health Care Center">
  <meta property="og:description" content="24/7 Professional home healthcare in Shakargarh, Narowal. Injections, wound care, IV drips & emergency visits.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1200&h=630&fit=crop&q=80">
  <meta property="og:url" content="https://alhaseeb.pk">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">"""

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add SEO tags right after description meta tag
    if '<meta name="keywords"' not in content:
        content = re.sub(r'(<meta name="description" content=".*?">)', r'\1\n' + seo_tags, content)

    # Change css and js links to minified versions
    content = content.replace('css/style.css', 'css/style.min.css')
    content = content.replace('js/script.js', 'js/script.min.js')

    # Ensure lazy loading on images, except for eager ones
    content = re.sub(r'<img(?!.*?loading="eager")(?!.*?loading="lazy")(.*?)>', r'<img loading="lazy"\1>', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} HTML files for SEO and minification links.")
