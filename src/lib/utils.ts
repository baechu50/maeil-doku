import { SudokuRecord } from "@/types/record";

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function hashBoard(board: number[][]): string {
  return board.flat().join("");
}

export function getStreakCount(records: SudokuRecord[]): number {
  const playedDates = new Set(records.map((r) => r.solved_at));
  let count = 0;
  const date = new Date();

  while (playedDates.has(date.toISOString().slice(0, 10))) {
    count++;
    date.setDate(date.getDate() - 1);
  }

  return count;
}
