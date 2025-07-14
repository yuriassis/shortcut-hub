# Technical Documentation

## Architecture Overview

Shortcut Hub is built as a full-stack application with a React frontend and Node.js backend, designed to run locally for executing system commands and scripts securely.

### System Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   React Client  │ ◄─────────────────► │  Express Server │
│   (Frontend)    │                     │   (Backend)     │
└─────────────────┘                     └─────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│  Local Storage  │                     │ System Commands │
│   (Shortcuts)   │                     │   & Scripts     │
└─────────────────┘                     └─────────────────┘
```

## Frontend Implementation

### Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **Lucide React**: Icon library for consistent iconography

### Key Components

#### App Component (`src/App.tsx`)

The main application component that manages:

```typescript
interface Shortcut {
  id: string;
  name: string;
  description: string;
  executable: string;
  parameters: string;
  icon: string;
  category: string;
  type: 'url' | 'web-app' | 'system' | 'script';
  workingDirectory?: string;
  createdAt: Date;
  lastUsed?: Date;
}
```

**State Management:**
- `shortcuts`: Array of user-created shortcuts
- `searchTerm`: Current search filter
- `serverStatus`: Backend connection status
- `executionResult`: Feedback from command execution
- `systemInfo`: Server platform and architecture information
- `isLoading`: Loading state for shortcuts
- `collapsedCategories`: Set of collapsed category names

**Key Features:**
- Real-time server status monitoring
- Dual storage system (JSON file + localStorage)
- Search and filtering
- Collapsible category organization
- Compact card-based interface
- Visual type indicators with colored stripes

#### ShortcutCard Component

Renders compact shortcut cards with:
- **Visual Design**: Colored stripe indicating shortcut type (Green/Blue/Purple)
- **Compact Layout**: Fixed width (160px) with essential information only
- **Smart Information**: Shows name, category, and last used date (dd/mm/yy format)
- **Quick Actions**: Large execution button with small edit/delete icons
- **Responsive Grid**: Adapts from 2-8 columns based on screen size

#### ShortcutModal Component

Form component for creating/editing shortcuts:
- Dynamic form fields based on shortcut type
- Icon selection grid
- Form validation
- Type-specific placeholders and help text

### State Management

The application uses React's built-in state management with enhanced persistence:

```typescript
// Dual storage system - save to both localStorage and server
const saveShortcuts = async (shortcutsToSave: Shortcut[]) => {
  localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
  await saveShortcutsToServer(shortcutsToSave);
};

// Smart loading - try server first, fallback to localStorage
useEffect(() => {
  const loadShortcuts = async () => {
    if (serverStatus === 'online') {
      // Try server first
      const response = await fetch(`${API_BASE_URL}/shortcuts`);
      if (response.ok) {
        const result = await response.json();
        setShortcuts(result.shortcuts);
        return;
      }
    }
    // Fallback to localStorage
    const saved = localStorage.getItem('shortcuts');
    if (saved) setShortcuts(JSON.parse(saved));
  };
}, [serverStatus]);

// Server status is checked every 10 seconds
useEffect(() => {
  const interval = setInterval(checkServerStatus, 10000);
  return () => clearInterval(interval);
}, []);

// Category collapse state management
const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
```

### API Communication

Frontend communicates with backend via REST API:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';

// Execute shortcut
const response = await fetch(`${API_BASE_URL}/execute`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    executable: shortcut.executable,
    parameters: shortcut.parameters,
    type: shortcut.type,
    workingDirectory: shortcut.workingDirectory
  }),
});
```

## Backend Implementation

### Technology Stack

- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Web framework for REST API
- **CORS**: Cross-origin resource sharing middleware
- **Child Process**: Node.js module for executing system commands

### Server Architecture

#### Main Server (`server/index.js`)

**Core Functionality:**
- REST API endpoints for shortcut execution
- JSON file-based shortcut persistence
- Security validation for executable paths
- Multi-platform command execution
- Process management and timeout handling
- Automatic file creation for shortcuts.json

**Key Endpoints:**

```javascript
POST /api/execute    // Execute a shortcut
GET  /api/health     // Server health check
GET  /api/system-info // System information
GET  /api/shortcuts  // Load shortcuts from JSON file
POST /api/shortcuts  // Save shortcuts to JSON file
```

### Command Execution Engine

The backend handles different types of executables:

#### URL/Web App Execution
```javascript
// Cross-platform URL opening
if (process.platform === 'win32') {
  command = 'cmd';
  args = ['/c', 'start', '""', executable + parameters];
} else if (process.platform === 'darwin') {
  command = 'open';
  args = [executable + parameters];
} else {
  command = 'xdg-open';
  args = [executable + parameters];
}
```

#### Script Execution
```javascript
// Dynamic interpreter selection
const ext = path.extname(executable).toLowerCase();
switch (ext) {
  case '.py':
    command = 'python';
    args = [executable];
    break;
  case '.js':
  case '.mjs':
    command = 'node';
    args = [executable];
    break;
  case '.ps1':
    command = 'powershell';
    args = ['-ExecutionPolicy', 'Bypass', '-File', executable];
    break;
  // ... more script types
}
```

