import { useState, useCallback, useEffect } from 'react';
import { InputMode } from '../types';

export function useInputMode() {
  const [inputMode, setInputMode] = useState<InputMode>('reveal');
  const [hasMouse, setHasMouse] = useState(false);

  // Detect if device has a mouse (for hiding toggle button on desktop)
  useEffect(() => {
    const detectMouse = () => {
      setHasMouse(true);
    };

    // Listen for mouse movement to detect mouse presence
    window.addEventListener('mousemove', detectMouse, { once: true });

    // Check for touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!hasTouch) {
      setHasMouse(true);
    }

    return () => {
      window.removeEventListener('mousemove', detectMouse);
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
