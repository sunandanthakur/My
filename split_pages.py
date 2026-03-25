import re
import os
import shutil

# Copy images
os.makedirs("assets", exist_ok=True)
src_dir = "/Users/sunandanthakur/.gemini/antigravity/brain/0ea378e2-7fc6-4377-98b8-f9e57eaf4e2e/"
for file in os.listdir(src_dir):
    if file.endswith(".png"):
        if "space_project_thumbnail" in file:
            shutil.copy(os.path.join(src_dir, file), "assets/space.png")
        if "job_search_thumbnail" in file:
            shutil.copy(os.path.join(src_dir, file), "assets/jobs.png")
        if "travel_project_thumbnail" in file:
            shutil.copy(os.path.join(src_dir, file), "assets/travel.png")

with open("index.html", "r") as f:
    content = f.read()

# Extract header/footer
header_split = content.split('<main>')
header = header_split[0] + '<main>\n'
footer_split = header_split[1].split('</main>')
main_content = footer_split[0]
footer = '\n</main>' + footer_split[1]

# Extract sections
import re
sections = re.findall(r'(<section id="([^"]+)"[^>]*>.*?</section>)', main_content, re.DOTALL)
sections_dict = {sec_id: html for html, sec_id in sections}

# Update navbar
nav_replacements = {
    'href="#about"': 'href="index.html"',
    'href="#skills"': 'href="skills.html"',
    'href="#projects"': 'href="projects.html"',
    'href="#education"': 'href="education.html"',
    'href="#contact"': 'href="index.html#contact"'
}

def update_nav(html, active_id):
    # update all links
    for old, new in nav_replacements.items():
        if active_id == 'index' and (old == 'href="#about"' or old == 'href="#contact"'):
            # active goes to index.html sections
            html = html.replace(old, old)
        else:
            html = html.replace(old, new)
            
    # Need to handle 'class="active"' logic
    html = re.sub(r'class="active"', '', html)
    if active_id == 'index':
        html = html.replace('href="#about"', 'href="#about" class="active"')
    else:
        html = html.replace(f'href="{active_id}.html"', f'href="{active_id}.html" class="active"')
        
    return html

# Update Projects HTML to use images
projects_html = sections_dict['projects']
# Project 1: Travel
projects_html = projects_html.replace(
    '<div class="card-image-placeholder bg-blue">\n                            <i class="fas fa-plane-departure"></i>\n                        </div>',
    '<div class="card-image"><img src="assets/travel.png" alt="Travel Project"></div>'
)
projects_html = projects_html.replace(
    '<div class="card-image-placeholder bg-blue">                            <i class="fas fa-plane-departure"></i>                        </div>',
    '<div class="card-image"><img src="assets/travel.png" alt="Travel Project"></div>'
)
# Project 2: Space
projects_html = projects_html.replace(
    '<div class="card-image-placeholder bg-purple">\n                            <i class="fas fa-rocket"></i>\n                        </div>',
    '<div class="card-image"><img src="assets/space.png" alt="Space Project"></div>'
)
# Project 3: Job Search
projects_html = projects_html.replace(
    '<div class="card-image-placeholder bg-green">\n                            <i class="fas fa-robot"></i>\n                        </div>',
    '<div class="card-image"><img src="assets/jobs.png" alt="Job Search Project"></div>'
)

# Because we preserved #about and #contact locally
index_nav = header
for k, v in nav_replacements.items():
    if k in ['href="#about"', 'href="#contact"']: continue
    index_nav = index_nav.replace(k, v)

# Write index.html
with open('index.html', 'w') as f:
    f.write(index_nav + '\n' + sections_dict['about'] + '\n' + sections_dict['contact'] + footer)

# Write skills.html
with open('skills.html', 'w') as f:
    f.write(update_nav(header, 'skills') + '\n' + sections_dict['skills'] + footer)

# Write projects.html
with open('projects.html', 'w') as f:
    f.write(update_nav(header, 'projects') + '\n' + projects_html + footer)

# Write education.html
with open('education.html', 'w') as f:
    f.write(update_nav(header, 'education') + '\n' + sections_dict['education'] + footer)

print("Split complete.")
