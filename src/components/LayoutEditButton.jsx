import { Settings } from "lucide-react";

const LayoutEditButton = ({isDragMode, onToggle}) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg transition-all duration-200 text-sm sm:text-base ${
        isDragMode
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="hidden sm:inline">
        {isDragMode ? "Exit Edit Mode" : "Edit Layout"}
      </span>
      <span className="sm:hidden">{isDragMode ? "Exit" : "Edit"}</span>
    </button>
  );
};

export default LayoutEditButton;
