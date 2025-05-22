import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const TopBar: React.FC = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const { theme, setTheme } = useTheme();
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-8 bg-black/10 backdrop-blur-md text-sm flex items-center justify-between px-4 window-blur z-50"
    >
      <div className="flex items-center gap-4">
        <Dropdown>
          <DropdownTrigger>
            <button className="flex items-center text-white font-medium">
              <Icon icon="logos:apple" className="mr-1.5" />
            </button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Apple menu">
            <DropdownItem key="about">About This Mac</DropdownItem>
            <DropdownItem key="system-preferences">System Preferences</DropdownItem>
            <DropdownItem key="restart">Restart</DropdownItem>
            <DropdownItem key="shutdown">Shut Down</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        
        <div className="hidden sm:flex items-center gap-6">
          <Dropdown>
            <DropdownTrigger>
              <button className="text-white font-medium">Finder</button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Finder menu">
              <DropdownItem key="new-window">New Window</DropdownItem>
              <DropdownItem key="new-folder">New Folder</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Dropdown>
            <DropdownTrigger>
              <button className="text-white font-medium">File</button>
            </DropdownTrigger>
            <DropdownMenu aria-label="File menu">
              <DropdownItem key="open">Open</DropdownItem>
              <DropdownItem key="close">Close</DropdownItem>
              <DropdownItem key="save">Save</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          className="text-white/90 flex items-center"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Icon 
            icon={theme === "light" ? "lucide:moon" : "lucide:sun"} 
            className="w-4 h-4" 
          />
        </button>
        
        <div className="flex items-center justify-end min-w-[80px] text-white">
          {formattedTime}
        </div>
        
        <div className="hidden sm:block text-white">
          {formattedDate}
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;