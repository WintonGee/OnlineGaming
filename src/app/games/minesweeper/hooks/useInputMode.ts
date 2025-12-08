import { useState, useCallback, useEffect, useRef } from 'react';
import { InputMode } from '../types';

export function useInputMode() {
  const [inputMode, setInputMode] = useState<InputMode>('reveal');
  const [hasMouse, setHasMouse] = useState(false);
  // Track if the current interaction started with touch (to distinguish from mouse)
  const lastInteractionWasTouchRef = useRef(false);

  // Detect if device has a mouse (for hiding toggle button on desktop)
  useEffect(() => {
    const detectMouse = () => {
      setHasMouse(true);
    };

    const handleTouchStart = () => {
      // Mark that the user is using touch
      lastInteractionWasTouchRef.current = true;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // If we recently had a touch event, this mousedown is likely synthetic - ignore it
      // Real mouse clicks on desktop won't have touch events before them
      if (!lastInteractionWasTouchRef.current) {
        setHasMouse(true);
      }
      // Reset the flag after a short delay
      setTimeout(() => {
        lastInteractionWasTouchRef.current = false;
      }, 300);
    };

    // Listen for mouse movement to detect mouse presence
    window.addEventListener('mousemove', detectMouse, { once: true });
    // Also detect mouse on mousedown (for users who click without moving first)
    window.addEventListener('mousedown', handleMouseDown);
    // Track touch events to distinguish real mouse from synthetic
    window.addEventListener('touchstart', handleTouchStart);

    // Check for touch device - if no touch capability, definitely has mouse
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!hasTouch) {
      setHasMouse(true);
    }

    return () => {
      window.removeEventListener('mousemove', detectMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const toggleMode = useCallback(() => {
    setInputMode(mode => (mode === 'reveal' ? 'flag' : 'reveal'));
  }, []);

  const setMode = useCallback((mode: InputMode) => {
    setInputMode(mode);
  }, []);

  return {
    inputMode,
    toggleMode,
    setMode,
    hasMouse,
  };
}
