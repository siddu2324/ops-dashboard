import { createContext, useContext, useState, useEffect } from "react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [newAlertCount, setNewAlertCount] = useState(0);

  const increment = () => setNewAlertCount((c) => c + 1);
  const reset = () => setNewAlertCount(0);

  return (
    <AlertContext.Provider value={{ newAlertCount, increment, reset }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}