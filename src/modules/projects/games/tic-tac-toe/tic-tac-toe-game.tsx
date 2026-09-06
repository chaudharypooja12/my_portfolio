"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Brain,
  Circle,
  LoaderCircle,
  Minus,
  RotateCcw,
  Shuffle,
  Shield,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  setLocalStorageValue,
  useLocalStorageValue,
} from "@/hooks/use-local-storage-value";

type Mark = "X" | "O";
type CellValue = Mark | null;
type Difficulty = "easy" | "medium" | "hard";
type Outcome = Mark | "draw" | null;

interface DifficultyOption {
  value: Difficulty;
  label: string;
  icon: LucideIcon;
}

interface ScoreboardState {
  player: number;
  computer: number;
  draws: number;
}

interface StoredBestResult {
  version: 1;
  bestPlayerWins: number;
}

const DIFFICULTY_OPTIONS: readonly DifficultyOption[] = [
  {
    value: "easy",
    label: "Easy",
    icon: Shuffle,
  },
  {
    value: "medium",
    label: "Medium",
    icon: Shield,
  },
  {
    value: "hard",
    label: "Hard",
    icon: Brain,
  },
];

const WINNING_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PREFERRED_MOVES: readonly number[] = [4, 0, 2, 6, 8, 1, 3, 5, 7];
const BEST_RESULT_STORAGE_KEY = "portfolio:projects:games:tic-tac-toe:best-player-wins";
const CELL_NAMES: readonly string[] = [
  "Top left",
  "Top center",
  "Top right",
  "Middle left",
  "Center",
  "Middle right",
  "Bottom left",
  "Bottom center",
  "Bottom right",
];

function createEmptyBoard(): CellValue[] {
  return Array<CellValue>(9).fill(null);
}

function isValidBestResult(value: unknown): value is StoredBestResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<StoredBestResult>;

  return (
    candidate.version === 1 &&
    typeof candidate.bestPlayerWins === "number" &&
    Number.isInteger(candidate.bestPlayerWins) &&
    candidate.bestPlayerWins >= 0
  );
}

function parseBestPlayerWins(storedValue: string | null): number {
  if (storedValue === null) {
    return 0;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (isValidBestResult(parsedValue)) {
      return parsedValue.bestPlayerWins;
    }
  } catch (error) {
    console.warn("Unable to read the saved Tic-tac-toe result.", error);
  }

  return 0;
}

function writeBestPlayerWins(bestPlayerWins: number) {
  const payload: StoredBestResult = {
    version: 1,
    bestPlayerWins,
  };

  setLocalStorageValue(BEST_RESULT_STORAGE_KEY, JSON.stringify(payload));
}

function getOrderedMoves(board: readonly CellValue[]): number[] {
  return PREFERRED_MOVES.filter((move) => board[move] === null);
}

function getOutcome(board: readonly CellValue[]): Outcome {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : "draw";
}

function getWinningLine(board: readonly CellValue[]): readonly number[] {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
      return line;
    }
  }

  return [];
}

function findImmediateMove(board: readonly CellValue[], mark: Mark): number | null {
  for (const move of getOrderedMoves(board)) {
    const nextBoard = [...board];
    nextBoard[move] = mark;

    if (getOutcome(nextBoard) === mark) {
      return move;
    }
  }

  return null;
}

function getRandomMove(board: readonly CellValue[]): number {
  const legalMoves = getOrderedMoves(board);

  if (legalMoves.length === 0) {
    return 0;
  }

  return legalMoves[Math.floor(Math.random() * legalMoves.length)] ?? legalMoves[0];
}

function getMediumMove(board: readonly CellValue[]): number {
  const tacticalMove = findImmediateMove(board, "O") ?? findImmediateMove(board, "X");

  if (tacticalMove !== null && Math.random() < 0.75) {
    return tacticalMove;
  }

  return getRandomMove(board);
}

function minimax(board: readonly CellValue[], isComputerTurn: boolean, depth: number): number {
  const outcome = getOutcome(board);

  if (outcome === "O") {
    return 10 - depth;
  }

  if (outcome === "X") {
    return depth - 10;
  }

  if (outcome === "draw") {
    return 0;
  }

  const legalMoves = getOrderedMoves(board);

  if (isComputerTurn) {
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const move of legalMoves) {
      const nextBoard = [...board];
      nextBoard[move] = "O";
      bestScore = Math.max(bestScore, minimax(nextBoard, false, depth + 1));
    }

    return bestScore;
  }

  let bestScore = Number.POSITIVE_INFINITY;

  for (const move of legalMoves) {
    const nextBoard = [...board];
    nextBoard[move] = "X";
    bestScore = Math.min(bestScore, minimax(nextBoard, true, depth + 1));
  }

  return bestScore;
}

