import React from "react";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/react";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";

interface DockProps {
  isMobile: boolean;
}

const Dock: React.FC<DockProps> = ({ isMobile }) => {
  const { openWindow, windows } = useAppContext();
  
  const dockApps = [
    { id: "finder", name: "Finder", icon: "lucide:folder", type: null },
    { id: "pomodoro", name: "Pomodoro", icon: "lucide:timer", type: "pomodoro" as const },
    { id: "todo", name: "To-Do", icon: "lucide:check-square", type: "todo" as const },
    { id: "terminal", name: "Terminal", icon: "lucide:terminal", type: "terminal" as const },
    { id: "safari", name: "Safari", icon: "lucide:globe", type: null },
    { id: "mail", name: "Mail", icon: "lucide:mail", type: null },
    { id: "photos", name: "Photos", icon: "lucide:image", type: null }
  ];
  
  const handleAppClick = (type: "pomodoro" | "todo" | "terminal" | null) => {
    if (type) {
      openWindow(type);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex justify-center mb-4 px-2"
    >
      <div className="
        bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30
        dark:bg-black/30 dark:border-white/10 shadow-lg p-2 flex items-center gap-1
        mx-auto
      ">
        {dockApps.map((app) => {
          const isActive = windows.some(w => w.type === app.type && w.isOpen && !w.isMinimized);
          const showTooltip = !isMobile;
          
          return (
            <Tooltip
              key={app.id}
              content={app.name}
              placement="top"
              isDisabled={!showTooltip}
            >
              <div 
                className="dock-item relative cursor-pointer p-2 group"
                onClick={() => handleAppClick(app.type)}
              >
                <div className="
                  flex items-center justify-center w-12 h-12 rounded-2xl
                  bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300
                  group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400
                  transition-all duration-200
                ">
                  <Icon icon={app.icon} className="w-7 h-7" />
                </div>
                
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Dock;