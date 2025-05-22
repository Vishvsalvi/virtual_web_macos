import React from "react";
import TopBar from "./TopBar";
import AppWindow from "./AppWindow";
import { useAppContext } from "../contexts/AppContext";
import { icons } from "./Icons/icons";
import { motion } from "framer-motion";
import terminalImage from "./apps/Images/terminal.webp";
import todoImage from "./apps/Images/todo.webp";
import pomodoroImage from "./apps/Images/clock.webp";
import imageImage from "./apps/Images/image.webp";    
import wallpaper from "./apps/Images/wallpaper.jpg";

type AppType = "terminal" | "todo" | "pomodoro" | "image";

interface DesktopIconProps {
  image: string;
  label: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ image, label, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center mb-6 cursor-pointer group"
    onClick={onClick}
  >
    <div className="px-3 rounded-xl transition-colors">
      <img src={image} alt={label} className="w-10 h-10 object-contain" />
    </div>
    <span className=" text-sm text-white font-medium text-center px-2 rounded ">
      {label}
    </span>
  </motion.div>
);

const Desktop: React.FC = () => {
  const { windows, openWindow } = useAppContext();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopApps = [
    { icon: terminalImage, label: "Terminal", type: "terminal" as AppType },
    { icon: todoImage, label: "Todo", type: "todo" as AppType },
    { icon: pomodoroImage, label: "Pomodoro", type: "pomodoro" as AppType },
    { icon: imageImage, label: "Image", type: "image" as AppType }
  ] as const;

  return (
    <div 
      className="relative flex flex-col h-screen w-full bg-black overflow-hidden"
      style={{ 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <TopBar />
      
      <div className="flex-1 relative">
        {/* Desktop Icons */}
        <div className="absolute right-6 top-6 flex flex-col items-end space-y-2">
          {desktopApps.map((app) => (
            <DesktopIcon
              key={app.type}
              image={app.icon}
              label={app.label}
              onClick={() => openWindow(app.type)}
            />
          ))}
        </div>

        {/* App Windows */}
        {windows.map((window) => (
          !window.isMinimized && (
            <AppWindow
              key={window.id}
              window={window}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Desktop;