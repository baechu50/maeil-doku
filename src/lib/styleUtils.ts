import { SudokuBoard } from "../types/sudoku";

const getTextClass = (
  isFixed: boolean,
  isUserInput: boolean,
  isConflictCell: boolean
): string => {
  if (isConflictCell && isUserInput) return "text-red-500";
  if (isFixed) return "text-black";
  return "text-blue-500";
};

const getBackgroundClass = (
  isSelected: boolean,
  isConflictCell: boolean,
  isUserInput: boolean,
  isSameNumber: boolean,
  isHighlight: boolean
): string => {
  if (isSelected) return "bg-yellow-100 dark:bg-yellow-100";
  if (isConflictCell && !isUserInput) {
    return isUserInput
      ? "bg-white dark:bg-white"
      : "bg-red-100 dark:bg-red-100";
  }
  if (isSameNumber) return "bg-blue-100 dark:bg-blue-100";
  if (isHighlight) return "bg-blue-50 dark:bg-blue-50";
  return "bg-white dark:bg-white";
};

export const getNumberPadClass = (
  board: SudokuBoard,
  number: number
): string => {
  const count = board.flat().filter((cell) => cell === number).length;
  const isFullyUsed = count === 9;
  return `w-8 h-8 rounded border text-sm hover:bg-gray-100 ${
    isFullyUsed ? "bg-gray-200 text-gray-500" : "bg-white"
  }`;
};

export const getCellClasses = (
  rowIdx: number,
  colIdx: number,
  cell: number,
  selectedCell: [number, number] | null,
  highlightNumber: number | null,
  highlightArea: {
    row: number | null;
    col: number | null;
    box: [number, number] | null;
  },
  initialBoard: number[][],
  conflictCells: [number, number][]
): string[] => {
  const isSelected =
    selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx;
  const isSameNumber =
    highlightNumber !== null && cell === highlightNumber && cell !== 0;
  const isHighlight =
    highlightArea.row === rowIdx ||
    highlightArea.col === colIdx ||
    (highlightArea.box !== null &&
      Math.floor(rowIdx / 3) === highlightArea.box[0] &&
      Math.floor(colIdx / 3) === highlightArea.box[1]);
  const isFixed = initialBoard[rowIdx][colIdx] !== 0;
  const isUserInput = cell !== 0 && !isFixed;
  const isConflictCell = conflictCells.some(
    ([r, c]) => r === rowIdx && c === colIdx
  );

  return [
    "w-10 h-10 flex items-center justify-center text-sm cursor-pointer select-none",
    colIdx % 3 === 2 && colIdx !== 8 ? "border-r-2 border-black" : "",
    rowIdx % 3 === 2 && rowIdx !== 8 ? "border-b-2 border-black" : "",
    getTextClass(isFixed, isUserInput, isConflictCell),
    getBackgroundClass(
      isSelected,
      isConflictCell,
      isUserInput,
      isSameNumber,
      isHighlight
    ),
  ];
};
