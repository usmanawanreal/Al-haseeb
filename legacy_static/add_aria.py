import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add ARIA to Language Toggle
    content = re.sub(r'(<button[^>]*id="langToggleMobile"[^>]*)>', r'\1 aria-label="Toggle language">', content)
    content = re.sub(r'(<button[^>]*id="langToggle"[^>]*)>', r'\1 aria-label="Toggle language">', content)
    
    # Add ARIA to Navbar Toggler
    if 'aria-label="Toggle navigation"' not in content:
        content = re.sub(r'(<button class="navbar-toggler"[^>]*)>', r'\1 aria-label="Toggle navigation">', content)
        
    # Add ARIA to Emergency call buttons
    content = re.sub(r'(<a[^>]*href="tel:[^>]*)(?!.*?aria-label)(.*?>)', r'\1 aria-label="Call clinic directly"\2', content)
    
    # Add ARIA to WhatsApp buttons
    content = re.sub(r'(<a[^>]*href="https://wa\.me/[^>]*)(?!.*?aria-label)(.*?>)', r'\1 aria-label="Chat with us on WhatsApp"\2', content)
    
    # Fix potential double aria-labels if script is run multiple times
    content = re.sub(r'aria-label="[^"]*" aria-label="[^"]*"', 'aria-label="Chat with us on WhatsApp"', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Injected ARIA labels into {len(html_files)} files for accessibility.")
