#!/usr/bin/env python3
"""
Word Document to CSV Converter for Course Data
Converts training course data from Word document to CSV format for bulk upload
"""

import re
import csv
from pathlib import Path

def parse_course_data(text_content):
    """
    Parse course data from text content extracted from Word document
    """
    courses = []
    
    # Split by course sections (looking for course titles)
    # Pattern: Course titles are usually alone on a line, followed by "Course Overview"
    
    lines = text_content.split('\n')
    current_course = {}
    in_course = False
    current_section = None
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        if not line:
            continue
            
        # Detect course title (usually before "Course Overview")
        if i + 1 < len(lines) and "Course Overview" in lines[i + 1]:
            if current_course and 'title' in current_course:
                courses.append(current_course)
            current_course = {'title': line}
            in_course = True
            current_section = None
            continue
        
        # Detect sections
        if line == "Course Overview":
            current_section = "overview"
            current_course['description'] = ""
            continue
        elif line == "Target Group":
            current_section = "target"
            continue
        elif line in ["Concepts Covered", "Course Outline", "What You'll Learn"]:
            current_section = "concepts"
            continue
        elif line in ["Exam and Prerequisite", "About the Certification Exam"]:
            current_section = "exam"
            continue
        
        # Collect description
        if current_section == "overview" and line and not line.startswith("Target Group"):
            if current_course['description']:
                current_course['description'] += " " + line
            else:
                current_course['description'] = line
    
    # Add last course
    if current_course and 'title' in current_course:
        courses.append(current_course)
    
    return courses

def determine_category(title):
    """Automatically determine category from title"""
    title_lower = title.lower()
    
    categories = {
        'Scrum and Agile': ['scrum', 'agile', 'prince2'],
        'Project Management': ['project', 'prince2', 'msp', 'p3o', 'mop', 'mov'],
        'Governance': ['cobit', 'governance'],
        'Quality Management': ['six sigma', 'quality'],
        'IT Service Management': ['itil', 'itsm', 'service desk', 'sdi', 'siam'],
        'ISO Standards': ['iso', 'gdpr'],
        'DevOps': ['devops', 'doi', 'sre', 'devsecops', 'aiops', 'observability']
    }
    
    for category, keywords in categories.items():
        if any(keyword in title_lower for keyword in keywords):
            return category
    
    return 'Professional Training'

def determine_level(title, description):
    """Automatically determine level from title and description"""
    combined = (title + " " + description).lower()
    
    if 'foundation' in combined or 'awareness' in combined or 'introduction' in combined:
        return 'Beginner'
    elif 'practitioner' in combined or 'professional' in combined or 'lead' in combined:
        return 'Advanced'
    else:
        return 'Intermediate'

def determine_duration(title, description):
    """Extract or estimate duration"""
    # Look for duration patterns in description
    duration_match = re.search(r'(\d+)\s*(day|days|week|weeks|hour|hours)', description, re.IGNORECASE)
    if duration_match:
        return f"{duration_match.group(1)} {duration_match.group(2).lower()}"
    
    # Default durations based on level
    if 'foundation' in title.lower():
        return '2-3 days'
    elif 'practitioner' in title.lower() or 'lead' in title.lower():
        return '3-5 days'
    else:
        return '2-4 days'

def export_to_csv(courses, output_file='courses_output.csv'):
    """Export parsed courses to CSV"""
    
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        
        # Write header
        writer.writerow([
            'title', 'description', 'duration', 'level', 
            'price', 'category', 'instructor', 'rating', 'studentsEnrolled'
        ])
        
        # Write courses
        for course in courses:
            title = course.get('title', 'Unknown Course')
            description = course.get('description', 'Professional training course')
            
            # Truncate long descriptions
            if len(description) > 200:
                description = description[:197] + '...'
            
            category = determine_category(title)
            level = determine_level(title, description)
            duration = determine_duration(title, description)
            
            writer.writerow([
                title,
                description,
                duration,
                level,
                0,  # Price - set to 0 for free or "Contact Us"
                category,
                'Training Provider',  # Generic instructor
                4.5,  # Default rating
                0  # Initial students enrolled
            ])
    
    print(f"✅ Successfully exported {len(courses)} courses to {output_file}")
    return output_file

def main():
    """Main function"""
    print("=" * 60)
    print("  Word Document to CSV Converter for Course Data")
    print("=" * 60)
    print()
    
    # Instructions
    print("INSTRUCTIONS:")
    print("1. Open your Word document")
    print("2. Select All (Ctrl+A) and Copy (Ctrl+C)")
    print("3. Create a new file called 'course_data.txt' in this folder")
    print("4. Paste the content into 'course_data.txt'")
    print("5. Run this script again")
    print()
    
    # Check if input file exists
    input_file = Path('course_data.txt')
    
    if not input_file.exists():
        print("⚠️  'course_data.txt' not found!")
        print()
        print("Please follow the instructions above and run again.")
        return
    
    # Read content
    print("📖 Reading course data...")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parse courses
    print("🔍 Parsing courses...")
    courses = parse_course_data(content)
    
    if not courses:
        print("❌ No courses found! Please check the format.")
        return
    
    print(f"✅ Found {len(courses)} courses")
    print()
    
    # Export to CSV
    print("💾 Exporting to CSV...")
    output_file = export_to_csv(courses, 'courses_ready_to_upload.csv')
    
    print()
    print("=" * 60)
    print("✨ DONE!")
    print("=" * 60)
    print()
    print(f"Your CSV file is ready: {output_file}")
    print()
    print("NEXT STEPS:")
    print("1. Open 'courses_ready_to_upload.csv' in Excel/Google Sheets")
    print("2. Review and adjust any data as needed")
    print("3. Go to your website: /admin/courses")
    print("4. Upload the CSV file")
    print()

if __name__ == '__main__':
    main()