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
  if (records.length === 0) return 0;

  const playedDates = new Set(
    records.map((r) => new Date(r.solved_at).toLocaleDateString("sv-SE"))
  );

  const today = new Date();
  const todayStr = today.toLocaleDateString("sv-SE");

  // 오늘을 풀었는지 확인
  const playedToday = playedDates.has(todayStr);

  let count = 0;
  const currentDate = new Date(today);

  if (playedToday) {
    // 오늘을 풀었다면 오늘부터 과거로 거슬러 올라가기
    while (playedDates.has(currentDate.toLocaleDateString("sv-SE"))) {
      count++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
  } else {
    // 오늘을 안 풀었다면 어제부터 과거로 거슬러 올라가기
    currentDate.setDate(currentDate.getDate() - 1);
    while (playedDates.has(currentDate.toLocaleDateString("sv-SE"))) {
      count++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
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

  // 각 날짜+난이도에 대해 가장 빠른 기록만 저장
  for (const record of records) {
    const { solved_at: date, difficulty, time_seconds } = record;

    if (!calendarMap[date]) continue;

    const current = calendarMap[date][difficulty][0];

    if (!current || time_seconds < current.time_seconds) {
      calendarMap[date][difficulty] = [record];
    }
  }

  return calendarMap;
}
