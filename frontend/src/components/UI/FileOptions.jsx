import { useState, useRef, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";

const noop = () => {};

const FileOptions = ({
  onRename = noop,
  onDetails = noop,
  onShare = noop,
  onDownload = noop,
  onDelete = noop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleAction = (fn) => {
    setIsOpen(false);
    fn();
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-full p-2 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60"
        aria-label="Open file options"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <FiMoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-slate-300/20 bg-slate-900/95 shadow-xl"
          role="menu"
        >
          <button onClick={() => handleAction(onRename)} className="file-option-item" role="menuitem">Rename</button>
          <button onClick={() => handleAction(onDetails)} className="file-option-item" role="menuitem">Details</button>
          <button onClick={() => handleAction(onShare)} className="file-option-item" role="menuitem">Share</button>
          <button onClick={() => handleAction(onDownload)} className="file-option-item" role="menuitem">Download</button>
          <button onClick={() => handleAction(onDelete)} className="file-option-item text-rose-300" role="menuitem">
            Move to Trash
          </button>
        </div>
      )}
    </div>
  );
};

export default FileOptions;