# Usage Examples

This document provides practical examples of how to use Shortcut Hub for various common tasks and scenarios. All shortcuts are automatically saved to both a JSON file and localStorage for reliability.

## Basic Examples

### System Applications

#### Windows Applications
```json
{
  "name": "Notepad",
  "description": "Open Windows Notepad text editor",
  "executable": "notepad.exe",
  "parameters": "",
  "type": "system",
  "category": "System Tools",
  "icon": "FileText"
}
```

```json
{
  "name": "Command Prompt",
  "description": "Open Windows Command Prompt",
  "executable": "cmd.exe",
  "parameters": "/k cd C:\\Projects",
  "type": "system",
  "category": "Development",
  "icon": "Terminal"
}
```

```json
{
  "name": "PowerShell",
  "description": "Open PowerShell with admin privileges",
  "executable": "powershell.exe",
  "parameters": "-Command \"Start-Process PowerShell -Verb RunAs\"",
  "type": "system",
  "category": "System Tools",
  "icon": "Terminal"
}
```

#### macOS Applications
```json
{
  "name": "TextEdit",
  "description": "Open macOS TextEdit application",
  "executable": "/Applications/TextEdit.app",
  "parameters": "",
  "type": "system",
  "category": "Productivity",
  "icon": "FileText"
}
```

```json
{
  "name": "Terminal",
  "description": "Open macOS Terminal",
  "executable": "/Applications/Utilities/Terminal.app",
  "parameters": "",
  "type": "system",
  "category": "Development",
  "icon": "Terminal"
}
```

#### Linux Applications
```json
{
  "name": "Text Editor",
  "description": "Open gedit text editor",
  "executable": "gedit",
  "parameters": "",
  "type": "system",
  "category": "Productivity",
  "icon": "FileText"
}
```

```json
{
  "name": "File Manager",
  "description": "Open Nautilus file manager",
  "executable": "nautilus",
  "parameters": "/home/user/Documents",
  "type": "system",
  "category": "System Tools",
  "icon": "Folder"
}
```

### Web Applications and URLs

#### Development Tools
```json
{
  "name": "GitHub",
  "description": "Open GitHub in default browser",
  "executable": "https://github.com",
  "parameters": "",
  "type": "url",
  "category": "Development",
  "icon": "Globe"
}
```

```json
{
  "name": "Local Development Server",
  "description": "Open local React development server",
  "executable": "http://localhost:3000",
  "parameters": "",
  "type": "web-app",
  "category": "Development",
  "icon": "Server"
}
```

#### Productivity Apps
```json
{
  "name": "Gmail",
  "description": "Open Gmail web application",
  "executable": "https://mail.google.com",
  "parameters": "/inbox",
  "type": "web-app",
  "category": "Productivity",
  "icon": "ExternalLink"
}
```

```json
{
  "name": "Google Drive",
  "description": "Open Google Drive",
  "executable": "https://drive.google.com",
  "parameters": "",
  "type": "web-app",
  "category": "Productivity",
  "icon": "Folder"
}
```

## Script Examples

### Python Scripts

#### Data Processing Script
```json
{
  "name": "Data Processor",
  "description": "Process CSV data files",
  "executable": "process_data.py",
  "parameters": "--input data.csv --output results.json",
  "type": "script",
  "workingDirectory": "C:\\Projects\\DataAnalysis",
  "category": "Data Science",
  "icon": "Zap"
}
```

#### Web Scraper
```json
{
  "name": "Web Scraper",
  "description": "Scrape product information from websites",
  "executable": "scraper.py",
  "parameters": "--site amazon --category electronics",
  "type": "script",
  "workingDirectory": "/home/user/scripts",
  "category": "Automation",
  "icon": "Globe"
}
```

### Node.js Scripts

#### Build Script
```json
{
  "name": "Build Project",
  "description": "Build and bundle the project",
  "executable": "build.js",
  "parameters": "--production --minify",
  "type": "script",
  "workingDirectory": "C:\\Projects\\MyApp",
  "category": "Development",
  "icon": "Settings"
}
```

#### Database Migration
```json
{
  "name": "Run Migrations",
  "description": "Execute database migrations",
  "executable": "migrate.js",
  "parameters": "--env production --up",
  "type": "script",
  "workingDirectory": "/var/www/myapp",
  "category": "Database",
  "icon": "Server"
}
```

### PowerShell Scripts

#### System Maintenance
```json
{
  "name": "System Cleanup",
  "description": "Clean temporary files and optimize system",
  "executable": "cleanup.ps1",
  "parameters": "-Verbose -WhatIf",
  "type": "script",
  "workingDirectory": "C:\\Scripts",
  "category": "System Maintenance",
  "icon": "Settings"
}
```

#### Backup Script
```json
{
  "name": "Backup Documents",
  "description": "Backup user documents to external drive",
  "executable": "backup.ps1",
  "parameters": "-Source C:\\Users\\John\\Documents -Destination E:\\Backups",
  "type": "script",
  "workingDirectory": "C:\\Scripts",
  "category": "Backup",
  "icon": "Folder"
}
```

### Bash Scripts

#### Server Deployment
```json
{
  "name": "Deploy to Production",
  "description": "Deploy application to production server",
  "executable": "deploy.sh",
  "parameters": "production --force",
  "type": "script",
  "workingDirectory": "/home/user/projects/myapp",
  "category": "Deployment",
  "icon": "Server"
}
```

#### Log Analysis
```json
{
  "name": "Analyze Logs",
  "description": "Analyze server logs for errors",
  "executable": "analyze_logs.sh",
  "parameters": "/var/log/apache2/error.log",
  "type": "script",
  "workingDirectory": "/home/user/scripts",
  "category": "Monitoring",
  "icon": "FileText"
}
```

