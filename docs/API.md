# API Documentation

## Overview

The Shortcut Hub backend provides a REST API for executing shortcuts and managing system interactions. All endpoints are prefixed with `/api` and run on `http://localhost:3001` by default.

## Base URL

```
http://localhost:3001/api
```

## Authentication

No authentication is required as this is a local application.

## Endpoints

### Execute Shortcut

Execute a shortcut command, script, or open a URL.

**Endpoint:** `POST /execute`

**Request Body:**
```json
{
  "executable": "string",      // Required: Path to executable, script, or URL
  "parameters": "string",      // Optional: Command line parameters
  "type": "string",           // Required: "url", "web-app", "system", or "script"
  "workingDirectory": "string" // Optional: Working directory for execution
}
```

**Response:**
```json
{
  "success": boolean,
  "message": "string",        // Success message
  "output": "string",         // Command output (if any)
  "exitCode": number,         // Process exit code
  "error": "string",          // Error message (if failed)
  "details": "string"         // Additional error details
}
```

**Examples:**

Execute a system command:
```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "executable": "notepad.exe",
    "parameters": "",
    "type": "system"
  }'
```

Run a Python script:
```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "executable": "script.py",
    "parameters": "--verbose",
    "type": "script",
    "workingDirectory": "/path/to/scripts"
  }'
```

Open a URL:
```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "executable": "https://github.com",
    "parameters": "",
    "type": "url"
  }'
```

**Status Codes:**
- `200 OK`: Request processed (check `success` field for execution result)
- `400 Bad Request`: Invalid request parameters
- `500 Internal Server Error`: Server error

### Health Check

Check if the server is running and responsive.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Example:**
```bash
curl http://localhost:3001/api/health
```

### System Information

Get information about the server's system environment.

**Endpoint:** `GET /system-info`

**Response:**
```json
{
  "platform": "win32",           // Operating system platform
  "arch": "x64",                 // System architecture
  "nodeVersion": "v18.17.0",     // Node.js version
  "cwd": "C:\\path\\to\\app"     // Current working directory
}
```

**Example:**
```bash
curl http://localhost:3001/api/system-info
```

## Shortcut Types

### URL (`type: "url"`)
Opens URLs in the default browser.

**Supported formats:**
- `https://example.com`
- `http://localhost:3000`
- `file:///path/to/file.html`

**Platform behavior:**
- Windows: Uses `start` command
- macOS: Uses `open` command  
- Linux: Uses `xdg-open` command

### Web App (`type: "web-app"`)
Similar to URL but specifically for web applications.

**Example:**
```json
{
  "executable": "https://mail.google.com",
  "parameters": "/inbox",
  "type": "web-app"
}
```

### System Command (`type: "system"`)
Executes system programs and commands.

**Examples:**
- Windows: `notepad.exe`, `cmd.exe`, `powershell.exe`
- macOS: `/Applications/TextEdit.app`, `open`, `say`
- Linux: `gedit`, `firefox`, `ls`

**Full paths:**
```json
{
  "executable": "C:\\Program Files\\MyApp\\app.exe",
  "parameters": "--config config.json",
  "type": "system",
  "workingDirectory": "C:\\MyApp\\data"
}
```

### Script (`type: "script"`)
Executes various script files with appropriate interpreters.

**Supported script types:**
- `.py` - Python scripts
- `.js`, `.mjs` - Node.js scripts
- `.ps1` - PowerShell scripts
- `.sh` - Bash scripts
- `.bat`, `.cmd` - Windows batch files

**Automatic interpreter selection:**
- Python: `python script.py`
- Node.js: `node script.js`
- PowerShell: `powershell -ExecutionPolicy Bypass -File script.ps1`
- Bash: `bash script.sh`

## Error Handling

### Common Error Responses

**Invalid executable path:**
```json
{
  "success": false,
  "error": "Invalid executable path"
}
```

**Command not found:**
```json
{
  "success": false,
  "error": "Failed to execute command: spawn notepad.exe ENOENT",
  "details": "Error: spawn notepad.exe ENOENT"
}
```

**Command timeout:**
```json
{
  "success": false,
  "error": "Command timed out after 30 seconds"
}
```

**Command failed:**
```json
{
  "success": false,
  "error": "Command failed with exit code 1",
  "output": "Error: File not found",
  "exitCode": 1
}
```

### Error Categories

1. **Validation Errors** (400): Invalid request parameters
2. **Execution Errors** (200 with success: false): Command execution failures
3. **Server Errors** (500): Internal server issues

## Security Considerations

### Path Validation

The server validates executable paths to prevent security issues:

**Allowed patterns:**
- Files with valid extensions: `.exe`, `.bat`, `.cmd`, `.ps1`, `.sh`, `.py`, `.js`, `.mjs`
- System commands without path separators
- Absolute paths

**Blocked patterns:**
- Relative paths with `../`
- Files without recognized extensions (unless system commands)
- Paths containing suspicious characters

### Process Management

- **Timeout**: All processes have a 30-second timeout
- **Isolation**: Each command runs in a separate process
- **Cleanup**: Processes are automatically terminated on timeout
- **Permissions**: Commands run with the same permissions as the server

### Resource Limits

- Maximum execution time: 30 seconds
- Process output capture: Limited to prevent memory issues
- Concurrent executions: No explicit limit (OS-dependent)

## Rate Limiting

Currently, no rate limiting is implemented as this is a local application. In a multi-user environment, consider implementing:

- Request rate limiting per IP
- Concurrent execution limits
- Resource usage monitoring

## Monitoring and Logging

### Server Logs

The server logs execution attempts:

```
Executing: python script.py --verbose
Command executed successfully
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=shortcut-hub npm run server
```

### Health Monitoring

Use the `/health` endpoint for monitoring:
- Uptime tracking
- Response time measurement
- Service availability checks

## Client Integration

### JavaScript/TypeScript

```typescript
const API_BASE_URL = 'http://localhost:3001/api';

async function executeShortcut(shortcut: Shortcut) {
  const response = await fetch(`${API_BASE_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      executable: shortcut.executable,
      parameters: shortcut.parameters,
      type: shortcut.type,
      workingDirectory: shortcut.workingDirectory
    }),
  });
  
  return await response.json();
}
```

### Error Handling

```typescript
try {
  const result = await executeShortcut(shortcut);
  if (result.success) {
    console.log('Success:', result.message);
  } else {
    console.error('Execution failed:', result.error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## Testing the API

### Using curl

Test server health:
```bash
curl http://localhost:3001/api/health
```

Execute a simple command:
```bash
curl -X POST http://localhost:3001/api/execute \
  -H "Content-Type: application/json" \
  -d '{"executable": "echo", "parameters": "Hello World", "type": "system"}'
```

### Using Postman

1. Import the API endpoints
2. Set base URL to `http://localhost:3001/api`
3. Create requests for each endpoint
4. Test different shortcut types and parameters

### Automated Testing

```javascript
// Jest test example
describe('API Endpoints', () => {
  test('should return server health', async () => {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
  
  test('should execute system command', async () => {
    const response = await fetch('http://localhost:3001/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        executable: 'echo',
        parameters: 'test',
        type: 'system'
      })
    });
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```