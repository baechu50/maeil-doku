import { memo, useEffect } from "react";
import { useTimer } from "../hooks/useTimer";
import { formatTime } from "../lib/utils";
import { Play, Pause } from "lucide-react";

interface TimerProps {
  difficulty: string;
  onPauseChange: (isPaused: boolean) => void;
  onTimeUpdate?: (time: number) => void;
}

const Timer = memo((props: TimerProps) => {
  const { difficulty, onPauseChange, onTimeUpdate } = props;
  const { time, isPaused, start, pause, reset } = useTimer();

  useEffect(() => {
    reset();
  }, [difficulty, reset]);

  useEffect(() => {
    onPauseChange(isPaused);
  }, [isPaused, onPauseChange]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [time, onTimeUpdate]);

  const handleClick = () => {
    if (isPaused) {
      start();
    } else {
      pause();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-xl font-mono">{formatTime(time)}</div>
      <button
        onClick={handleClick}
        className="px-2 py-1 text-sm rounded border bg-gray-100 hover:bg-gray-200"
      >
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>
    </div>
  );
});

Timer.displayName = "Timer";

export default Timer;
