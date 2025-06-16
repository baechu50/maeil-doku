import { DifficultyLevel } from "./sudoku";

export interface SudokuRecord {
  id: string;
  user_id: string;
  solved_at: string;
  difficulty: DifficultyLevel;
  time_seconds: number;
  hints_used: number;
  board_hash: string;
}

export interface DailySudokuRecords {
  easy: SudokuRecord[];
  medium: SudokuRecord[];
  hard: SudokuRecord[];
}

export interface CalendarMap {
  [date: string]: DailySudokuRecords;
}
