# Shortcut Hub

A powerful local application for organizing and executing your favorite shortcuts, scripts, and programs from a beautiful web interface.

## Features

- 🚀 **Execute Anything**: Run system programs, scripts, URLs, and web applications
- 🎯 **Multi-Platform**: Works on Windows, macOS, and Linux
- 📝 **Script Support**: Python, Node.js, PowerShell, Bash, and batch files
- 🎨 **Beautiful Interface**: Compact card-based design with real-time status monitoring
- 📁 **Smart Organization**: Collapsible categories with visual type indicators
- 🔍 **Search**: Quickly find shortcuts with instant search
- 💾 **Dual Storage**: JSON file persistence with localStorage backup
- ⚡ **Real-time Execution**: Live feedback and status monitoring
- 🛡️ **Secure**: Built-in validation and timeout protection
- 📱 **Responsive Design**: Optimized for all screen sizes with up to 8 columns
- 🎨 **Visual Type Coding**: Color-coded stripes indicate shortcut types

## Quick Start

### Prerequisites

- Node.js 16+ installed on your system
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shortcut-hub.git
   cd shortcut-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Usage Guide

### Creating Shortcuts

1. Click the **"Add Shortcut"** button in the top-right corner
2. Choose the shortcut type:
   - **URL/Website**: Open websites in your default browser
   - **Web App**: Launch web applications
   - **System Command**: Execute system programs
   - **Script**: Run various script files

3. Fill in the details:
   - **Name**: Display name for your shortcut
   - **Description**: What this shortcut does
   - **Executable Path/URL**: Path to executable, script, or URL
   - **Parameters**: Additional arguments (optional)
   - **Working Directory**: Custom working directory (optional)
   - **Category**: Organize shortcuts into groups
   - **Icon**: Choose from available icons

### Interface Features

#### Compact Card Design
- **Visual Type Indicators**: Colored stripes on the right edge of each card
  - 🟢 **Green**: URLs and Web Apps
  - 🔵 **Blue**: System Commands  
  - 🟣 **Purple**: Scripts
- **Compact Information**: Shows only essential details (name, category, last used date)
- **Quick Actions**: Large execution button with edit/delete options

#### Collapsible Categories
- **Click to Toggle**: Click category headers to expand/collapse sections
- **Visual Indicators**: Chevron arrows show current state
- **Efficient Organization**: Focus on relevant shortcuts by hiding others
- **Responsive Grid**: 2-8 columns depending on screen size

#### Search and Filter
- **Instant Search**: Filter shortcuts by name, description, category, or type
- **Real-time Results**: Updates as you type
- **Cross-category Search**: Finds shortcuts across all categories
### Shortcut Types & Examples

#### System Commands
```
Name: Command Prompt
Target: cmd.exe
Parameters: /k cd C:\Projects
Type: System Command
```

#### Scripts
```
Name: Build Script
Target: build.py
Parameters: --production
Working Directory: C:\MyProject
Type: Script
```

#### URLs
```
Name: GitHub
Target: https://github.com
Parameters: (empty)
Type: URL
```

#### Web Applications
```
Name: Gmail
Target: https://mail.google.com
Type: Web App
```

### Managing Shortcuts

- **Execute**: Click the large colored play button on each shortcut card
- **Edit**: Click the edit icon to modify shortcut details
- **Delete**: Click the trash icon to remove shortcuts
- **Search**: Use the search bar to filter shortcuts
- **Categories**: Click category headers to expand/collapse groups
- **Visual Types**: Identify shortcut types by colored stripes (Green=URL, Blue=System, Purple=Script)

### Server Status

The application shows real-time server status:
- 🟢 **Online**: Backend is running and ready
- 🔴 **Offline**: Backend is not accessible
- 🟡 **Checking**: Verifying connection status
- **System Info**: Displays platform and architecture when connected

## Configuration

### Data Storage

Shortcuts are automatically saved using a dual-storage system:
- **Primary storage**: `server/shortcuts.json` (auto-created if missing)
- **Backup storage**: Browser localStorage (fallback when server is offline)
- **Auto-sync**: Changes are saved immediately to both locations

The app will:
1. **Smart Loading**: Try server first, fallback to localStorage
2. **Auto-migration**: Move localStorage data to server when available  
3. **Real-time Sync**: Save changes to both storage methods instantly
4. **Offline Support**: Continue working when server is unavailable
5. **Data Recovery**: Automatically restore from backup when server returns

### Environment Variables

Create a `.env` file in the root directory for custom configuration:

```env
# Server Configuration
SERVER_PORT=3001
CLIENT_PORT=5173

# Security Settings
EXECUTION_TIMEOUT=30000
MAX_SHORTCUTS=1000

# Development
NODE_ENV=development
```

### Server Configuration

The backend server can be configured by modifying `server/index.js`:

```javascript
const PORT = process.env.SERVER_PORT || 3001;
const TIMEOUT = process.env.EXECUTION_TIMEOUT || 30000;
```

### Frontend Configuration

Vite configuration is in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
```

## Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend (Vite dev server)
- `npm run server` - Start only the backend (Express server)
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality

## Platform-Specific Notes

### Windows
- Use `.exe` extensions for executables
- PowerShell scripts (`.ps1`) are supported
- Batch files (`.bat`, `.cmd`) work natively
- Use backslashes in paths: `C:\Program Files\App\app.exe`

### macOS
- Applications can be launched: `/Applications/TextEdit.app`
- Shell scripts (`.sh`) are supported
- Use forward slashes in paths: `/usr/local/bin/myapp`

### Linux
- System commands work directly: `gedit`, `firefox`
- Shell scripts (`.sh`) are supported
- Python scripts work with system Python
- Use forward slashes in paths: `/home/user/scripts/script.py`

## Troubleshooting

### Common Issues

**Shortcuts Not Persisting**
```bash
# Check if shortcuts.json was created
ls -la server/shortcuts.json

# Check server logs for errors
npm run server  # Look for file creation/save errors

# Verify server endpoints are working
curl http://localhost:3001/api/shortcuts  # Should return shortcuts array
```

**Server Won't Start**
```bash
# Check if port 3001 is in use
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process if needed
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Shortcuts Won't Execute**
1. **Check Server Status**: Look for green "Server: online" indicator
2. **Verify Paths**: Ensure executable paths are correct and accessible
3. **Check Permissions**: Verify you can run the target manually
4. **Review Errors**: Check browser console and server logs
5. **Test Manually**: Try running the command in terminal first

**Scripts Not Working**
1. Verify the interpreter is installed (Python, Node.js, etc.)
2. Check the script path is absolute or relative to working directory
3. Ensure the script has execute permissions (Unix systems)

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=shortcut-hub npm run server
```

## Security Considerations

- The application validates executable paths to prevent malicious execution
- Commands have a 30-second timeout to prevent hanging processes
- Only runs locally - not exposed to external networks
- Basic path validation prevents directory traversal attacks

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature description"`
5. Push to your fork: `git push origin feature-name`
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/yourusername/shortcut-hub/issues)
3. Create a new issue with detailed information about your problem

## Changelog

### v1.0.0 (Current)
- Initial release
- Multi-platform support
- Script execution capabilities
- Modern React frontend
- Express.js backend
- Real-time status monitoring