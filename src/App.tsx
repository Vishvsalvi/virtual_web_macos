import React from "react";
import Desktop from "./components/Desktop";
import { AppProvider } from "./contexts/AppContext";

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="w-full h-screen overflow-hidden"> {/* Added wrapper with explicit height */}
        <Desktop />
      </div>
    </AppProvider>
  );
};

export default App;