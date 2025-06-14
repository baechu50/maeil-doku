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