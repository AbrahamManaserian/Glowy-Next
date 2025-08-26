import { useState, useEffect } from 'react';

function getWindowDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useGetWindowDimensions() {
  // console.log(window);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // run only on client
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    handleResize(); // ✅ initialize once mounted
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
