# Shortcut Hub

A powerful local application for organizing and executing your favorite shortcuts, scripts, and programs from a beautiful web interface.

![Shortcut Hub Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Shortcut+Hub+Interface)

## Features

- 🚀 **Execute Anything**: Run system programs, scripts, URLs, and custom executables
- 🎯 **Multi-Platform**: Works on Windows, macOS, and Linux
- 📝 **Script Support**: Python, Node.js, PowerShell, Bash, and batch files
- 🎨 **Beautiful Interface**: Modern, responsive design with real-time status
- 📁 **Organization**: Group shortcuts by categories
- 🔍 **Search**: Quickly find shortcuts with instant search
- 💾 **Persistent Storage**: Shortcuts saved to JSON file with localStorage backup
- ⚡ **Real-time Execution**: Live feedback and status monitoring
- 🛡️ **Secure**: Built-in validation and timeout protection

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

1. Click the **"Add Shortcut"** button
2. Choose the shortcut type:
   - **URL/Website**: Open websites in your default browser
   - **Web App**: Launch web applications
   - **System Command**: Execute system programs
   - **Script**: Run various script files

3. Fill in the details:
   - **Name**: Display name for your shortcut
   - **Description**: What this shortcut does
   - **Target**: Path to executable, script, or URL
   - **Parameters**: Additional arguments (optional)
   - **Working Directory**: Custom working directory (optional)
   - **Category**: Organize shortcuts into groups
   - **Icon**: Choose from available icons

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

- **Execute**: Click the colored button on each shortcut card
- **Edit**: Click the edit icon to modify shortcut details
- **Delete**: Click the trash icon to remove shortcuts
- **Search**: Use the search bar to filter shortcuts
- **Categories**: Shortcuts are automatically grouped by category

### Server Status

The application shows real-time server status:
- 🟢 **Online**: Backend is running and ready
- 🔴 **Offline**: Backend is not accessible
- 🟡 **Checking**: Verifying connection status

## Configuration

### Data Storage

Shortcuts are automatically saved to a JSON file on the server for persistence:
- **Primary storage**: `server/shortcuts.json` (created automatically)
- **Backup storage**: Browser localStorage (fallback when server is offline)
- **Auto-sync**: Changes are saved immediately to both locations

The app will:
1. Load shortcuts from the server JSON file on startup
2. Fall back to localStorage if the server is offline
3. Migrate localStorage shortcuts to the server when it comes online
4. Keep both storage methods synchronized

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
# Check if the server has write permissions
ls -la server/  # Look for shortcuts.json file

# If file doesn't exist, check server logs for permission errors
npm run server  # Look for "Error saving shortcuts" messages
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
1. Verify the server is running (green status indicator)
2. Check the executable path is correct
3. Ensure you have permissions to run the target
4. Check the console for error messages

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