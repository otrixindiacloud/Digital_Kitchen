import { useCallback, useRef } from "react";

interface UseTouchOptions {
  onTap?: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
  tapThreshold?: number;
}

export function useTouch({
  onTap,
  onLongPress,
  longPressDelay = 500,
  tapThreshold = 100,
}: UseTouchOptions = {}) {
  const startTimeRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startPositionRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startTimeRef.current = Date.now();
    const touch = e.touches[0];
    startPositionRef.current = { x: touch.clientX, y: touch.clientY };

    // Visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.transform = "scale(0.95)";
    target.style.transition = "transform 0.1s ease";

    // Set up long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  }, [onLongPress, longPressDelay]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const duration = Date.now() - startTimeRef.current;
    const target = e.currentTarget as HTMLElement;
    
    // Reset visual feedback
    target.style.transform = "";
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Check if it was a quick tap
    if (duration < tapThreshold && onTap) {
      onTap();
    }
  }, [onTap, tapThreshold]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startPositionRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - startPositionRef.current.x);
    const deltaY = Math.abs(touch.clientY - startPositionRef.current.y);
    
    // If moved too much, cancel long press
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };
}
