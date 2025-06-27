import ReactGA from "react-ga4";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Redo2, Undo2, Trash2, SquarePen, Lightbulb, Link } from "lucide-react";
import { toast } from "sonner";
import { shareUrl } from "@/lib/constants";
import { FacebookShareButton, TwitterShareButton, FacebookIcon, XIcon } from "react-share";
import { useTranslation } from "react-i18next";

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const urlDifficulty = searchParams.get("difficulty") as DifficultyLevel;
  const { t } = useTranslation();

  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    if (urlDifficulty && ["easy", "medium", "hard"].includes(urlDifficulty)) {
      return urlDifficulty;
    }
    return "easy";
  });
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
      try {
        await saveRecord({
          id: crypto.randomUUID(),
          user_id: user.id,
          solved_at: new Date().toLocaleDateString("sv-SE"),
          difficulty,
          time_seconds: timeRef.current,
          hints_used: 3 - hintCount,
          board_hash: hashBoard(board),
        });
        console.log("✅ 기록 저장 성공");
      } catch (error) {
        toast.error(t("game.saveFail"), {
          description: error instanceof Error ? error.message : t("game.unknownError"),
        });
      }
    };

    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBoardFull]);

  return (
    <div className="pt-24 sm:pt-36 px-1 sm:px-6 space-y-4 sm:space-y-6 text-center mb-6">
      <div className="space-y-3">
        <h1 className="text-l font-bold">{t("game.title")}</h1>
        <div className="flex items-center justify-center gap-6">
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as DifficultyLevel);
            }}
            className="px-2 py-1 text-sm rounded border bg-gray-100"
          >
            <option value="easy">{t("game.difficulty.easy")}</option>
            <option value="medium">{t("game.difficulty.medium")}</option>
            <option value="hard">{t("game.difficulty.hard")}</option>
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
                    className={`${cellClasses} p-0 bg-transparent focus:outline-none focus:ring-0 ${
                      isPaused ? "cursor-not-allowed" : ""
                    }`}
                    onClick={() => !isPaused && handleCellSelect(rowIdx, colIdx)}
                    disabled={isPaused}
                  >
                    {cell !== 0 ? (
                      <span className="text-lg sm:text-xl">{cell}</span>
                    ) : (
                      <div className="p-0.5 grid grid-cols-3 gap-0 text-[8px] sm:text-[10px] leading-[1] w-full h-full">
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
      <div className="flex justify-center gap-0.5 sm:gap-2 w-[calc(100vw-2rem)] sm:w-[350px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            size="icon"
            className={`${getNumberPadClass(board, num)} w-9 h-9 text-base sm:text-lg ${
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
      <div className="flex flex-wrap justify-center gap-4 mt-2 w-[calc(100vw-2rem)] sm:w-[350px] mx-auto">
        <Button
          variant="outline"
          size="sm"
          className={`w-10 h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && undo()}
          disabled={isPaused || isBoardFull}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`w-10 h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && redo()}
          disabled={isPaused || isBoardFull}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`w-10 h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && handleCellClear()}
          disabled={isPaused || isBoardFull}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`relative w-10 h-10 text-sm sm:text-lg ${isPaused || isBoardFull ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !isPaused && setIsMemoMode(!isMemoMode)}
          disabled={isPaused || isBoardFull}
        >
          <Badge
            variant="default"
            className={`absolute -top-3 -right-3 text-[10px] px-1.5 py-0 rounded-full ${
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
          className={`relative w-10 h-10 text-sm sm:text-lg bg-yellow-100 hover:bg-yellow-200 ${
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
            className="bg-[#FCD743] absolute -top-3 -right-3 text-[10px] px-1.5 py-0 rounded-full"
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
  const { t } = useTranslation();

  const getDifficultyText = (diff: string) => {
    switch (diff) {
      case "easy":
        return t("game.difficulty.easy");
      case "medium":
        return t("game.difficulty.medium");
      case "hard":
        return t("game.difficulty.hard");
      default:
        return diff;
    }
  };

  const title = `${t("game.shareTitle")}
${t("game.shareDescription", {
  difficulty: getDifficultyText(difficulty),
  minutes: Math.floor(time / 60),
  seconds: time % 60,
  hints: usedHints,
})}
${t("game.shareCall", { url: shareUrl })}`;

  return (
    <div className="relative z-10 mt-6 px-8 p-6 border rounded-lg bg-white shadow-md text-left space-y-4 w-fit mx-auto">
      <h2 className="text-2xl font-bold text-center text-[#7E24FD]">{t("game.complete")}</h2>
      <div className="text-gray-700">
        <p>
          <strong>{t("game.difficultyLabel")}:</strong> {getDifficultyText(difficulty)}
        </p>
        <p>
          <strong>{t("game.time")}:</strong> {Math.floor(time / 60)}
          {t("game.minutes")} {time % 60}
          {t("game.seconds")}
        </p>
        <p>
          <strong>{t("game.hintsUsed")}:</strong> {usedHints}
          {t("game.hintsCount")}
        </p>
      </div>
      <div className="text-center">
        <button
          className="mt-2 px-4 py-2 bg-[#7E24FD] text-white text-sm rounded hover:bg-purple-700"
          onClick={() => {
            ReactGA.event("restart_game", {
              category: "sudoku",
              label: difficulty,
            });
            onRestart();
          }}
        >
          {t("game.retry")}
        </button>
      </div>
      <div className="text-center pt-4">
        <h3 className="text-sm font-bold">{t("game.share")}</h3>
      </div>
      <div className="flex justify-center gap-2">
        <Badge
          className="px-2 py-2 bg-gray-500 text-white text-sm rounded-full hover:bg-gray-600 w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(title);
            toast.success(t("game.copyShareText"));
            ReactGA.event("share_click", {
              category: "engagement",
              label: "link_copy",
            });
          }}
        >
          <Link className="w-4 h-4" />
        </Badge>
        <FacebookShareButton
          url={shareUrl}
          title={title}
          onClick={() =>
            ReactGA.event("share_click", {
              category: "engagement",
              label: "facebook",
            })
          }
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={shareUrl}
          title={title}
          onClick={() =>
            ReactGA.event("share_click", {
              category: "engagement",
              label: "x",
            })
          }
        >
          <XIcon size={32} round />
        </TwitterShareButton>
      </div>
    </div>
  );
}

function BoardPaused() {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
      <div className="text-lg font-medium text-gray-700">{t("game.paused")}</div>
    </div>
  );
}
