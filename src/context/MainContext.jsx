import React, { createContext, useContext, useEffect, useState } from "react";

const MainContext = createContext(null)


export const MainProvider = ({ children }) => {




    const value = {

    }

    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    )
}


export const useMain = () => {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useMain must be used inside MainProvider");
    }
    return context;
}