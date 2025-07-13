import express from 'express';
import cors from 'cors';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const execAsync = promisify(exec);
const SHORTCUTS_FILE = path.join(__dirname, 'shortcuts.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions for JSON file operations
const loadShortcuts = async () => {
  try {
    const data = await fsPromises.readFile(SHORTCUTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
};

const saveShortcuts = async (shortcuts) => {
  try {
    await fsPromises.writeFile(SHORTCUTS_FILE, JSON.stringify(shortcuts, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving shortcuts:', error);
    return false;
  }
};

// Security: Basic validation for executable paths
const isValidExecutable = (executable) => {
  // Allow URLs for web shortcuts
  if (executable.startsWith('http://') || executable.startsWith('https://') || executable.startsWith('file://')) {
    return true;
  }
  
  // Allow common executable extensions and scripts
  const validExtensions = ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.py', '.js', '.mjs', '.ts'];
  const hasValidExtension = validExtensions.some(ext => executable.toLowerCase().endsWith(ext));
  
  // Allow system commands (no extension)
  const isSystemCommand = !path.extname(executable) && !executable.includes('/') && !executable.includes('\\');
  
  // Allow full paths
  const isFullPath = path.isAbsolute(executable);
  
  return hasValidExtension || isSystemCommand || isFullPath;
};

// Execute shortcut endpoint
app.post('/api/execute', async (req, res) => {
  try {
    const { executable, parameters, type, workingDirectory } = req.body;

    if (!executable) {
      return res.status(400).json({ 
        success: false, 
        error: 'Executable path is required' 
      });
    }

    // Security check
    if (!isValidExecutable(executable)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid executable path' 
      });
    }

    let command;
    let args = [];
    let options = {
      cwd: workingDirectory || process.cwd(),
      timeout: 30000, // 30 second timeout
    };

    // Handle different types of executables
    switch (type) {
      case 'url':
      case 'web-app':
        // For URLs, use the system's default browser
        if (process.platform === 'win32') {
          command = 'cmd';
          args = ['/c', 'start', '""', executable + (parameters ? parameters : '')];
        } else if (process.platform === 'darwin') {
          command = 'open';
          args = [executable + (parameters ? parameters : '')];
        } else {
          command = 'xdg-open';
          args = [executable + (parameters ? parameters : '')];
        }
        break;

      case 'script':
        // Handle different script types
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
          case '.sh':
            command = 'bash';
            args = [executable];
            break;
          case '.bat':
          case '.cmd':
            if (process.platform === 'win32') {
              command = 'cmd';
              args = ['/c', executable];
            } else {
              command = executable;
            }
            break;
          default:
            command = executable;
        }
        break;

      case 'system':
      default:
        // Handle system commands and executables
        const execExt = path.extname(executable).toLowerCase();
        if ((execExt === '.bat' || execExt === '.cmd') && process.platform === 'win32') {
          command = 'cmd';
          args = ['/c', executable];
        } else {
          command = executable;
        }
        break;
    }

    // Add parameters
    if (parameters) {
      const paramArray = parameters.split(' ').filter(p => p.trim());
      args = args.concat(paramArray);
    }

    console.log(`Executing: ${command} ${args.join(' ')}`);

    // Execute the command
    let responseHandled = false;
    const child = spawn(command, args, {
      ...options,
      detached: false,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (responseHandled) return;
      responseHandled = true;
      
      if (code === 0) {
        res.json({
          success: true,
          message: `Command executed successfully`,
          output: stdout,
          exitCode: code
        });
      } else {
        res.json({
          success: false,
          error: `Command failed with exit code ${code}`,
          output: stderr || stdout,
          exitCode: code
        });
      }
    });

    child.on('error', (error) => {
      if (responseHandled) return;
      responseHandled = true;
      
      res.json({
        success: false,
        error: `Failed to execute command: ${error.message}`,
        details: error.toString()
      });
    });

    // Handle timeout
    setTimeout(() => {
      if (responseHandled) return;
      responseHandled = true;
      
      if (!child.killed) {
        child.kill();
      }
      res.json({
        success: false,
        error: 'Command timed out after 30 seconds'
      });
    }, 30000);

  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get system info endpoint
app.get('/api/system-info', (req, res) => {
  res.json({
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    cwd: process.cwd()
  });
});

// Load shortcuts endpoint
app.get('/api/shortcuts', async (req, res) => {
  try {
    const shortcuts = await loadShortcuts();
    res.json({ success: true, shortcuts });
  } catch (error) {
    console.error('Error loading shortcuts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to load shortcuts',
      shortcuts: [] 
    });
  }
});

// Save shortcuts endpoint
app.post('/api/shortcuts', async (req, res) => {
  try {
    const { shortcuts } = req.body;
    
    if (!Array.isArray(shortcuts)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shortcuts must be an array' 
      });
    }

    const saved = await saveShortcuts(shortcuts);
    if (saved) {
      res.json({ success: true, message: 'Shortcuts saved successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save shortcuts' });
    }
  } catch (error) {
    console.error('Error saving shortcuts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save shortcuts' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Shortcut Hub server running on http://localhost:${PORT}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Working directory: ${process.cwd()}`);
});