import { useState, useEffect, useRef, useCallback } from "react";
import { generateSudokuPuzzle, wrapSudokuBoard, createEmptyBoard } from "../lib/sudokuGenerator";
import { useSudokuBoard } from "../hooks/useSudokuBoard";
import { useSudokuValidation } from "../hooks/useSudokuValidation";
import { getCellClasses, getNumberPadClass, getMemoClass } from "../lib/styleUtils";
import type { DifficultyLevel, SudokuBoard } from "../types/sudoku";
import Timer from "../components/Timer";
import { useUser } from "@supabase/auth-helpers-react";
import { useRecords } from "@/hooks/useRecords";
import { hashBoard } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Redo2, Undo2, Trash2, SquarePen, Lightbulb } from "lucide-react";

export default function GamePage() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [currentSolution, setCurrentSolution] = useState<SudokuBoard>(() =>
    wrapSudokuBoard(createEmptyBoard())
  );
  const [isPaused, setIsPaused] = useState(false);
  const timeRef = useRef(0);

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
    undo,
    redo, // 추가
  } = useSudokuBoard(initial, currentSolution);

  const { conflictCells, isBoardFull } = useSudokuValidation(board);
  const [hintCount, setHintCount] = useState(3);

  const user = useUser();
  const { saveRecord } = useRecords();

  const handleNewPuzzle = useCallback(() => {
    const { puzzle, solution } = generateSudokuPuzzle(difficulty);
    setInitial(puzzle);
    setCurrentSolution(solution);
    setNewPuzzle(puzzle, solution);
    setHintCount(3);
  }, [difficulty, setNewPuzzle]);

  useEffect(() => {
    handleNewPuzzle();
  }, [difficulty, handleNewPuzzle]);

  useEffect(() => {
    if (!isBoardFull || !user) return;

    const save = async () => {
      const { error } = await saveRecord({
        id: crypto.randomUUID(),
        user_id: user.id,
        solved_at: new Date().toLocaleDateString("sv-SE"),
        difficulty,
        time_seconds: timeRef.current,
        hints_used: 3 - hintCount,
        board_hash: hashBoard(board),
      });

      if (error) {
        console.error("❌ 기록 저장 실패:", error.message);
      }
    };

    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBoardFull]);

  return (
    <div className="pt-24 sm:pt-36 px-1 sm:px-6 space-y-4 sm:space-y-6 text-center mb-6">
      <div className="space-y-3">
        <h1 className="text-l font-bold">🦆 오늘의 수도쿠를 풀어봐요 🦆</h1>
        <div className="flex items-center justify-center gap-6">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as DifficultyLevel);
            }}
            className="px-2 py-1 text-sm rounded border bg-gray-100"
          >
            <option value="easy">쉬움</option>
            <option value="medium">보통</option>
            <option value="hard">어려움</option>
          </select>
          {!isBoardFull && (
            <Timer
              difficulty={difficulty}
              onPauseChange={setIsPaused}
              onTimeUpdate={(t) => (timeRef.current = t)}
            />
          )}
        </div>
      </div>

      {/* 보드 */}
      <div className="relative">
        {isPaused && <BoardPaused />}
        {isBoardFull ? (
          <BoardResult
            time={timeRef.current}
            usedHints={3 - hintCount}
            difficulty={difficulty}
            onRestart={handleNewPuzzle}
          />
        ) : (
          <div className="grid grid-cols-9 gap-0 bg-gray-600 w-fit mx-auto p-0.5">
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
                    className={`${cellClasses} p-0 bg-transparent border-gray-700 border-[0.5px] focus:outline-none focus:ring-0 ${
                      isPaused ? "cursor-not-allowed" : ""
                    }`}
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
                            className={`flex items-center justify-center h-full w-full ${getMemoClass(
                              idx
                            )}`}
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
        )}
      </div>

      {/* 숫자 패드 */}
      <div className="flex justify-center gap-1 sm:gap-2 w-[calc(100vw-2rem)] sm:w-[350px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="icon"
            className={`${getNumberPadClass(board, num)} w-12 h-12 sm:w-10 sm:h-10 text-sm sm:text-lg ${
              isPaused ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isPaused && handleNumberInput(num)}
            disabled={isPaused || isBoardFull}
          >
            {num}
          </Button>
        ))}
      </div>

      {/* 추가 기능 버튼 */}
      <div className="flex flex-wrap justify-center gap-6 mt-2 w-[calc(100vw-2rem)] sm:w-[350px] mx-auto">
        <Button
          variant="outline"
          size="sm"
          className={`w-12 h-12 sm:w-10 sm:h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && undo()}
          disabled={isPaused || isBoardFull}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`w-12 h-12 sm:w-10 sm:h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && redo()}
          disabled={isPaused || isBoardFull}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`w-12 h-12 sm:w-10 sm:h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && handleCellClear()}
          disabled={isPaused || isBoardFull}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`relative w-12 h-12 sm:w-10 sm:h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && setIsMemoMode(!isMemoMode)}
          disabled={isPaused || isBoardFull}
        >
          <Badge
            variant="default"
            className={`absolute -top-4 -right-4 text-[10px] px-1.5 py-0 rounded-full ${
              isMemoMode ? "bg-green-400" : "bg-red-400"
            }`}
          >
            {isMemoMode ? "on" : "off"}
          </Badge>
          <SquarePen className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`relative w-12 h-12 sm:w-10 sm:h-10 text-sm sm:text-lg bg-yellow-100 hover:bg-yellow-200 ${
            isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => {
            if (!isPaused && hintCount > 0) {
              handleHint();
              setHintCount(hintCount - 1);
            }
          }}
          disabled={hintCount === 0 || isPaused || isBoardFull}
        >
          <Lightbulb className="w-4 h-4" />
          <Badge
            variant="default"
            className="bg-[#FCD743] absolute -top-4 -right-4 text-[10px] px-1.5 py-0 rounded-full"
          >
            {`${hintCount}/3`}
          </Badge>
        </Button>
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
    <div className="relative z-10 mt-6 p-6 border rounded-lg bg-white shadow-md text-left space-y-4 w-fit mx-auto">
      <h2 className="text-2xl font-bold text-center text-[#7E24FD]">🎉 퍼즐 완료!</h2>
      <div className="text-gray-700">
        <p>
          <strong>난이도:</strong> {difficulty}
        </p>
        <p>
          <strong>걸린 시간:</strong> {Math.floor(time / 60)}분 {time % 60}초
        </p>
        <p>
          <strong>사용한 힌트:</strong> {usedHints}개
        </p>
      </div>
      <div className="text-center">
        <button
          className="mt-2 px-4 py-2 bg-[#7E24FD] text-white text-sm rounded hover:bg-purple-700"
          onClick={onRestart}
        >
          새 게임 시작
        </button>
      </div>
    </div>
  );
}

function BoardPaused() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
      <div className="text-lg font-medium text-gray-700">타이머 중지 중...</div>
    </div>
  );
}
