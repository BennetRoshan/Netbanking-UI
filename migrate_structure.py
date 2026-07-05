import os
import re
import shutil

# Target directories
DIRS = [
    'auth', 'dashboard', 'transfers', 'loans', 'cards', 
    'investments', 'support', 'info', 'scripts'
]

# File mappings
FILE_MAP = {
    # Auth
    'login.html': 'auth',
    'signup.html': 'auth',
    'forgot-password.html': 'auth',
    # Dashboard
    'dashboard.html': 'dashboard',
    'profile.html': 'dashboard',
    'profile-settings.html': 'dashboard',
    'account.html': 'dashboard',
    'statements.html': 'dashboard',
    # Transfers
    'fund-transfer.html': 'transfers',
    'fund-transfer-internal.html': 'transfers',
    'fund-transfer-scheduled.html': 'transfers',
    'fund-transfer-upi.html': 'transfers',
    'payments.html': 'transfers',
    'account-top-up.html': 'transfers',
    'manage-beneficiaries.html': 'transfers',
    'manage-nominees.html': 'transfers',
    # Loans
    'loans.html': 'loans',
    'new-loan.html': 'loans',
    'loan-tracking.html': 'loans',
    'loans-emi.html': 'loans',
    'loan-eligibility.html': 'loans',
    # Cards & Investments
    'cards.html': 'cards',
    'investments.html': 'investments',
    # Support
    'support.html': 'support',
    'support-accounts.html': 'support',
    'support-cards.html': 'support',
    'support-fund-transfer.html': 'support',
    'support-loans.html': 'support',
    'support-payments.html': 'support',
    'service-accounts.html': 'support',
    'service-cards.html': 'support',
    'service-fund-transfer.html': 'support',
    'service-investments.html': 'support',
    'service-loans.html': 'support',
    'service-payments.html': 'support',
    'faqs.html': 'support',
    # Info
    'about.html': 'info',
    'company.html': 'info',
    'legal.html': 'info',
    'kyc.html': 'info',
}

def is_script_file(filename):
    if filename in ['package.json', 'package-lock.json']: return False
    return filename.endswith('.js') or filename.endswith('.ps1') or filename.endswith('.py')

def get_depth_prefix(current_folder, target_folder):
    if current_folder == target_folder:
        return ""
    if current_folder == "":
        return target_folder + "/"
    if target_folder == "":
        return "../"
    return f"../{target_folder}/"

def rewrite_links_in_content(content, current_filename, current_folder):
    def replace_link(match):
        full_match = match.group(0)
        attr = match.group(1)
        url = match.group(2)
        
        # Skip absolute URLs and anchors
        if url.startswith('http') or url.startswith('mailto:') or url.startswith('#') or url == '':
            return full_match
            
        # Extract filename and potential hash/query
        parts = url.split('#', 1)
        base_url = parts[0]
        hash_part = f"#{parts[1]}" if len(parts) > 1 else ""
        
        # If the URL is just a folder or asset (e.g. css/style.css)
        if '/' in base_url and not base_url.startswith('../'):
            if current_folder != "" and current_folder != "admin":
                # We are in a subfolder, so prepend ../
                new_url = f"../{url}"
                return f"{attr}=\"{new_url}\""
            return full_match
            
        # If it points to an HTML file in the root directory
        filename = os.path.basename(base_url)
        if filename in FILE_MAP:
            target_folder = FILE_MAP[filename]
        elif filename == 'index.html':
            target_folder = ""
        elif url.startswith('../') and current_folder == 'admin':
            # Admin files referencing root files
            target_folder = FILE_MAP.get(filename, "")
        else:
            # Maybe it's a file that didn't move, or an asset
            if current_folder != "" and current_folder != "admin" and '/' not in base_url and not base_url.startswith('../'):
                return f"{attr}=\"../{url}\""
            return full_match
            
        prefix = get_depth_prefix(current_folder, target_folder)
        new_url = f"{prefix}{filename}{hash_part}"
        return f"{attr}=\"{new_url}\""

    # Replace href="...", src="..."
    content = re.sub(r'(href|src)="([^"]+)"', replace_link, content)
    # Replace window.location.href = '...'
    
    def replace_window_location(match):
        orig_url = match.group(2)
        # Create a fake href match to pass into replace_link
        fake_match = type('Match', (object,), {'group': lambda self, i: ('href="' + orig_url + '"', 'href', orig_url)[i]})()
        replaced = replace_link(fake_match)
        # Extract the replaced url
        new_url = re.search(r'href="([^"]+)"', replaced).group(1)
        return f"{match.group(1)}{new_url}{match.group(3)}"
        
    content = re.sub(r'(window\.location\.href\s*=\s*[\'"])([^"m\']+)([\'"])', replace_window_location, content)
    
    # Also replace window.location.href in onclick="window.location.href='...'"
    content = re.sub(r'(onclick=[\'"]window\.location\.href=[\'"])([^"\']+)([\'"][\'"])', replace_window_location, content)

    return content

def main():
    root = "c:\\Users\\benne\\Downloads\\Nexus bank front end"
    os.chdir(root)
    
    # Create dirs
    for d in DIRS:
        os.makedirs(d, exist_ok=True)
        
    # Gather all HTML files (root and admin)
    all_html_files = []
    for dirpath, _, filenames in os.walk(root):
        if 'node_modules' in dirpath or '.git' in dirpath: continue
        for f in filenames:
            if f.endswith('.html'):
                all_html_files.append(os.path.join(dirpath, f))
                
    # Also include JS files in admin and js folder
    js_files = []
    for dirpath, _, filenames in os.walk(root):
        if 'node_modules' in dirpath or '.git' in dirpath: continue
        for f in filenames:
            if f.endswith('.js'):
                js_files.append(os.path.join(dirpath, f))

    # Process HTML and JS files
    for filepath in all_html_files + js_files:
        filename = os.path.basename(filepath)
        rel_dir = os.path.dirname(os.path.relpath(filepath, root)).replace('\\', '/')
        
        # Determine its CURRENT folder (before move)
        current_folder = rel_dir if rel_dir != "." else ""
        
        # For HTML files in root that are scheduled to move, we process them assuming they are ALREADY moved
        if filename in FILE_MAP and current_folder == "":
            assumed_folder = FILE_MAP[filename]
        else:
            assumed_folder = current_folder
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = rewrite_links_in_content(content, filename, assumed_folder)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
    # Move files
    for filename, target_folder in FILE_MAP.items():
        if os.path.exists(filename):
            shutil.move(filename, os.path.join(target_folder, filename))
            
    # Move root scripts
    for filename in os.listdir(root):
        if os.path.isfile(filename) and is_script_file(filename) and filename != 'migrate_structure.py':
            shutil.move(filename, os.path.join('scripts', filename))

if __name__ == "__main__":
    main()
