import React, { useEffect, useState } from 'react';
import './splashScreen.css'; // Import the CSS for splash screen

const SplashScreen = ({ onAnimationEnd }) => {
    
  const [isShrinking, setIsShrinking] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShrinking(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isShrinking) {
      const animationTimer = setTimeout(() => {
        onAnimationEnd();
      }, 190); // Match the duration of the shrink animation

      return () => clearTimeout(animationTimer);
    }
  }, [isShrinking, onAnimationEnd]);

  return (
    <div className={`splash-screen w-full h-full flex items-center justify-center ${isShrinking ? 'shrink' : ''}`}>
      <div className="splash-message  w-full h-full flex items-center justify-center bg-gray-600/90 text-white-A700 text-xl p-4 rounded shadow-lg">
        <h2>Swipe left or right to view your posts</h2>
      </div>
    </div>
  );
};

export default SplashScreen;
