import React, { useEffect } from 'react';
import './CustomCursor.css';

/**
 * CustomCursor
 * 
 * Disabled follower overlay as requested, restoring native OS cursor visibility
 * while preserving global pointermove tracking for the WebGL background rays.
 */
const CustomCursor = () => {
  useEffect(() => {
    // Ensure native cursor is always visible
    document.documentElement.classList.remove('hide-native-cursor');
  }, []);

  return null;
};

export default CustomCursor;