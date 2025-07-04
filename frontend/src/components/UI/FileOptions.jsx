import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const FileOptions = ({ onRename, onDetails, onShare, onDownload, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <FiMoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              setIsOpen(false);
              onRename();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Rename
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onDetails();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Details
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onShare();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Share
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onDownload();
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            Download
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            Move to Trash
          </button>
        </div>
      )}
    </div>
  );
};

export default FileOptions;
