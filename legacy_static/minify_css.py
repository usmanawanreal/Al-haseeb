import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Simple CSS minifier
# Remove comments
css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
# Remove newlines and extra spaces
css = re.sub(r'\s+', ' ', css)
# Remove spaces around tokens
css = re.sub(r'\s*([\{\}\:\;\,\>])\s*', r'\1', css)
# Remove last semicolon in block
css = css.replace(';}', '}')

with open('css/style.min.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Minified CSS successfully.")
