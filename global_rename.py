import os

replacements = {
    'SENAI': 'Inteligência Educacional Interativa',
    'Senai': 'Inteligência Educacional Interativa'
}

for root, dirs, files in os.walk('.'):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    if '.next' in dirs:
        dirs.remove('.next')
    if 'dist' in dirs:
        dirs.remove('dist')
    if '.git' in dirs:
        dirs.remove('.git')
        
    for file in files:
        if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.md', '.json', '.html', '.css')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated: {file_path}")
