import React, { useState, useEffect } from 'react';
import { Plus, Search, Play, Edit, Trash2, Download, Upload, Terminal, Settings, Folder, FileText, Coffee, Zap, Globe, ExternalLink, AlertCircle, Server, CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

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

const ICON_OPTIONS = [
  { name: 'Terminal', icon: Terminal },
  { name: 'Folder', icon: Folder },
  { name: 'FileText', icon: FileText },
  { name: 'Coffee', icon: Coffee },
  { name: 'Zap', icon: Zap },
  { name: 'Settings', icon: Settings },
  { name: 'Play', icon: Play },
  { name: 'Globe', icon: Globe },
  { name: 'ExternalLink', icon: ExternalLink },
  { name: 'Server', icon: Server },
];

const SHORTCUT_TYPES = [
  { value: 'url', label: 'URL/Website', description: 'Open a website or web application' },
  { value: 'web-app', label: 'Web App', description: 'Launch a web application in the default browser' },
  { value: 'system', label: 'System Command', description: 'Execute system programs and commands' },
  { value: 'script', label: 'Script', description: 'Run scripts (Python, Node.js, PowerShell, Bash, etc.)' },
];

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null);
  const [executionResult, setExecutionResult] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Check server status
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          setServerStatus('online');
          // Get system info
          const sysResponse = await fetch(`${API_BASE_URL}/system-info`);
          if (sysResponse.ok) {
            const sysInfo = await sysResponse.json();
            setSystemInfo(sysInfo);
          }
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Load shortcuts from server or localStorage
  useEffect(() => {
    const loadShortcuts = async () => {
      setIsLoading(true);
      
      try {
        // Try to load from server first
        if (serverStatus === 'online') {
          const response = await fetch(`${API_BASE_URL}/shortcuts`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.shortcuts) {
              const serverShortcuts = result.shortcuts.map((s: any) => ({
                ...s,
                createdAt: new Date(s.createdAt),
                lastUsed: s.lastUsed ? new Date(s.lastUsed) : undefined
              }));
              setShortcuts(serverShortcuts);
              
              // Also save to localStorage as backup
              localStorage.setItem('shortcuts', JSON.stringify(serverShortcuts));
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Fallback to localStorage
        const savedShortcuts = localStorage.getItem('shortcuts');
        if (savedShortcuts) {
          const parsed = JSON.parse(savedShortcuts);
          const localShortcuts = parsed.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            lastUsed: s.lastUsed ? new Date(s.lastUsed) : undefined
          }));
          setShortcuts(localShortcuts);
          
          // If server is online, migrate localStorage data to server
          if (serverStatus === 'online') {
            await saveShortcutsToServer(localShortcuts);
          }
        } else {
          // No shortcuts found, start with empty array
          setShortcuts([]);
        }
      } catch (error) {
        console.error('Error loading shortcuts:', error);
        // Fallback to localStorage on error
        const savedShortcuts = localStorage.getItem('shortcuts');
        if (savedShortcuts) {
          const parsed = JSON.parse(savedShortcuts);
          setShortcuts(parsed.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            lastUsed: s.lastUsed ? new Date(s.lastUsed) : undefined
          })));
        } else {
          setShortcuts([]);
        }
      }
      
      setIsLoading(false);
    };

    // Only load shortcuts after server status is determined
    if (serverStatus !== 'checking') {
      loadShortcuts();
    }
  }, [serverStatus]);

  // Save shortcuts to server
  const saveShortcutsToServer = async (shortcutsToSave: Shortcut[]) => {
    if (serverStatus !== 'online') return;
    
    try {
      await fetch(`${API_BASE_URL}/shortcuts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortcuts: shortcutsToSave }),
      });
    } catch (error) {
      console.error('Error saving shortcuts to server:', error);
    }
  };

  // Save shortcuts to both localStorage and server
  const saveShortcuts = async (shortcutsToSave: Shortcut[]) => {
    // Save to localStorage immediately
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    
    // Save to server if online
    await saveShortcutsToServer(shortcutsToSave);
  };

  // Auto-save when shortcuts change
  useEffect(() => {
    if (shortcuts.length > 0) {
      saveShortcuts(shortcuts);
    }
  }, [shortcuts, serverStatus]);

  const handleCreateShortcut = (shortcut: Omit<Shortcut, 'id' | 'createdAt'>) => {
    const newShortcut: Shortcut = {
      ...shortcut,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    const updatedShortcuts = [...shortcuts, newShortcut];
    setShortcuts(updatedShortcuts);
    setShowModal(false);
  };

  const handleUpdateShortcut = (updatedShortcut: Shortcut) => {
    const updatedShortcuts = shortcuts.map(s => s.id === updatedShortcut.id ? updatedShortcut : s);
    setShortcuts(updatedShortcuts);
    setEditingShortcut(null);
    setShowModal(false);
  };

  const handleDeleteShortcut = (id: string) => {
    const updatedShortcuts = shortcuts.filter(s => s.id !== id);
    setShortcuts(updatedShortcuts);
  };

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const handleExecuteShortcut = async (shortcut: Shortcut) => {
    if (serverStatus !== 'online') {
      setExecutionResult({
        message: 'Server is offline. Please start the backend server.',
        type: 'error'
      });
      setTimeout(() => setExecutionResult(null), 4000);
      return;
    }

    // Update last used time
    const updatedShortcut = { ...shortcut, lastUsed: new Date() };
    setShortcuts(shortcuts.map(s => s.id === shortcut.id ? updatedShortcut : s));
    
    try {
      setExecutionResult({
        message: `Executing: ${shortcut.name}...`,
        type: 'warning'
      });

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

      const result = await response.json();

      if (result.success) {
        setExecutionResult({
          message: `Successfully executed: ${shortcut.name}`,
          type: 'success'
        });
      } else {
        setExecutionResult({
          message: `Execution failed: ${result.error}`,
          type: 'error'
        });
      }
    } catch (error) {
      setExecutionResult({
        message: `Network error: ${error}`,
        type: 'error'
      });
    }
    
    // Clear the result after 4 seconds
    setTimeout(() => {
      setExecutionResult(null);
    }, 4000);
  };

  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shortcut Hub</h1>
            <p className="text-gray-600">Execute your favorite shortcuts and scripts locally</p>
            
            {/* Server Status */}
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                serverStatus === 'online' ? 'bg-green-100 text-green-700' :
                serverStatus === 'offline' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {serverStatus === 'online' && <CheckCircle size={12} />}
                {serverStatus === 'offline' && <XCircle size={12} />}
                {serverStatus === 'checking' && <AlertCircle size={12} />}
                Server: {serverStatus}
              </div>
              {systemInfo && (
                <div className="text-xs text-gray-500">
                  {systemInfo.platform} | {systemInfo.arch}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add Shortcut
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
        </div>

        {/* Server Offline Warning */}
        {serverStatus === 'offline' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle size={20} />
              <span className="font-medium">Backend Server Offline</span>
            </div>
            <p className="text-red-600 text-sm mt-1">
              The backend server is not running. Please start it with <code className="bg-red-100 px-1 rounded">npm run server</code> or <code className="bg-red-100 px-1 rounded">npm run dev</code> to execute shortcuts.
            </p>
          </div>
        )}

        {/* Shortcuts by Category */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading shortcuts...</p>
          </div>
        ) : Object.keys(groupedShortcuts).length > 0 ? (
          Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-8">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full text-left text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
              >
                {collapsedCategories.has(category) ? (
                  <ChevronRight size={20} className="text-blue-600" />
                ) : (
                  <ChevronDown size={20} className="text-blue-600" />
                )}
                <Folder size={20} className="text-blue-600" />
                {category}
                <span className="text-sm font-normal text-gray-500">({categoryShortcuts.length})</span>
              </button>
              {!collapsedCategories.has(category) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                  {categoryShortcuts.map((shortcut) => (
                    <ShortcutCard
                      key={shortcut.id}
                      shortcut={shortcut}
                      onExecute={handleExecuteShortcut}
                      onEdit={() => {
                        setEditingShortcut(shortcut);
                        setShowModal(true);
                      }}
                      onDelete={() => handleDeleteShortcut(shortcut.id)}
                      serverOnline={serverStatus === 'online'}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <Terminal className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No shortcuts found' : 'No shortcuts yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first shortcut to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Create Shortcut
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ShortcutModal
          shortcut={editingShortcut}
          onSave={editingShortcut ? handleUpdateShortcut : handleCreateShortcut}
          onClose={() => {
            setShowModal(false);
            setEditingShortcut(null);
          }}
        />
      )}

      {/* Execution Result Toast */}
      {executionResult && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right text-white ${
          executionResult.type === 'success' ? 'bg-green-600' :
          executionResult.type === 'warning' ? 'bg-yellow-600' :
          'bg-red-600'
        }`}>
          {executionResult.type === 'success' && <CheckCircle size={20} />}
          {executionResult.type === 'warning' && <AlertCircle size={20} />}
          {executionResult.type === 'error' && <XCircle size={20} />}
          {executionResult.message}
        </div>
      )}
    </div>
  );
}

