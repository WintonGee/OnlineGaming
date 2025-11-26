import { useCallback, useRef } from 'react';

interface LongPressOptions {
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void;
  onClick?: (event: React.TouchEvent | React.MouseEvent) => void;
  delay?: number;
}

export function useLongPress({
  onLongPress,
  onClick,
  delay = 500,
}: LongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const preventClickRef = useRef(false);

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      isLongPressRef.current = false;
      preventClickRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        preventClickRef.current = true;
        // Provide haptic feedback on mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
        onLongPress(event);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
      const wasLongPress = isLongPressRef.current;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Only trigger onClick if it wasn't a long press and click handler exists
      if (shouldTriggerClick && !preventClickRef.current && !wasLongPress && onClick) {
        onClick(event);
      }

      // Reset the flag after a short delay to allow for the next interaction
      setTimeout(() => {
        isLongPressRef.current = false;
        preventClickRef.current = false;
      }, 50);
    },
    [onClick]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      start(event);
    },
    [start]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      clear(event);
    },
    [clear]
  );

  const handleTouchMove = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      start(event);
    },
    [start]
  );

  const handleMouseUp = useCallback(
    (event: React.MouseEvent) => {
      clear(event);
    },
    [clear]
  );

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };
}
