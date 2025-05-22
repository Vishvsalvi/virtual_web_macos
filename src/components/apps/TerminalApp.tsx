import React from "react";
import { Input } from "@heroui/react";
import Draggable from "react-draggable";
interface CommandEntry {
  command: string;
  output: string[];
  isError?: boolean;
}

const TerminalApp: React.FC = () => {
  const [currentCommand, setCurrentCommand] = React.useState("");
  const [commandHistory, setCommandHistory] = React.useState<CommandEntry[]>([
    { command: "welcome", output: ["Welcome to macOS Terminal", "Type 'help' to see available commands"] },
  ]);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  const executeCommand = (cmd: string) => {
    const lowercaseCmd = cmd.trim().toLowerCase();
    let output: string[] = [];
    let isError = false;

    // Process command
    if (lowercaseCmd === "" || lowercaseCmd === " ") {
      return; // Ignore empty commands
    } else if (lowercaseCmd === "clear") {
      setCommandHistory([]);
      setCurrentCommand("");
      return;
    } else if (lowercaseCmd === "help") {
      output = [
        "Available commands:",
        "- help: Show this help menu",
        "- clear: Clear the terminal",
        "- date: Show current date and time",
        "- echo [text]: Print text",
        "- ls: List files and directories",
        "- whoami: Display current user",
        "- pwd: Print working directory",
        "- cat [filename]: Show file content",
        "- mkdir [name]: Create directory",
      ];
    } else if (lowercaseCmd === "date") {
      output = [new Date().toString()];
    } else if (lowercaseCmd.startsWith("echo ")) {
      const text = cmd.substring(5);
      output = [text];
    } else if (lowercaseCmd === "ls") {
      output = [
        "Applications/",
        "Desktop/",
        "Documents/",
        "Downloads/",
        "Pictures/",
        ".bashrc",
        ".zshrc",
        "README.md"
      ];
    } else if (lowercaseCmd === "whoami") {
      output = ["user"];
    } else if (lowercaseCmd === "pwd") {
      output = ["/Users/user"];
    } else if (lowercaseCmd.startsWith("cat ")) {
      const filename = cmd.substring(4).trim();
      if (filename === "README.md") {
        output = [
          "# macOS Web Terminal",
          "",
          "This is a simulated terminal environment.",
          "Type 'help' to see available commands."
        ];
      } else {
        output = [`cat: ${filename}: No such file or directory`];
        isError = true;
      }
    } else if (lowercaseCmd.startsWith("mkdir ")) {
      const dirname = cmd.substring(6).trim();
      output = [`Directory created: ${dirname}`];
    } else {
      output = [`Command not found: ${cmd}`];
      isError = true;
    }

    // Add to history
    setCommandHistory(prev => [
      ...prev,
      { command: cmd, output, isError }
    ]);
    
    // Clear input
    setCurrentCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentCommand);
    }
  };
  
  React.useEffect(() => {
    // Scroll to bottom when command history updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  return (
    
    <div className="flex flex-col h-full bg-background  text-foreground font-mono text-sm">
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 pb-0"
      >
        {commandHistory.map((entry, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center">
              <span className="whitespace-nowrap text-green-500 dark:text-green-400">user@macos-web</span>
              <span className="text-foreground ">:</span>
              <span className="text-blue-400 dark:text-blue-400">~</span>
              <span className="text-foreground mr-2">$</span>
              <span className="text-foreground">{entry.command}</span>
            </div>
            {entry.output.map((line, i) => (
              <div 
                key={i} 
                className={`ml-0 ${entry.isError ? "text-red-400 dark:text-red-400" : ""}`}
              >
                {line}
              </div>
            ))}
          </div>
        ))}
        
        {/* Current prompt */}
        <div className="flex items-center">
          <span className="text-green-500 dark:text-green-400">user@macos-web</span>
          <span className="text-foreground">:</span>
          <span className="text-blue-400 dark:text-blue-400">~</span>
          <span className="text-foreground mr-2">$</span>
          <Input
            value={currentCommand}
            onValueChange={setCurrentCommand}
            onKeyDown={handleKeyDown}
            aria-label="Terminal input"
            placeholder=""
            variant="flat"
            autoFocus
            size="sm"
            className="w-full border-none p-0 m-0"
            classNames={{
              base: "w-full",
              input: "bg-transparent text-foreground focus:ring-0 focus:outline-none caret-foreground p-0 m-0 focus:bg-transparent hover:bg-transparent active:bg-transparent",
              inputWrapper: "!bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent h-6 p-0 m-0 border-none shadow-none data-[hover=true]:!bg-transparent data-[focus=true]:!bg-transparent focus:outline-none focus:ring-0",
              innerWrapper: "p-0 shadow-none bg-transparent focus:outline-none focus:ring-none",
              clearButton: "hidden"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalApp;