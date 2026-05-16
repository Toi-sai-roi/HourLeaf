// context/TimeDemoContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface TimeDemoContextType {
  demoHour: number;
  setDemoHour: (hour: number) => void;
  setIsDemoMode: (enabled: boolean) => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  getEffectiveHour: () => number;
}

const TimeDemoContext = createContext<TimeDemoContextType | undefined>(undefined);

export const TimeDemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoHour, setDemoHour] = useState(new Date().getHours());
  const [isDemoMode, setIsDemoMode] = useState(false);

  const toggleDemoMode = () => setIsDemoMode(!isDemoMode);

  const getEffectiveHour = () => {
    return isDemoMode ? demoHour : new Date().getHours();
  };

  return (
    <TimeDemoContext.Provider value={{ demoHour, setDemoHour, isDemoMode, setIsDemoMode, toggleDemoMode, getEffectiveHour }}>
      {children}
    </TimeDemoContext.Provider>
  );
};

export const useTimeDemo = () => {
  const context = useContext(TimeDemoContext);
  if (!context) throw new Error('useTimeDemo phải được sử dụng trong TimeDemoProvider');
  return context;
};