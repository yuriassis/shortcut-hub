import express from 'express';
import cors from 'cors';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const execAsync = promisify(exec);

// Middleware
app.use(cors());
app.use(express.json());

// Security: Basic validation for executable paths
const isValidExecutable = (executable) => {
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
          command = 'start';
          args = ['', executable + (parameters ? parameters : '')];
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
            command = executable;
            break;
          default:
            command = executable;
        }
        break;

      case 'system':
      default:
        // Direct executable
        command = executable;
        break;
    }

    // Add parameters
    if (parameters) {
      const paramArray = parameters.split(' ').filter(p => p.trim());
      args = args.concat(paramArray);
    }

    console.log(`Executing: ${command} ${args.join(' ')}`);

    // Execute the command
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
      res.json({
        success: false,
        error: `Failed to execute command: ${error.message}`,
        details: error.toString()
      });
    });

    // Handle timeout
    setTimeout(() => {
      if (!child.killed) {
        child.kill();
        res.json({
          success: false,
          error: 'Command timed out after 30 seconds'
        });
      }
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

app.listen(PORT, () => {
  console.log(`Shortcut Hub server running on http://localhost:${PORT}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Working directory: ${process.cwd()}`);
});