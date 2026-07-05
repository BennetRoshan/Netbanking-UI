import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# We want to replace href="#" with href="profile.html" for the Profile link.
pattern = re.compile(r'(<a class="nav-link[^>]*?href=")("#)(">\s*<i class="bi bi-person fs-5"></i> Profile\s*</a>)')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(r'\g<1>profile.html\g<3>', content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
