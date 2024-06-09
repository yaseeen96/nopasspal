import React, { createContext, useContext, useState, useEffect } from "react";

// Creating the dark mode context
const DarkModeContext = createContext();

export function useDarkMode() {
  return useContext(DarkModeContext);
}

// a component that provides the dark mode context

export const DarkModeProvider = ({ children }) => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setPrefersDarkMode(event.matches);
    };
    // Add the listener
    // whenever there is any change in the media query, handleChange will be called

    mediaQuery.addEventListener("change", handleChange);
    // Remove the listener
    // why are we removing the listener?
    // because we don't want to have multiple listeners for the same event
    // Return a cleanup function that removes the event listener
    // this function is called when the component is unmounted
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    // The DarkModeContext.Provider component is used to provide the dark mode context to its children
    <DarkModeContext.Provider value={prefersDarkMode}>
      {children}
    </DarkModeContext.Provider>
  );
};
