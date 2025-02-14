import React, { createContext, useState } from "react";

interface Notify {
  active: boolean;
  type: string;
  title: string;
  message: string;
}


interface Status {
  active: boolean;
  hash: string;
  currentState: string;
}

interface Contextvalue {
  //notifiction
  notify: Notify;
  setNotify: (item: Notify) => void;
  //status for swapping
  showStatus: Status;
  setShowStatus: (item: Status) => void;
  //connectors
  showConnectors: boolean;
  setShowConnectors: (item: boolean) => void;
  //trade path
  tradePath: string[],
  setTradePath: (item: string[]) => void,
  madeAchoice: string;
  setMadeAchoice: (item: string) => void;
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
  //trade path
  const [tradePath, setTradePath] = useState<string[]>(["Sonic",  "Pegasus"]);
  const [madeAchoice, setMadeAchoice] = useState<string>("default");
  //show swap status modal
  const [showStatus, setShowStatus] = useState<any>({
    active: false,
    hash: "",
    currentState: ""
  });



  const contextValue: Contextvalue = {
    //notification
    notify,
    setNotify,
    //the swap show status
    showStatus,
    setShowStatus,
    //connectors
    showConnectors, 
    setShowConnectors,
    //trade path
    tradePath,
    setTradePath,
    madeAchoice,
    setMadeAchoice
  };
  return (
    <BContext.Provider value={contextValue}>{children}</BContext.Provider>
  );
};