interface ShortcutCardProps {
  shortcut: Shortcut;
  onExecute: (shortcut: Shortcut) => void;
  onEdit: () => void;
  onDelete: () => void;
  serverOnline: boolean;
}

function ShortcutCard({ shortcut, onExecute, onEdit, onDelete, serverOnline }: ShortcutCardProps) {
  const IconComponent = ICON_OPTIONS.find(opt => opt.name === shortcut.icon)?.icon || Terminal;
  const typeInfo = SHORTCUT_TYPES.find(t => t.value === shortcut.type);

  // Format date as dd/mm/yy
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-2 border border-gray-100 relative overflow-hidden w-full max-w-[160px]">
      {/* Colored stripe on the right */}
      <div className={`absolute top-0 right-0 w-1 h-full ${
        shortcut.type === 'url' || shortcut.type === 'web-app' ? 'bg-green-500' :
        shortcut.type === 'system' ? 'bg-blue-500' :
        'bg-purple-500'
      }`} />
      
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${
            shortcut.type === 'url' || shortcut.type === 'web-app' ? 'bg-green-100' :
            shortcut.type === 'system' ? 'bg-blue-100' :
            'bg-purple-100'
          }`}>
            <IconComponent className={`${
              shortcut.type === 'url' || shortcut.type === 'web-app' ? 'text-green-600' :
              shortcut.type === 'system' ? 'text-blue-600' :
              'text-purple-600'
            }`} size={14} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Edit size={10} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="font-medium text-gray-900 text-xs leading-tight mb-1 line-clamp-2">{shortcut.name}</h3>
        <p className="text-xs text-gray-500 mb-1">{shortcut.category}</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {shortcut.lastUsed && (
            <span className="text-xs text-gray-400">
              {formatDate(shortcut.lastUsed)}
            </span>
          )}
        </div>
        <button
          onClick={() => onExecute(shortcut)}
          disabled={!serverOnline}
          className={`p-1 rounded-md transition-colors duration-200 flex items-center text-white ${
            !serverOnline ? 'bg-gray-400 cursor-not-allowed' :
            shortcut.type === 'url' || shortcut.type === 'web-app' ? 'bg-green-600 hover:bg-green-700' :
            shortcut.type === 'system' ? 'bg-blue-600 hover:bg-blue-700' :
            'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          <Play size={10} />
        </button>
      </div>
    </div>
  );
}

