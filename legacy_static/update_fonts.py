import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Inter with Outfit
    content = content.replace('family=Inter:wght@400;500;600;700;800', 'family=Outfit:wght@300;400;500;600;700;800')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated fonts in HTML files.")
