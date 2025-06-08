import { memo, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';

interface TimerProps {
  difficulty: string;
  onPauseChange: (isPaused: boolean) => void;
}

const Timer = memo(({ difficulty, onPauseChange }: TimerProps) => {
  const { time, isPaused, start, pause, reset } = useTimer();

  useEffect(() => {
    reset();
  }, [difficulty, reset]);

  useEffect(() => {
    onPauseChange(isPaused);
  }, [isPaused, onPauseChange]);

  const handleClick = () => {
    if (isPaused) {
      start();
    } else {
      pause();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-xl font-mono">{time}</div>
      <button
        onClick={handleClick}
        className="px-2 py-1 text-sm rounded border bg-gray-100 hover:bg-gray-200"
      >
        {isPaused ? "▶" : "⏸"}
      </button>
    </div>
  );
});

Timer.displayName = 'Timer';

export default Timer; 