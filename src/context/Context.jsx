import { createContext, useState, useEffect, useContext } from "react";

const MobileContext = createContext();

const MobileProvider = ({ children, breakpoint = 576 }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < breakpoint) {
        setIsMobile(true);
        console.log("hii");
      } else {
        setIsMobile(false);
      }
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
    <MobileContext.Provider value={isMobile}>{children}</MobileContext.Provider>
  );
};

export { MobileProvider };
