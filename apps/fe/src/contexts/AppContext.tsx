import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { MessageHistoryItem } from "../types/message";

interface AppContextType {
  history: MessageHistoryItem[];
  addToHistory: (item: Omit<MessageHistoryItem, 'id' | 'timestamp'>) => MessageHistoryItem;
  updateVerificationResult: (id: string, result: MessageHistoryItem['verificationResult']) => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppContextType>({
  history: [],
  addToHistory: () => {
    throw new Error('addToHistory is not implemented');
  },
  updateVerificationResult: () => { },
  clearHistory: () => { },
});

const STORAGE_KEY = 'web3_message_history';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<MessageHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const addToHistory = useCallback((item: Omit<MessageHistoryItem, 'id' | 'timestamp'>): MessageHistoryItem => {
    const newItem: MessageHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newItem;
  }, [history]);

  const updateVerificationResult = (id: string, result: MessageHistoryItem['verificationResult']) => {
    setHistory(prev => {
      const updatedHistory = prev.map((item) =>
        item.id === id ? { ...item, verificationResult: result } : item
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        history,
        addToHistory,
        updateVerificationResult,
        clearHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  )
};

export const useApp = () => {
  return useContext(AppContext);
};