## Advanced Examples

### Development Workflows

#### Full Stack Development Setup
```json
{
  "name": "Start Dev Environment",
  "description": "Start all development services",
  "executable": "start_dev.sh",
  "parameters": "",
  "type": "script",
  "workingDirectory": "/home/user/projects/fullstack-app",
  "category": "Development",
  "icon": "Play"
}
```

#### Code Quality Check
```json
{
  "name": "Run Tests & Lint",
  "description": "Execute test suite and code linting",
  "executable": "quality_check.js",
  "parameters": "--coverage --fix",
  "type": "script",
  "workingDirectory": "C:\\Projects\\MyApp",
  "category": "Development",
  "icon": "CheckCircle"
}
```

### System Administration

#### Service Management
```json
{
  "name": "Restart Web Server",
  "description": "Restart Apache web server",
  "executable": "systemctl",
  "parameters": "restart apache2",
  "type": "system",
  "category": "System Admin",
  "icon": "Server"
}
```

#### Log Monitoring
```json
{
  "name": "Monitor System Logs",
  "description": "Monitor system logs in real-time",
  "executable": "tail",
  "parameters": "-f /var/log/syslog",
  "type": "system",
  "category": "Monitoring",
  "icon": "FileText"
}
```

### Database Operations

#### Database Backup
```json
{
  "name": "Backup Database",
  "description": "Create database backup",
  "executable": "backup_db.py",
  "parameters": "--database myapp --output /backups/",
  "type": "script",
  "workingDirectory": "/opt/scripts",
  "category": "Database",
  "icon": "Server"
}
```

#### Database Migration
```json
{
  "name": "Migrate Database",
  "description": "Run database migrations",
  "executable": "migrate.sh",
  "parameters": "up",
  "type": "script",
  "workingDirectory": "/var/www/myapp",
  "category": "Database",
  "icon": "Settings"
}
```

## Creative Use Cases

### Media Processing

#### Video Conversion
```json
{
  "name": "Convert Video",
  "description": "Convert video files using FFmpeg",
  "executable": "convert_video.py",
  "parameters": "--input video.mp4 --output video.webm --quality high",
  "type": "script",
  "workingDirectory": "C:\\Media\\Scripts",
  "category": "Media",
  "icon": "Play"
}
```

#### Image Optimization
```json
{
  "name": "Optimize Images",
  "description": "Batch optimize images for web",
  "executable": "optimize_images.sh",
  "parameters": "/path/to/images --quality 85 --format webp",
  "type": "script",
  "workingDirectory": "/home/user/scripts",
  "category": "Media",
  "icon": "Zap"
}
```

### Automation Scripts

#### Email Reports
```json
{
  "name": "Send Daily Report",
  "description": "Generate and send daily analytics report",
  "executable": "daily_report.py",
  "parameters": "--email admin@company.com --format pdf",
  "type": "script",
  "workingDirectory": "/opt/reports",
  "category": "Automation",
  "icon": "Mail"
}
```

#### File Organization
```json
{
  "name": "Organize Downloads",
  "description": "Organize files in Downloads folder",
  "executable": "organize_files.py",
  "parameters": "--source ~/Downloads --rules rules.json",
  "type": "script",
  "workingDirectory": "/home/user/scripts",
  "category": "Automation",
  "icon": "Folder"
}
```

### Network Tools

#### Network Diagnostics
```json
{
  "name": "Network Test",
  "description": "Test network connectivity and speed",
  "executable": "network_test.sh",
  "parameters": "--host google.com --count 10",
  "type": "script",
  "workingDirectory": "/home/user/scripts",
  "category": "Network",
  "icon": "Globe"
}
```

#### Port Scanner
```json
{
  "name": "Port Scanner",
  "description": "Scan for open ports on target host",
  "executable": "port_scan.py",
  "parameters": "--host 192.168.1.1 --ports 1-1000",
  "type": "script",
  "workingDirectory": "/opt/security",
  "category": "Security",
  "icon": "Shield"
}
```

## Tips for Creating Effective Shortcuts

### Visual Organization
- **Use Color Coding**: Shortcuts are automatically color-coded by type
  - Green stripe: URLs and Web Apps
  - Blue stripe: System Commands
  - Purple stripe: Scripts
- **Category Grouping**: Organize related shortcuts into logical categories
- **Descriptive Names**: Use clear, action-oriented names for easy identification

### Naming Conventions
- Use descriptive, action-oriented names
- Include the target application or script purpose
- Keep names concise but clear

### Parameter Best Practices
- Use full parameter names when possible (`--verbose` vs `-v`)
- Quote parameters with spaces: `"C:\Program Files\App\app.exe"`
- Test parameters manually before creating shortcuts

### Working Directory Guidelines
- Always specify working directory for scripts
- Use absolute paths for reliability
- Consider environment variables for portability

### Category Organization
- Group related shortcuts together
- Use consistent category names
- Consider workflow-based categories (Development, Productivity, etc.)
- Categories are collapsible - organize for easy navigation

### Icon Selection
- Choose icons that represent the function or tool
- Use consistent icons for similar types of shortcuts
- Icons work with the color stripe system for quick identification

### Error Prevention
- Test shortcuts after creation
- Verify file paths exist
- Check permissions for script execution
- Use appropriate shortcut types for different targets

### Interface Tips
- **Compact View**: Cards are designed to show many shortcuts at once
- **Quick Access**: Large execution buttons for easy clicking
- **Category Management**: Collapse unused categories to focus on relevant shortcuts
- **Search Functionality**: Use search to quickly find shortcuts across all categories

These examples should help you get started with creating your own shortcuts for various tasks and workflows. The compact interface allows you to see many shortcuts at once while maintaining full functionality. Remember to test each shortcut after creation to ensure it works as expected in your environment.