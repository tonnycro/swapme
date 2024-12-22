import React, { createContext, useState } from "react";

interface Notify {
  active: boolean;
  type: string;
  title: string;
  message: string;
}

interface Contextvalue {
  //notifiction
  notify: Notify;
  setNotify: (item: Notify) => void;
  //connectors
  showConnectors: boolean;
  setShowConnectors: (item: boolean) => void;
}

export const BContext = createContext<Contextvalue>({} as Contextvalue);

interface ContextProviderProps {
  children: React.ReactNode;
}

export const MainContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {

  //Notifier and alert
  const [notify, setNotify] = useState({
    active: false,
    type: "",
    title: "",
    message: "",
  });
  //show connectors
  const [showConnectors, setShowConnectors] = useState<boolean>(false);


  const contextValue: Contextvalue = {
    //notification
    notify,
    setNotify,
    //connectors
    showConnectors, 
    setShowConnectors
  };
  return (
    <BContext.Provider value={contextValue}>{children}</BContext.Provider>
  );
};
