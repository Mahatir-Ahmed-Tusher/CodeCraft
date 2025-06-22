"use client";
import React, { useState, useCallback, memo } from 'react';
import { 
  File, 
  Folder, 
  FolderOpen, 
  Plus, 
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
  Download,
  FileText,
  FolderPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Input } from '@/components/ui/input';
import { useIdeContext } from '@/context/IdeContext';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileItem[];
  isExpanded?: boolean;
}

interface FileExplorerProps {
  onFileSelect: (file: any) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = memo(({ onFileSelect }) => {
  const { 
    files, 
    activeFile, 
    addFile, 
    deleteFile, 
    renameFile, 
    createFolder,
    updateFileStructure 
  } = useIdeContext();
  
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

  // Convert flat file list to tree structure
  const buildFileTree = useCallback((files: any[]): FileItem[] => {
    const tree: FileItem[] = [];
    const folderMap = new Map<string, FileItem>();

    // Create root folder structure
    files.forEach(file => {
      const pathParts = file.path.split('/').filter(Boolean);
      let currentPath = '';
      
      pathParts.forEach((part, index) => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
        
        if (index === pathParts.length - 1) {
          // This is a file
          const fileItem: FileItem = {
            name: file.name,
            path: file.path,
            type: 'file',
            content: file.content,
            language: file.language
          };
          
          if (parentPath === '') {
            tree.push(fileItem);
          } else {
            const parentFolder = folderMap.get(parentPath);
            if (parentFolder) {
              parentFolder.children = parentFolder.children || [];
              parentFolder.children.push(fileItem);
            }
          }
        } else {
          // This is a folder
          if (!folderMap.has(currentPath)) {
            const folderItem: FileItem = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: [],
              isExpanded: expandedFolders.has(currentPath)
            };
            
            folderMap.set(currentPath, folderItem);
            
            if (parentPath === '') {
              tree.push(folderItem);
            } else {
              const parentFolder = folderMap.get(parentPath);
              if (parentFolder) {
                parentFolder.children = parentFolder.children || [];
                parentFolder.children.push(folderItem);
              }
            }
          }
        }
      });
    });

    return tree;
  }, [expandedFolders]);

  const fileTree = buildFileTree(files);

  const handleCreateFile = useCallback((parentPath: string = '/') => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const fullPath = parentPath === '/' ? `/${fileName}` : `${parentPath}/${fileName}`;
      const extension = fileName.split('.').pop() || '';
      const language = getLanguageFromExtension(extension);
      
      addFile({
        name: fileName,
        path: fullPath,
        content: getDefaultContent(language),
        language
      });
    }
  }, [addFile]);

  const handleCreateFolder = useCallback((parentPath: string = '/') => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const fullPath = parentPath === '/' ? `/${folderName}` : `${parentPath}/${folderName}`;
      createFolder(fullPath);
    }
  }, [createFolder]);

  const handleRename = useCallback((item: FileItem) => {
    setEditingItem(item.path);
    setNewItemName(item.name);
  }, []);

  const handleRenameSubmit = useCallback((oldPath: string) => {
    if (newItemName.trim() && newItemName !== oldPath.split('/').pop()) {
      const pathParts = oldPath.split('/');
      pathParts[pathParts.length - 1] = newItemName.trim();
      const newPath = pathParts.join('/');
      renameFile(oldPath, newPath, newItemName.trim());
    }
    setEditingItem(null);
    setNewItemName('');
  }, [newItemName, renameFile]);

  const handleDelete = useCallback((path: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteFile(path);
    }
  }, [deleteFile]);

  const handleCopyPath = useCallback((path: string) => {
    navigator.clipboard.writeText(path);
    // You could add a toast notification here
  }, []);

  const handleDownload = useCallback((item: FileItem) => {
    if (item.type === 'file' && item.content) {
      const blob = new Blob([item.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  const getLanguageFromExtension = (ext: string): string => {
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml'
    };
    return langMap[ext] || 'plaintext';
  };

  const getDefaultContent = (language: string): string => {
    const templates: Record<string, string> = {
      'javascript': '// JavaScript file\nconsole.log("Hello, World!");',
      'typescript': '// TypeScript file\nconsole.log("Hello, World!");',
      'html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      'css': '/* CSS file */\nbody {\n    margin: 0;\n    padding: 0;\n}',
      'json': '{\n    "name": "example",\n    "version": "1.0.0"\n}',
      'python': '# Python file\nprint("Hello, World!")',
      'java': 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      'cpp': '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      'c': '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}'
    };
    return templates[language] || '';
  };

  const renderFileItem = (item: FileItem, depth: number = 0) => {
    const isActive = activeFile?.path === item.path;
    const isEditing = editingItem === item.path;

    return (
      <div key={item.path}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center justify-between group hover:bg-gray-700 rounded px-2 py-1 cursor-pointer transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300'
              }`}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
              onClick={() => {
                if (item.type === 'file') {
                  onFileSelect(item);
                } else {
                  toggleFolder(item.path);
                }
              }}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {item.type === 'folder' ? (
                  expandedFolders.has(item.path) ? (
                    <FolderOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  )
                ) : (
                  <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                
                {isEditing ? (
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onBlur={() => handleRenameSubmit(item.path)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRenameSubmit(item.path);
                      } else if (e.key === 'Escape') {
                        setEditingItem(null);
                      }
                    }}
                    className="h-6 text-sm bg-gray-800 border-gray-600"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm truncate">{item.name}</span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleRename(item)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCopyPath(item.path)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Path
                  </DropdownMenuItem>
                  {item.type === 'file' && (
                    <DropdownMenuItem onClick={() => handleDownload(item)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {item.type === 'folder' && (
                    <>
                      <DropdownMenuItem onClick={() => handleCreateFile(item.path)}>
                        <FileText className="w-4 h-4 mr-2" />
                        New File
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateFolder(item.path)}>
                        <FolderPlus className="w-4 h-4 mr-2" />
                        New Folder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleDelete(item.path)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleRename(item)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleCopyPath(item.path)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Path
            </ContextMenuItem>
            {item.type === 'file' && (
              <ContextMenuItem onClick={() => handleDownload(item)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            {item.type === 'folder' && (
              <>
                <ContextMenuItem onClick={() => handleCreateFile(item.path)}>
                  <FileText className="w-4 h-4 mr-2" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleCreateFolder(item.path)}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}
            <ContextMenuItem 
              onClick={() => handleDelete(item.path)}
              className="text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {item.type === 'folder' && expandedFolders.has(item.path) && item.children && (
          <div>
            {item.children.map(child => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 flex items-center">
            <FolderOpen className="w-4 h-4 mr-2" />
            Explorer
          </h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => handleCreateFile()}
              title="New File"
            >
              <FileText className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => handleCreateFolder()}
              title="New Folder"
            >
              <FolderPlus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {fileTree.map(item => renderFileItem(item))}
        </div>
      </div>
    </div>
  );
});

FileExplorer.displayName = 'FileExplorer';

export default FileExplorer;