function getHardMove(board: readonly CellValue[]): number {
  const legalMoves = getOrderedMoves(board);

  if (legalMoves.length === 0) {
    return 0;
  }

  let bestMove = legalMoves[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const move of legalMoves) {
    const nextBoard = [...board];
    nextBoard[move] = "O";
    const score = minimax(nextBoard, false, 1);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function getComputerMove(board: readonly CellValue[], difficulty: Difficulty): number {
  if (difficulty === "easy") {
    return getRandomMove(board);
  }

  if (difficulty === "medium") {
    return getMediumMove(board);
  }

  return getHardMove(board);
}

function getCellLabel(index: number, value: CellValue): string {
  const row = Math.floor(index / 3) + 1;
  const column = (index % 3) + 1;
  const state =
    value === "X"
      ? "occupied by you"
      : value === "O"
        ? "occupied by the computer"
        : "empty, activate to place X";

  return `${CELL_NAMES[index]} square, ${state}. Row ${row}, column ${column}.`;
}

function renderMark(value: CellValue) {
  if (value === "X") {
    return (
      <X
        className="h-7 w-7 stroke-[2.25] text-primary sm:h-8 sm:w-8 md:h-9 md:w-9"
        aria-hidden="true"
      />
    );
  }

  if (value === "O") {
    return (
      <Circle
        className="h-7 w-7 stroke-[2.25] text-accent sm:h-8 sm:w-8 md:h-9 md:w-9"
        aria-hidden="true"
      />
    );
  }

  return null;
}

function getStatusText(outcome: Outcome, isComputerTurn: boolean): string {
  if (outcome === "X") {
    return "You win the round.";
  }

  if (outcome === "O") {
    return "AI wins the round.";
  }

  if (outcome === "draw") {
    return "Round drawn.";
  }

  return isComputerTurn ? "AI is thinking..." : "Your move.";
}

export function TicTacToeGame() {
  const storedBestResult = useLocalStorageValue(BEST_RESULT_STORAGE_KEY);
  const savedBestPlayerWins = parseBestPlayerWins(storedBestResult);
  const [board, setBoard] = useState<CellValue[]>(() => createEmptyBoard());
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [scores, setScores] = useState<ScoreboardState>({
    player: 0,
    computer: 0,
    draws: 0,
  });
  const bestPlayerWins = Math.max(savedBestPlayerWins, scores.player);

  const timerRef = useRef<number | null>(null);
  const scoredBoardRef = useRef<string | null>(null);

  const outcome = useMemo(() => getOutcome(board), [board]);
  const winningLine = useMemo(() => getWinningLine(board), [board]);
  const statusText = useMemo(
    () => getStatusText(outcome, isComputerTurn),
    [outcome, isComputerTurn]
  );
  const isBoardLocked = isComputerTurn || outcome !== null;
  const scoreboardItems = [
    {
      label: "You",
      value: scores.player,
      icon: UserRound,
      accent: "text-primary",
    },
    {
      label: "AI",
      value: scores.computer,
      icon: Bot,
      accent: "text-accent",
    },
    {
      label: "Draws",
      value: scores.draws,
      icon: Minus,
      accent: "text-muted-foreground",
    },
    {
      label: "Best",
      value: bestPlayerWins,
      icon: Trophy,
      accent: "text-primary",
    },
  ] satisfies readonly {
    label: string;
    value: number;
    icon: LucideIcon;
    accent: string;
  }[];

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (outcome === null) {
      return;
    }

    const boardKey = board.map((cell) => cell ?? "-").join("");

    if (scoredBoardRef.current === boardKey) {
      return;
    }

    scoredBoardRef.current = boardKey;
    setIsComputerTurn(false);
    setScores((currentScores) => {
      if (outcome === "X") {
        return { ...currentScores, player: currentScores.player + 1 };
      }

      if (outcome === "O") {
        return { ...currentScores, computer: currentScores.computer + 1 };
      }

      return { ...currentScores, draws: currentScores.draws + 1 };
    });
  }, [board, outcome]);

  useEffect(() => {
    if (!isComputerTurn || outcome !== null) {
      return;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setBoard((currentBoard) => {
        if (getOutcome(currentBoard) !== null) {
          return currentBoard;
        }

        const move = getComputerMove(currentBoard, difficulty);
        const nextBoard = [...currentBoard];
        nextBoard[move] = "O";
        return nextBoard;
      });

      setIsComputerTurn(false);
      timerRef.current = null;
    }, 550);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [difficulty, isComputerTurn, outcome]);

  useEffect(() => {
    if (scores.player <= savedBestPlayerWins) {
      return;
    }

    try {
      writeBestPlayerWins(scores.player);
    } catch (error) {
      console.warn("Unable to save the Tic-tac-toe best result.", error);
    }
  }, [savedBestPlayerWins, scores.player]);

  const startNewRound = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    scoredBoardRef.current = null;
    setBoard(createEmptyBoard());
    setIsComputerTurn(false);
  };

  const restartMatch = () => {
    startNewRound();
    setScores({
      player: 0,
      computer: 0,
      draws: 0,
    });
  };

  const handleSquareClick = (index: number) => {
    if (board[index] !== null || isBoardLocked) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = "X";

    setBoard(nextBoard);

    if (getOutcome(nextBoard) === null) {
      setIsComputerTurn(true);
    }
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden border border-border/60 bg-card/90 shadow-[0_18px_50px_rgba(10,14,35,0.16)] backdrop-blur">
        <CardContent className="grid gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
          <div className="space-y-3">
            <div
              className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-accent/10 px-3 py-2 text-center text-sm font-medium text-foreground"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isComputerTurn && outcome === null ? (
                <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-accent" />
              ) : outcome === "X" ? (
                <Trophy className="h-4 w-4 shrink-0 text-primary" />
              ) : outcome === "O" ? (
                <Trophy className="h-4 w-4 shrink-0 text-accent" />
              ) : outcome === "draw" ? (
                <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              )}
              <span>{statusText}</span>
            </div>

            <div className="mx-auto w-full max-w-[15rem] rounded-[1.85rem] border border-primary/30 bg-gradient-to-br from-primary/25 via-accent/20 to-primary/25 p-1.5 shadow-[0_0_36px_oklch(0.7_0.12_280/16%)] sm:max-w-[17rem]">
              <div
                className="grid gap-[3px] rounded-[1.45rem] bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 p-[3px]"
                role="grid"
                aria-label="Tic-tac-toe board"
                aria-busy={isComputerTurn}
              >
                {Array.from({ length: 3 }, (_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-3 gap-[3px]" role="row">
                    {board
                      .slice(rowIndex * 3, rowIndex * 3 + 3)
                      .map((value, columnIndex) => {
                        const index = rowIndex * 3 + columnIndex;
                        const isWinningCell = winningLine.includes(index);
                        const cellIsFilled = value !== null;

                        return (
                          <div key={index} role="gridcell">
                            <button
                              type="button"
                              aria-label={getCellLabel(index, value)}
                              disabled={cellIsFilled || isBoardLocked}
                              onClick={() => handleSquareClick(index)}
                              className={cn(
                                "group flex aspect-square w-full items-center justify-center rounded-[1rem] border border-border/40 bg-background/95 transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-100",
                                isWinningCell &&
                                  "border-primary/45 bg-primary/16 shadow-[inset_0_0_0_1px_oklch(0.7_0.12_280/35%)]",
                                value === "X" && !isWinningCell && "bg-primary/8",
                                value === "O" && !isWinningCell && "bg-accent/10",
                                !cellIsFilled &&
                                  !isBoardLocked &&
                                  "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/8",
                                !cellIsFilled &&
                                  isComputerTurn &&
                                  "bg-background/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                              )}
                            >
                              {renderMark(value)}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-2 lg:gap-2">
              {scoreboardItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-background/70 p-1.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:rounded-2xl lg:p-2.5"
                >
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    <item.icon className={cn("h-3.5 w-3.5", item.accent)} />
                    {item.label}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-foreground lg:mt-1.5 lg:text-2xl">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/65 p-3">
              <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                <Brain className="h-3.5 w-3.5 text-primary" />
                Difficulty
              </div>

              <div
                className="grid grid-cols-3 gap-2"
                role="group"
                aria-label="Select computer difficulty"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value)}
                    aria-pressed={difficulty === option.value}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-center transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                      difficulty === option.value
                        ? "border-primary/45 bg-primary/12 shadow-[0_0_24px_oklch(0.7_0.12_280/12%)]"
                        : "border-border/60 bg-background/70 hover:border-primary/30 hover:bg-primary/6"
                    )}
                  >
                    <option.icon
                      className={cn(
                        "mx-auto h-4 w-4",
                        difficulty === option.value ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <div className="mt-1 text-xs font-medium text-foreground">{option.label}</div>
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button type="button" className="w-full" onClick={startNewRound}>
                  <RotateCcw className="h-4 w-4" />
                  New round
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-background/70"
                  onClick={restartMatch}
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart match
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
