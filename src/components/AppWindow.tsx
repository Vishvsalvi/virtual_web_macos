import React from "react";
import { Icon } from "@iconify/react";
import { Rnd } from "react-rnd";
import { useAppContext, AppWindow as AppWindowType } from "../contexts/AppContext";
import { motion } from "framer-motion";
import PomodoroApp from "./apps/PomodoroApp";
import TodoApp from "./apps/TodoApp";
import TerminalApp from "./apps/TerminalApp";
import ImageViewApp from "./apps/ImageViewApp";

interface AppWindowProps {
  window: AppWindowType;
}

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

const AppWindow: React.FC<AppWindowProps> = ({ window }) => {
  const { closeWindow, minimizeWindow, focusWindow, activeWindowId } = useAppContext();
  const isActive = activeWindowId === window.id;
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const previousPosition = React.useRef<Position | null>(null);

  const getInitialPosition = () => {
    // Safely access window object
    const w = typeof globalThis !== 'undefined' ? globalThis.window : null;
    const windowWidth = w?.innerWidth || 1200;
    const windowHeight = w?.innerHeight || 800;
    
    // Center the window with default size
    return {
      x: Math.max(0, (windowWidth - 600) / 2),
      y: Math.max(0, (windowHeight - 500) / 4),
      width: 600,
      height: 500,
    };
  };

  const [position, setPosition] = React.useState<Position>(getInitialPosition());

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullScreen) {
      // Store current position before going fullscreen
      previousPosition.current = position;
      // Set fullscreen position
      const w = typeof globalThis !== 'undefined' ? globalThis.window : null;
      setPosition({
        x: 0,
        y: 0,
        width: w?.innerWidth || 1200,
        height: w?.innerHeight || 800,
      });
    } else {
      // Restore previous position
      if (previousPosition.current) {
        setPosition(previousPosition.current);
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // Render different app content based on window type
  const renderAppContent = () => {
    switch (window.type) {
      case "pomodoro":
        return <PomodoroApp />;
      case "todo":
        return <TodoApp />;
      case "terminal":
        return <TerminalApp />;
      case "image":
        return <ImageViewApp />;
      default:
        return <div className="p-4">App content not available</div>;
    }
  };
  
  const handleMouseDown = () => {
    if (!isActive) {
      focusWindow(window.id);
    }
  };

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: position.width,
        height: position.height,
      }}
      position={{ x: position.x, y: position.y }}
      size={{ width: position.width, height: position.height }}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      disableDragging={isFullScreen}
      enableResizing={!isFullScreen}
      onDragStop={(e, d) => {
        setPosition(prev => ({ ...prev, x: d.x, y: d.y }));
      }}
      onResize={(e, direction, ref, delta, position) => {
        setPosition({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        });
      }}
      style={{ zIndex: window.zIndex }}
      onMouseDown={handleMouseDown}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col rounded-lg overflow-hidden h-full ${
          isActive
            ? "shadow-mac bg-white/95 dark:bg-gray-900/95"
            : "shadow-md bg-white/80 dark:bg-gray-900/80"
        } border border-white/30 dark:border-gray-700/30 window-blur ${
          isFullScreen ? 'rounded-none' : ''
        }`}
      >
        <div 
          className="window-drag-handle flex items-center h-8 px-2 bg-gray-100/80 dark:bg-gray-800/80 border-b border-gray-200/50 dark:border-gray-700/50 cursor-move select-none"
          onDoubleClick={() => minimizeWindow(window.id)}
        >
          <div className="flex items-center space-x-2 mr-2">
            <button
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(window.id);
              }}
            />
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                minimizeWindow(window.id);
              }}
            />
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              onClick={toggleFullScreen}
            />
          </div>
          <div className="flex-1 text-center text-xs font-medium text-gray-700 dark:text-gray-300">
            {window.title}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderAppContent()}
        </div>
      </motion.div>
    </Rnd>
  );
};

export default AppWindow;