import { useRef, useState, useEffect, useCallback } from "react";
import { Move } from 'lucide-react';

// A wrapper for component to make it draggable
// Parent will pass in onPositionChange for updating position on the component
const DraggableComponent = ({
  id,
  children,
  position,
  onPositionChange,
  isDragMode,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localPosition, setLocalPosition] = useState(position);
  const dragState = useRef({
    isDragging: false,
    offset: { x: 0, y: 0 },
    animationFrame: null,
  });
  const componentRef = useRef(null);

  // Update local position when prop changes (but not during drag)
  useEffect(() => {
    if (!dragState.current.isDragging) {
      setLocalPosition(position);
    }
  }, [position]);

  const getEventCoordinates = (e) => {
    // Handle both mouse and touch events
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = (e) => {
    if (!isDragMode) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);
    dragState.current.isDragging = true;

    const coords = getEventCoordinates(e);
    const rect = componentRef.current.getBoundingClientRect();
    dragState.current.offset = {
      x: coords.x - rect.left,
      y: coords.y - rect.top,
    };

    document.body.style.userSelect = "none";
    document.body.style.touchAction = "none"; // Prevent scroll on mobile
  };

  const handleMove = useCallback(
    (e) => {
      if (!dragState.current.isDragging || !isDragMode) {
        return;
      }

      e.preventDefault();

      // Cancel any pending animation frame
      if (dragState.current.animationFrame) {
        cancelAnimationFrame(dragState.current.animationFrame);
      }

      // Schedule update for next frame
      dragState.current.animationFrame = requestAnimationFrame(() => {
        const coords = getEventCoordinates(e);
        const newPosition = {
          x: coords.x - dragState.current.offset.x,
          y: coords.y - dragState.current.offset.y,
        };

        setLocalPosition(newPosition);
      });
    },
    [isDragMode]
  );

  const handleEnd = useCallback(() => {
    if (!dragState.current.isDragging) {
      return;
    }

    setIsDragging(false);
    dragState.current.isDragging = false;
    document.body.style.userSelect = "";
    document.body.style.touchAction = "";

    // Cancel any pending animation frame
    if (dragState.current.animationFrame) {
      cancelAnimationFrame(dragState.current.animationFrame);
      dragState.current.animationFrame = null;
    }

    // Update parent with final position
    onPositionChange(id, localPosition);
  }, [id, localPosition, onPositionChange]);

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener("mousemove", handleMove, { passive: false });
      document.addEventListener("mouseup", handleEnd);

      // Touch events
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
        document.body.style.userSelect = "";
        document.body.style.touchAction = "";
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div
      ref={componentRef}
      className={`absolute bg-white border-2 rounded-lg shadow-lg ${
        isDragMode
          ? "border-blue-400 cursor-move hover:shadow-xl touch-none"
          : "border-gray-200 cursor-default"
      } ${isDragging ? "shadow-2xl z-50" : "z-10"} ${
        // Responsive padding and sizing
        "p-3 sm:p-4 min-w-[140px] sm:min-w-[180px]"
      }`}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        userSelect: isDragMode ? "none" : "auto",
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        willChange: isDragging ? "transform, left, top" : "auto",
        WebkitTouchCallout: "none", // Disable iOS callout
        WebkitUserSelect: "none", // Disable iOS text selection
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {isDragMode && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1.5 sm:p-1">
          <Move size={14} className="sm:w-3 sm:h-3" />
        </div>
      )}
      {children}
    </div>
  );
};

export default DraggableComponent;
