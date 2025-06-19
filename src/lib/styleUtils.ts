const getTextClass = (isFixed: boolean, isUserInput: boolean, isConflictCell: boolean): string => {
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
    return isUserInput ? "bg-white dark:bg-white" : "bg-red-100 dark:bg-red-100";
  }
  if (isSameNumber) return "bg-blue-100 dark:bg-blue-100";
  if (isHighlight) return "bg-blue-50 dark:bg-blue-50";
  return "bg-white dark:bg-white";
};

export const getNumberPadClass = (board: number[][], number: number): string => {
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
  const isSelected = selectedCell?.[0] === rowIdx && selectedCell?.[1] === colIdx;
  const isSameNumber = highlightNumber !== null && cell === highlightNumber && cell !== 0;
  const isHighlight =
    highlightArea.row === rowIdx ||
    highlightArea.col === colIdx ||
    (highlightArea.box !== null &&
      Math.floor(rowIdx / 3) === highlightArea.box[0] &&
      Math.floor(colIdx / 3) === highlightArea.box[1]);
  const isFixed = initialBoard[rowIdx][colIdx] !== 0;
  const isUserInput = cell !== 0 && !isFixed;
  const isConflictCell = conflictCells.some(([r, c]) => r === rowIdx && c === colIdx);

  // 3x3 박스 구분선 로직
  const borderClasses = [];

  // 기본 테두리
  borderClasses.push("border border-gray-600");

  // 오른쪽 두꺼운 선 (3, 6번째 열)
  if (colIdx === 2 || colIdx === 5) {
    borderClasses.push("border-r-2 border-gray-600");
  }

  // 아래쪽 두꺼운 선 (3, 6번째 행)
  if (rowIdx === 2 || rowIdx === 5) {
    borderClasses.push("border-b-2 border-gray-600");
  }

  return [
    "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm cursor-pointer select-none",
    ...borderClasses,
    getTextClass(isFixed, isUserInput, isConflictCell),
    getBackgroundClass(isSelected, isConflictCell, isUserInput, isSameNumber, isHighlight),
  ];
};

export const getMemoClass = (number: number): string => {
  if (number === 0) return "text-red-500";
  if (number === 1) return "text-orange-500";
  if (number === 2) return "text-yellow-500";
  if (number === 3) return "text-green-500";
  if (number === 4) return "text-blue-500";
  if (number === 5) return "text-indigo-500";
  if (number === 6) return "text-purple-500";
  if (number === 7) return "text-pink-500";
  return "text-gray-500";
};
