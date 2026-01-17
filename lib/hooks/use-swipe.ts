import { useEffect, useRef, useState } from 'react';

interface SwipeConfig {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
}

export function useSwipe(config: SwipeConfig) {
    const {
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        threshold = 50,
    } = config;

    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const touchEnd = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        };
    };

    const handleTouchMove = (e: TouchEvent) => {
        touchEnd.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        };
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const deltaX = touchStart.current.x - touchEnd.current.x;
        const deltaY = touchStart.current.y - touchEnd.current.y;

        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

        if (isHorizontalSwipe) {
            if (deltaX > threshold && onSwipeLeft) {
                onSwipeLeft();
            } else if (deltaX < -threshold && onSwipeRight) {
                onSwipeRight();
            }
        } else {
            if (deltaY > threshold && onSwipeUp) {
                onSwipeUp();
            } else if (deltaY < -threshold && onSwipeDown) {
                onSwipeDown();
            }
        }
    };

    return {
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}
