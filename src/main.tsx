import {HeroUIProvider, ToastProvider} from "@heroui/react";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "./index.css";

// Add a global style fix if this file exists
// If it doesn't exist in your project, this should be added elsewhere
document.documentElement.style.height = '100%';
document.body.style.height = '100%';
document.getElementById('root')!.style.height = '100%';

ReactDOM.createRoot(document.getElementById("root")!).render(
    <HeroUIProvider>
      <ToastProvider />
      <main className="text-foreground bg-background">
        <App />
      </main>
    </HeroUIProvider>
);