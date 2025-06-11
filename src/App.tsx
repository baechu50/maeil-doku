import { useState } from "react";
import {
  generateSudokuPuzzle,
  wrapSudokuBoard,
  createEmptyBoard
} from "./lib/sudokuGenerator";
import { useSudokuBoard } from "./hooks/useSudokuBoard";
import { useSudokuValidation } from "./hooks/useSudokuValidation";
import { getCellClasses, getNumberPadClass } from "./lib/styleUtils";
import type { DifficultyLevel, SudokuBoard } from "./types/sudoku";
import Timer from "./components/Timer";

export default function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [currentSolution, setCurrentSolution] = useState<SudokuBoard>(() => wrapSudokuBoard(createEmptyBoard()));
  const [isPaused, setIsPaused] = useState(false);

  const [initial, setInitial] = useState(() => {
    const { puzzle, solution } = generateSudokuPuzzle(difficulty);
    setCurrentSolution(solution);
    return puzzle;
  });

  const {
    board,
    memos,
    initialBoard,
    selectedCell,
    handleNumberInput,
    handleCellSelect,
    handleCellClear,
    setNewPuzzle,
    highlightNumber,
    highlightArea,
    isMemoMode,
    setIsMemoMode,
    handleHint,
  } = useSudokuBoard(initial, currentSolution);

  const { conflictCells, isBoardFull } = useSudokuValidation(board);
  const [hintCount, setHintCount] = useState(3);

  const handleNewPuzzle = () => {
    const { puzzle, solution } = generateSudokuPuzzle(difficulty);
    setInitial(puzzle);
    setCurrentSolution(solution);
    setNewPuzzle(puzzle, solution);
    setHintCount(3);
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
          <Timer difficulty={difficulty} onPauseChange={setIsPaused} />
        </div>
      </div>

      {/* 보드 */}
      <div className="relative">
        {isPaused && (<BoardPaused />)}
        {isBoardFull && (<BoardResult time={timeRef.current} usedHints={3-hintCount} difficulty={difficulty} onRestart={handleNewPuzzle} />)}
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
                initialBoard.board,
                conflictCells
              ).join(" ");

              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  className={`${cellClasses} border-0 p-0 bg-transparent focus:outline-none focus:ring-0 ${isPaused ? 'cursor-not-allowed' : ''}`}
                  onClick={() => !isPaused && handleCellSelect(rowIdx, colIdx)}
                  disabled={isPaused}
                >
                  {cell !== 0 ? (
                    cell
                  ) : (
                    <div className="p-1 grid grid-cols-3 gap-0 text-[8px] leading-[1] w-full h-full">
                      {Array.from({ length: 9 }, (_, idx) => (
                        <span
                          key={idx}
                          className="flex items-center justify-center h-full w-full text-orange-500"
                          style={{ minHeight: "1em", minWidth: "1em" }}
                        >
                          {memos[rowIdx][colIdx][idx] ? idx + 1 : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 숫자 패드 */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className={`${getNumberPadClass(board, num)} ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isPaused && handleNumberInput(num)}
            disabled={isPaused}
          >
            {num}
          </button>
        ))}
      </div>

      {/* 추가 기능 버튼 */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className={`px-4 py-2 rounded border text-sm bg-gray-100 hover:bg-gray-200 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isPaused && handleCellClear()}
          disabled={isPaused}
        >
          삭제
        </button>
        <button
          className={`px-4 py-2 rounded border text-sm bg-gray-100 hover:bg-gray-200 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isPaused && setIsMemoMode(!isMemoMode)}
          disabled={isPaused}
        >
          {isMemoMode ? "메모 on" : "메모 off"}
        </button>
        <button
          className={`px-4 py-2 rounded border text-sm bg-yellow-100 hover:bg-yellow-200 ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
            if (!isPaused && hintCount > 0) {
              handleHint();
              setHintCount(hintCount - 1);
            }
          }}
          disabled={hintCount === 0 || isPaused}
        >
          {hintCount > 0 ? `힌트 ${hintCount}/3` : "힌트 없음"}
        </button>
      </div>
    </div>
  );
}

function BoardResult({
  time,
  usedHints,
  difficulty,
  onRestart,
}: {
  time: number;
  usedHints: number;
  difficulty: string;
  onRestart: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">🎉 축하합니다! 퍼즐을 완성했어요!</h2>
        <div className="mb-2">난이도: {difficulty}</div>
        <div className="mb-2">걸린 시간: {Math.floor(time / 60)}분 {time % 60}초</div>
        <div className="mb-4">사용한 힌트: {usedHints}개</div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onRestart}>
          새 게임 시작
        </button>
      </div>
    </div>
  );
}

function BoardPaused() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-orange-100 z-10">
      <div className="text-lg font-medium text-gray-700">타이머 중지</div>
    </div>
  );
}
