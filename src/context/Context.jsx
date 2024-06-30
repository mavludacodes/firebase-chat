import { createContext, useState, useEffect, useContext } from "react";

const MobileContext = createContext();

const MobileProvider = ({ children, breakpoint = 576 }) => {
  const [value, setValue] = useState({
    isMobile: null,
    chatRef: null,
    detailRef: null,
  });

  useEffect(() => {
    const handleResize = () => {
      setValue((prev) => ({ ...prev, isMobile: window.innerWidth }));
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return (
    <MobileContext.Provider value={{ value, setValue }}>
      {children}
    </MobileContext.Provider>
  );
};

const useMobile = () => {
  return useContext(MobileContext);
};

export { MobileProvider, useMobile };
