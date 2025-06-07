export type SudokuBoard = number[][];
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface GetSudokuResponse {
  board: SudokuBoard;
}

export interface PostSudokuRequest {
  board: SudokuBoard;
  startedAt: string;
  difficulty: DifficultyLevel;
  timeInSeconds: number;
  hintsUsed: number;
}