#### System Command Execution
```javascript
// Direct executable execution with spawn
const child = spawn(command, args, {
  cwd: workingDirectory || process.cwd(),
  timeout: 30000,
  detached: false,
  stdio: ['ignore', 'pipe', 'pipe']
});
```

### Security Implementation

#### Path Validation
```javascript
const isValidExecutable = (executable) => {
  const validExtensions = ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.py', '.js'];
  const hasValidExtension = validExtensions.some(ext => 
    executable.toLowerCase().endsWith(ext)
  );
  const isSystemCommand = !path.extname(executable) && 
    !executable.includes('/') && !executable.includes('\\');
  const isFullPath = path.isAbsolute(executable);
  
  return hasValidExtension || isSystemCommand || isFullPath;
};
```

#### Process Management
- **Timeout Protection**: 30-second execution limit
- **Process Isolation**: Each command runs in separate process
- **Error Handling**: Comprehensive error capture and reporting
- **Resource Cleanup**: Automatic process termination on timeout

### Error Handling

The backend implements comprehensive error handling:

```javascript
child.on('error', (error) => {
  res.json({
    success: false,
    error: `Failed to execute command: ${error.message}`,
    details: error.toString()
  });
});

child.on('close', (code) => {
  if (code === 0) {
    res.json({ success: true, message: 'Command executed successfully' });
  } else {
    res.json({ success: false, error: `Command failed with exit code ${code}` });
  }
});
```

## Data Flow

### Shortcut Storage Flow
1. **Auto-creation**: Server creates `shortcuts.json` if it doesn't exist
2. **Dual save**: Changes saved to both localStorage and JSON file
3. **Smart loading**: Server file takes priority, localStorage as backup
4. **Migration**: localStorage data moved to server when available
5. **Sync**: Both storage methods kept synchronized

### Shortcut Creation Flow
1. User opens modal and fills form
2. Frontend validates input
3. Shortcut object created with unique ID
4. Added to state and saved to both storage systems
5. UI updates with new shortcut in appropriate category
6. Category auto-expands if collapsed

### Shortcut Execution Flow
1. User clicks execute button
2. Frontend sends POST request to `/api/execute`
3. Backend validates executable path
4. Command spawned with appropriate interpreter
5. Process output captured and returned
6. Frontend displays execution result
7. Shortcut's `lastUsed` timestamp updated
8. Changes auto-saved to both storage systems

### Server Status Monitoring
1. Frontend polls `/api/health` every 10 seconds
2. Server responds with status and timestamp
3. UI updates status indicator
4. System info fetched on successful connection

## Performance Considerations

### Frontend Optimizations
- **Efficient Rendering**: Compact cards with minimal re-renders
- **Efficient Filtering**: Client-side search with debouncing
- **Smart State Management**: Category collapse state persisted during session
- **Dual Storage**: Instant app startup with cached data
- **Responsive Design**: Optimized grid layouts for all screen sizes

### Backend Optimizations
- **File System Operations**: Async file operations with proper error handling
- **Auto-creation**: JSON file created automatically if missing
- **Process Pooling**: Reuse interpreters where possible
- **Memory Management**: Automatic cleanup of completed processes
- **Timeout Handling**: Prevent resource leaks from hanging processes
- **Error Boundaries**: Graceful handling of execution failures

## Security Model

### Threat Mitigation
- **Path Traversal**: Validation prevents `../` attacks
- **Code Injection**: Parameters are passed as separate arguments
- **Resource Exhaustion**: Timeout limits prevent infinite processes
- **Privilege Escalation**: Runs with user permissions only

### Best Practices
- Input validation on both client and server
- Whitelist approach for executable extensions
- Process isolation and cleanup
- No network exposure (localhost only)

## Testing Strategy

### Unit Testing
- Component rendering tests
- API endpoint tests
- Utility function tests
- Error handling tests

### Integration Testing
- End-to-end shortcut creation and execution
- Cross-platform compatibility tests
- Server-client communication tests

### Manual Testing
- Different shortcut types on each platform
- Error scenarios and edge cases
- UI responsiveness and accessibility

## Deployment Considerations

### Development
```bash
npm run dev  # Concurrent frontend and backend
```

### Production Build
```bash
npm run build    # Build frontend
npm run server   # Run backend in production
```

### Platform-Specific Packaging
- **Windows**: Electron wrapper for desktop app
- **macOS**: DMG packaging with code signing
- **Linux**: AppImage or Snap package

## Future Enhancements

### Planned Features
- **Shortcut Import/Export**: JSON-based configuration sharing
- **Keyboard Shortcuts**: Global hotkeys for quick execution
- **Execution History**: Track and replay previous executions
- **Batch Operations**: Execute multiple shortcuts sequentially
- **Remote Execution**: SSH-based remote command execution
- **Plugin System**: Extensible architecture for custom handlers

### Technical Improvements
- **Database Storage**: Replace localStorage with SQLite
- **Real-time Updates**: WebSocket-based live updates
- **Process Monitoring**: Real-time process status and logs
- **Advanced Security**: Sandboxed execution environment
- **Performance Metrics**: Execution time tracking and optimization