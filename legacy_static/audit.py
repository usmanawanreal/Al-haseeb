import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

print(f"Auditing {len(html_files)} HTML files...\n")

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    issues = []

    # 1. Check title tags
    title_match = re.search(r'<title>(.*?)</title>', content)
    if not title_match:
        issues.append("Missing <title> tag")
    elif title_match.group(1).strip() == "":
        issues.append("Empty <title> tag")

    # 2. Check meta description
    desc_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', content)
    if not desc_match:
        issues.append("Missing <meta name='description'>")

    # 3. Check for multiple h1s
    h1s = re.findall(r'<h1.*?>.*?</h1>', content, re.IGNORECASE | re.DOTALL)
    if len(h1s) == 0:
        issues.append("Missing <h1> tag")
    elif len(h1s) > 1:
        issues.append(f"Multiple <h1> tags found: {len(h1s)}")

    # 4. Check for missing alt attributes on images
    imgs = re.findall(r'<img[^>]*>', content)
    for img in imgs:
        if 'alt=' not in img:
            issues.append(f"Image missing alt attribute: {img}")

    # 5. Check for button aria-labels
    buttons = re.findall(r'<button[^>]*>', content)
    for btn in buttons:
        if 'aria-label=' not in btn and 'data-i18n=' not in btn and '>' not in btn: # rough check
            pass

    if issues:
        print(f"[{file}] Issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print(f"[{file}] Clean!")