interface ShortcutModalProps {
  shortcut?: Shortcut | null;
  onSave: (shortcut: any) => void;
  onClose: () => void;
}

function ShortcutModal({ shortcut, onSave, onClose }: ShortcutModalProps) {
  const [formData, setFormData] = useState({
    name: shortcut?.name || '',
    description: shortcut?.description || '',
    executable: shortcut?.executable || '',
    parameters: shortcut?.parameters || '',
    icon: shortcut?.icon || 'Terminal',
    category: shortcut?.category || '',
    type: shortcut?.type || 'system' as const,
    workingDirectory: shortcut?.workingDirectory || '',
  });

  const selectedType = SHORTCUT_TYPES.find(t => t.value === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shortcut) {
      onSave({ ...shortcut, ...formData });
    } else {
      onSave(formData);
    }
  };

  const getPlaceholderText = () => {
    switch (formData.type) {
      case 'url':
        return 'e.g., https://github.com';
      case 'web-app':
        return 'e.g., https://drive.google.com';
      case 'system':
        return 'e.g., notepad.exe or C:\\Program Files\\App\\app.exe';
      case 'script':
        return 'e.g., script.py or ./build.sh';
      default:
        return 'Enter the target path or URL';
    }
  };

  const getParametersPlaceholder = () => {
    switch (formData.type) {
      case 'url':
        return 'e.g., ?tab=repositories';
      case 'web-app':
        return 'e.g., /folder/subfolder';
      case 'system':
      case 'script':
        return 'e.g., --flag value or argument1 argument2';
      default:
        return 'Additional parameters';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {shortcut ? 'Edit Shortcut' : 'Create New Shortcut'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shortcut Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {SHORTCUT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedType && (
                <p className="text-xs text-gray-500 mt-1">{selectedType.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'url' || formData.type === 'web-app' ? 'URL' : 'Executable Path'}
              </label>
              <input
                type="text"
                value={formData.executable}
                onChange={(e) => setFormData({ ...formData, executable: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getPlaceholderText()}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parameters
              </label>
              <input
                type="text"
                value={formData.parameters}
                onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={getParametersPlaceholder()}
              />
            </div>

            {(formData.type === 'script' || formData.type === 'system') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Directory (Optional)
                </label>
                <input
                  type="text"
                  value={formData.workingDirectory}
                  onChange={(e) => setFormData({ ...formData, workingDirectory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., C:\\Projects\\MyApp or /home/user/scripts"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Development, System, Productivity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: option.name })}
                      className={`p-3 rounded-lg border transition-colors duration-200 ${
                        formData.icon === option.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <IconComponent size={20} className="mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                {shortcut ? 'Update' : 'Create'} Shortcut
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;