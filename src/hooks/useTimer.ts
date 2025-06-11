import { useState, useEffect, useRef, useCallback } from "react";

export const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const reset = useCallback(() => {
    pause();
    setSeconds(0);
    start();
  }, [pause, start]);

  useEffect(() => {
    start(); // 컴포넌트 마운트 시 자동 시작
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [start]);

  return {
    time: seconds,
    isPaused,
    start,
    pause,
    reset,
  };
};
