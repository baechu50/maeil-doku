import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SudokuRecord, CalendarMap } from "@/types/record";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

export function getFastestRecord(records: SudokuRecord[]): SudokuRecord | null {
  if (records.length === 0) return null;

  return records.reduce((min, record) => (record.time_seconds < min.time_seconds ? record : min));
}

export function getMonthlyCalendarMap(
  records: SudokuRecord[],
  year: number,
  month: number
): CalendarMap {
  const calendarMap: CalendarMap = {};

  // 해당 월의 날짜 키 초기화
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toLocaleDateString("sv-SE");
    calendarMap[dateStr] = { easy: [], medium: [], hard: [] };
  }

  // 각 기록을 날짜+난이도 기준으로 가장 빠른 기록으로 덮어쓰기
  for (const record of records) {
    const { solved_at: date, difficulty } = record;
    const current = calendarMap[date]?.[difficulty];

    if (calendarMap[date]) {
      calendarMap[date][difficulty] = getFastestRecord([...(current ?? []), record])
        ? [record]
        : [];
    }
  }

  return calendarMap;
}
