import React from "react";
import { Button, Slider, Tabs, Tab, Card, CardBody, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

const TIMER_TYPES = {
  POMODORO: {
    label: "Focus",
    defaultMinutes: 25,
    color: "danger",
    icon: "lucide:brain",
  },
  SHORT_BREAK: {
    label: "Short Break",
    defaultMinutes: 5,
    color: "success",
    icon: "lucide:coffee",
  },
  LONG_BREAK: {
    label: "Long Break",
    defaultMinutes: 15,
    color: "primary",
    icon: "lucide:palmtree",
  },
};

type TimerType = keyof typeof TIMER_TYPES;

const PomodoroApp: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TimerType>("POMODORO");
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(TIMER_TYPES.POMODORO.defaultMinutes * 60);
  const [customMinutes, setCustomMinutes] = React.useState<Record<TimerType, number>>({
    POMODORO: TIMER_TYPES.POMODORO.defaultMinutes,
    SHORT_BREAK: TIMER_TYPES.SHORT_BREAK.defaultMinutes,
    LONG_BREAK: TIMER_TYPES.LONG_BREAK.defaultMinutes,
  });
  const [showSettings, setShowSettings] = React.useState(false);
  const [completedPomodoros, setCompletedPomodoros] = React.useState(0);
  
  const intervalRef = React.useRef<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  React.useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3");
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  React.useEffect(() => {
    setTimeLeft(customMinutes[activeTab] * 60);
    setIsRunning(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [activeTab, customMinutes]);
  
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current as number);
            intervalRef.current = null;
            setIsRunning(false);
            if (audioRef.current) {
              audioRef.current.play();
            }
            if (activeTab === "POMODORO") {
              setCompletedPomodoros(prev => prev + 1);
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };
  
  const pauseTimer = () => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setTimeLeft(customMinutes[activeTab] * 60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  const calculateProgress = () => {
    const totalSeconds = customMinutes[activeTab] * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  const handleTimeChange = (type: TimerType, value: number) => {
    setCustomMinutes(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const currentConfig = TIMER_TYPES[activeTab];
  
  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <Tabs 
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(key as TimerType)}
        variant="light"
        size="sm"
        fullWidth
        aria-label="Timer options"
      >
        {(Object.keys(TIMER_TYPES) as TimerType[]).map((key) => (
          <Tab 
            key={key} 
            title={
              <div className="flex items-center gap-1.5">
                <Icon icon={TIMER_TYPES[key].icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{TIMER_TYPES[key].label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
      
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="mb-8 text-center">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center mb-2"
          >
            <Icon 
              icon={currentConfig.icon} 
              className={`w-6 h-6 text-${currentConfig.color} mr-2`}
            />
            <h2 className="text-xl font-medium">{currentConfig.label}</h2>
          </motion.div>
          
          <Card className="mb-6 mx-auto max-w-xs">
            <CardBody className="py-6">
              <div className="relative">
                <Progress 
                  aria-label="Timer progress" 
                  size="lg" 
                  value={calculateProgress()} 
                  color={currentConfig.color as any}
                  className="mb-4"
                />
                <motion.div
                  key={`time-${timeLeft}`}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className={`text-5xl font-semibold text-center text-${currentConfig.color}`}
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </div>
            </CardBody>
          </Card>
          
          <div className="flex justify-center space-x-3 my-4">
            {!isRunning ? (
              <Button 
                color={currentConfig.color as any} 
                onPress={startTimer} 
                startContent={<Icon icon="lucide:play" className="w-4 h-4" />}
              >
                Start
              </Button>
            ) : (
              <Button 
                color="warning" 
                onPress={pauseTimer} 
                startContent={<Icon icon="lucide:pause" className="w-4 h-4" />}
              >
                Pause
              </Button>
            )}
            <Button 
              variant="light" 
              onPress={resetTimer} 
              startContent={<Icon icon="lucide:refresh-cw" className="w-4 h-4" />}
            >
              Reset
            </Button>
            <Button
              variant="flat"
              onPress={() => setShowSettings(!showSettings)}
              startContent={<Icon icon="lucide:settings" className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>
        
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md px-4"
          >
            <Card shadow="sm" className="mb-4">
              <CardBody>
                <h3 className="text-sm font-medium mb-3">Timer Settings</h3>
                {(Object.keys(TIMER_TYPES) as TimerType[]).map((key) => (
                  <div key={key} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{TIMER_TYPES[key].label}</span>
                      <span className="text-xs text-default-500">{customMinutes[key]} minutes</span>
                    </div>
                    <Slider
                      size="sm"
                      step={1}
                      minValue={1}
                      maxValue={60}
                      value={customMinutes[key]}
                      onChange={(value) => handleTimeChange(key, value as number)}
                      className="max-w-full"
                    />
                  </div>
                ))}
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
      
      <Card shadow="sm" className="mt-auto">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon icon="lucide:check-circle" className="w-5 h-5 text-success mr-2" />
              <span className="text-sm">Completed Pomodoros</span>
            </div>
            <span className="font-semibold">{completedPomodoros}</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PomodoroApp;