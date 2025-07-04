import React, { useState, useRef } from 'react';
import { Upload, File, FileText, Image } from 'lucide-react';

const FileSharePro = () => {
  const [dragActive, setDragActive] = useState(false);
  const [recentFiles, setRecentFiles] = useState([
    { name: 'Document1.pdf', type: 'pdf', icon: FileText },
    { name: 'Image5.png', type: 'image', icon: Image },
    { name: 'Presentation3.pptx', type: 'presentation', icon: File }
  ]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      type: file.type.includes('image') ? 'image' : 
            file.type.includes('pdf') ? 'pdf' : 'document',
      icon: file.type.includes('image') ? Image : 
            file.type.includes('pdf') ? FileText : File
    }));
    setRecentFiles(prev => [...newFiles, ...prev]);
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (IconComponent) => {
    return <IconComponent className="w-4 h-4 text-teal-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">DataVaultX</h1>
              </div>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                My Files
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Settings
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h2>
            <div className="space-y-3">
              {recentFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                  {getFileIcon(file.icon)}
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Upload Area */}
          <div className="flex-1">
            <div
              className={`relative border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
                dragActive 
                  ? 'border-orange-400 bg-orange-50' 
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Drag & Drop your files here
                  </h3>
                  <p className="text-gray-500 mb-6">
                    or click to select files from your computer
                  </p>
                  
                  <button
                    onClick={handleSelectFiles}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Select Files
                  </button>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Contact Us
              </a>
            </div>
            <div className="text-sm text-gray-500">
              © 2023 FileSharePro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FileSharePro;