import { useState, useEffect } from "react";
import { generateSudokuPuzzle } from "../lib/sudokuGenerator";
import { useSudokuBoard } from "../hooks/useSudokuBoard";
import { useSudokuValidation } from "../hooks/useSudokuValidation";
import { getCellClasses, getNumberPadClass } from "../lib/styleUtils";
import { useTimer } from "../hooks/useTimer";
import type { DifficultyLevel } from "../types/sudoku";

export default function Index() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [initial, setInitial] = useState(() => {
    const { puzzle } = generateSudokuPuzzle(difficulty);
    return puzzle;
  });

  const {
    board,
    initialBoard,
    selectedCell,
    handleNumberInput,
    handleCellSelect,
    handleCellClear,
    setNewPuzzle,
    highlightNumber,
    highlightArea,
  } = useSudokuBoard(initial);

  const { conflictCells } = useSudokuValidation(board);
  const { time, start, stop } = useTimer();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop, difficulty]);

  const handleNewPuzzle = () => {
    const { puzzle } = generateSudokuPuzzle(difficulty);
    setInitial(puzzle);
    setNewPuzzle(puzzle);
    start();
    setIsPaused(false);
  };

  return (
    <div className="p-6 space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-l font-bold">오늘의 수도쿠를 풀어봐요!</h1>
        <div className="flex items-center justify-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as DifficultyLevel);
              handleNewPuzzle();
            }}
            className="px-2 py-1 text-sm rounded border bg-gray-100"
          >
            <option value="easy">쉬움</option>
            <option value="medium">보통</option>
            <option value="hard">어려움</option>
          </select>
          <div className="text-xl font-mono">{time}</div>
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              isPaused ? start() : stop();
            }}
            className="px-2 py-1 text-sm rounded border bg-gray-100 hover:bg-gray-200"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </div>

      {/* 보드 */}
      <div className="relative">
        <div className="grid grid-cols-9 gap-px bg-black w-fit mx-auto p-1">
          {board.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const cellClasses = getCellClasses(
                rowIdx,
                colIdx,
                cell,
                selectedCell,
                highlightNumber,
                highlightArea,
                initialBoard,
                conflictCells
              ).join(" ");

              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  className={`${cellClasses} border-0 p-0 focus:outline-none focus:ring-0`}
                  onClick={() => handleCellSelect(rowIdx, colIdx)}
                >
                  {cell !== 0 ? cell : ""}
                </button>
              );
            })
          )}
        </div>
        {isPaused && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <span className="text-white text-xl">일시정지</span>
          </div>
        )}
      </div>

      {/* 숫자 패드 */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => !isPaused && handleNumberInput(n)}
            className={getNumberPadClass(board, n)}
            disabled={isPaused}
          >
            {n}
          </button>
        ))}
      </div>

      {/* 추가 기능 버튼 */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="px-4 py-2 rounded border text-sm bg-gray-100 hover:bg-gray-200"
          onClick={() => !isPaused && handleCellClear()}
          disabled={isPaused}
        >
          삭제
        </button>
        <button
          className="px-4 py-2 rounded border text-sm bg-gray-100 hover:bg-gray-200"
          disabled={isPaused}
        >
          메모
        </button>
        <button
          className="px-4 py-2 rounded border text-sm bg-gray-100 hover:bg-gray-200"
          disabled={isPaused}
        >
          되돌리기
        </button>
        <button
          className="px-4 py-2 rounded border text-sm bg-yellow-100 hover:bg-yellow-200"
          disabled={isPaused}
        >
          힌트
        </button>
      </div>
    </div>
  );
}
