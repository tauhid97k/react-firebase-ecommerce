import React, { useEffect } from "react";
import { useNavigation } from "react-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  easing: 'ease',
  speed: 500,
  minimum: 0.1,
  trickleSpeed: 200
});

// Add custom styles to override nprogress default styles
const customStyles = `
  #nprogress .bar {
    background: #4f46e5 !important;
    height: 3px !important;
    z-index: 9999 !important;
  }
  
  #nprogress .peg {
    box-shadow: 0 0 10px #4f46e5, 0 0 5px #4f46e5 !important;
  }
`;

export const TopLoader = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  useEffect(() => {
    // Add custom styles to the document head
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      // Clean up styles when component unmounts
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading]);

  // No need to render anything, nprogress adds its elements to the DOM
  return null;
};

export default TopLoader;
