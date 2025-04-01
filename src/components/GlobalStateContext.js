import React, { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext();
export const GlobalStateProvider = ({ children }) => {
    const [globalData, setGlobalData] = useState(null);

    return (
        <GlobalStateContext.Provider value={{ globalData, setGlobalData }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
export const useGlobalState = () => {
    return useContext(GlobalStateContext);
};
