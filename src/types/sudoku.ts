export type DifficultyLevel = "easy" | "medium" | "hard";

export type SudokuBoard = {
  board: number[][];
  memos: boolean[][][];
};

export interface PostSudokuRequest {
  board: SudokuBoard;
  startedAt: string;
  difficulty: DifficultyLevel;
  timeInSeconds: number;
  hintsUsed: number;
}