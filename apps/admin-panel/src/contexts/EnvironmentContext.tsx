'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Environment = 'production' | 'qa';

interface EnvironmentContextType {
  environment: Environment;
  setEnvironment: (env: Environment) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

const STORAGE_KEY = 'admin-panel-environment';

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironment] = useState<Environment>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored === 'qa' || stored === 'production') ? stored : 'production';
    }
    return 'production';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, environment);
  }, [environment]);

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}
