import React from "react";
import { v4 as uuidv4 } from "uuid";

export interface AppWindow {
  id: string;
  title: string;
  type: "pomodoro" | "todo" | "terminal" | "image";
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface AppContextType {
  windows: AppWindow[];
  activeWindowId: string | null;
  openWindow: (type: "pomodoro" | "todo" | "terminal" | "image") => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const getAppTitle = (type: "pomodoro" | "todo" | "terminal" | "image") => {
  switch (type) {
    case "pomodoro":
      return "Pomodoro Timer";
    case "todo":
      return "To-Do List";
    case "terminal":
      return "Terminal";
    case "image":
      return "Image Viewer";
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = React.useState<AppWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = React.useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = React.useState(100);

  const openWindow = React.useCallback((type: "pomodoro" | "todo" | "terminal") => {
    const existingWindow = windows.find((w) => w.type === type && w.isMinimized);
    
    if (existingWindow) {
      setWindows((prev) => 
        prev.map((w) => 
          w.id === existingWindow.id 
            ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } 
            : w
        )
      );
      setActiveWindowId(existingWindow.id);
      setMaxZIndex(maxZIndex + 1);
      return;
    }
    
    const newWindow: AppWindow = {
      id: uuidv4(),
      title: getAppTitle(type),
      type,
      isOpen: true,
      isMinimized: false,
      zIndex: maxZIndex + 1,
    };
    
    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setMaxZIndex(maxZIndex + 1);
  }, [windows, maxZIndex]);

  const closeWindow = React.useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    
    if (activeWindowId === id) {
      const sortedWindows = [...windows]
        .filter((w) => w.id !== id && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex);
        
      setActiveWindowId(sortedWindows.length > 0 ? sortedWindows[0].id : null);
    }
  }, [windows, activeWindowId]);

  const minimizeWindow = React.useCallback((id: string) => {
    setWindows((prev) => 
      prev.map((w) => 
        w.id === id ? { ...w, isMinimized: true } : w
      )
    );
    
    if (activeWindowId === id) {
      const sortedWindows = [...windows]
        .filter((w) => w.id !== id && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex);
        
      setActiveWindowId(sortedWindows.length > 0 ? sortedWindows[0].id : null);
    }
  }, [windows, activeWindowId]);

  const restoreWindow = React.useCallback((id: string) => {
    setWindows((prev) => 
      prev.map((w) => 
        w.id === id 
          ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } 
          : w
      )
    );
    setActiveWindowId(id);
    setMaxZIndex(maxZIndex + 1);
  }, [maxZIndex]);

  const focusWindow = React.useCallback((id: string) => {
    setWindows((prev) => 
      prev.map((w) => 
        w.id === id 
          ? { ...w, zIndex: maxZIndex + 1 } 
          : w
      )
    );
    setActiveWindowId(id);
    setMaxZIndex(maxZIndex + 1);
  }, [maxZIndex]);

  const value = React.useMemo(() => ({
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
  }), [windows, activeWindowId, openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};