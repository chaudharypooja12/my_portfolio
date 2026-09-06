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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Mark = "X" | "O";
type CellValue = Mark | null;
type Difficulty = "easy" | "medium" | "hard";
type Outcome = Mark | "draw" | null;

interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface ScoreboardState {
  player: number;
  computer: number;
  draws: number;
  bestPlayerWins: number;
}

interface StoredBestResult {
  version: 1;
  bestPlayerWins: number;
}

const DIFFICULTY_OPTIONS: readonly DifficultyOption[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Random legal moves.",
    icon: Shuffle,
  },
  {
    value: "medium",
    label: "Medium",
    description: "Mixes tactical play with randomness.",
    icon: Shield,
  },
  {
    value: "hard",
    label: "Hard",
    description: "Optimal minimax play.",
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

function clearBestPlayerWins() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(BEST_RESULT_STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to clear the saved Tic-tac-toe result.", error);
  }
}

function readBestPlayerWins(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const storedValue = window.localStorage.getItem(BEST_RESULT_STORAGE_KEY);

    if (storedValue === null) {
      return 0;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (isValidBestResult(parsedValue)) {
      return parsedValue.bestPlayerWins;
    }

    clearBestPlayerWins();
  } catch (error) {
    console.warn("Unable to read the saved Tic-tac-toe result.", error);
    clearBestPlayerWins();
  }

  return 0;
}

function writeBestPlayerWins(bestPlayerWins: number) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredBestResult = {
    version: 1,
    bestPlayerWins,
  };

  window.localStorage.setItem(BEST_RESULT_STORAGE_KEY, JSON.stringify(payload));
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
    return <X className="h-8 w-8 text-primary md:h-10 md:w-10" aria-hidden="true" />;
  }

  if (value === "O") {
    return <Circle className="h-8 w-8 text-accent md:h-10 md:w-10" aria-hidden="true" />;
  }

  return null;
}

function getStatusText(outcome: Outcome, isComputerTurn: boolean): string {
  if (outcome === "X") {
    return "You won this round.";
  }

  if (outcome === "O") {
    return "The computer won this round.";
  }

  if (outcome === "draw") {
    return "This round is a draw.";
  }

  return isComputerTurn ? "Computer is thinking..." : "Your turn. Place X on any open square.";
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(() => createEmptyBoard());
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [scores, setScores] = useState<ScoreboardState>(() => ({
    player: 0,
    computer: 0,
    draws: 0,
    bestPlayerWins: readBestPlayerWins(),
  }));

  const timerRef = useRef<number | null>(null);
  const scoredBoardRef = useRef<string | null>(null);

  const outcome = useMemo(() => getOutcome(board), [board]);
  const winningLine = useMemo(() => getWinningLine(board), [board]);
  const statusText = useMemo(
    () => getStatusText(outcome, isComputerTurn),
    [outcome, isComputerTurn]
  );

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
        const player = currentScores.player + 1;
        return {
          ...currentScores,
          player,
          bestPlayerWins: Math.max(currentScores.bestPlayerWins, player),
        };
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
    try {
      writeBestPlayerWins(scores.bestPlayerWins);
    } catch (error) {
      console.warn("Unable to save the Tic-tac-toe best result.", error);
    }
  }, [scores.bestPlayerWins]);

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
      bestPlayerWins: scores.bestPlayerWins,
    });
  };

  const handleSquareClick = (index: number) => {
    if (board[index] !== null || isComputerTurn || outcome !== null) {
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
      <Card className="overflow-hidden border border-border/60 bg-card/85 shadow-[0_0_30px_oklch(0.7_0.12_280/10%)] backdrop-blur">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Playable project
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <UserRound className="h-3.5 w-3.5 text-primary" />
              You are X
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Bot className="h-3.5 w-3.5 text-accent" />
              Computer is O
            </span>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl">Tic-tac-toe</CardTitle>
            <CardDescription>
              Beat the computer across three difficulty levels without leaving the
              portfolio.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Player wins",
                value: scores.player,
                icon: UserRound,
                accent: "text-primary",
              },
              {
                label: "Computer wins",
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
                label: "Best saved",
                value: scores.bestPlayerWins,
                icon: Trophy,
                accent: "text-primary",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background/50 p-3"
              >
                <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <item.icon className={cn("h-3.5 w-3.5", item.accent)} />
                  {item.label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">Difficulty</h3>
              <span className="text-xs text-muted-foreground">
                Changes apply immediately
              </span>
            </div>

            <div
              className="grid gap-2 sm:grid-cols-3"
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
                    "rounded-2xl border px-3 py-3 text-left transition-all duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none",
                    difficulty === option.value
                      ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_oklch(0.7_0.12_280/10%)]"
                      : "border-border/60 bg-background/50 hover:border-primary/30 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <option.icon
                      className={cn(
                        "h-4 w-4",
                        difficulty === option.value ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    {option.label}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <div
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/70 px-3 py-2 text-sm text-foreground"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {isComputerTurn && outcome === null ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-accent" />
              ) : outcome === "X" ? (
                <Trophy className="h-4 w-4 text-primary" />
              ) : outcome === "O" ? (
                <Trophy className="h-4 w-4 text-accent" />
              ) : outcome === "draw" ? (
                <Minus className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sparkles className="h-4 w-4 text-primary" />
              )}
              <span>{statusText}</span>
            </div>

            <div className="mt-4 grid gap-2" role="grid" aria-label="Tic-tac-toe board" aria-busy={isComputerTurn}>
              {Array.from({ length: 3 }, (_, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-2" role="row">
                  {board.slice(rowIndex * 3, rowIndex * 3 + 3).map((value, columnIndex) => {
                    const index = rowIndex * 3 + columnIndex;
                    const isWinningCell = winningLine.includes(index);

                    return (
                      <div key={index} role="gridcell">
                        <button
                          type="button"
                          aria-label={getCellLabel(index, value)}
                          disabled={value !== null || isComputerTurn || outcome !== null}
                          onClick={() => handleSquareClick(index)}
                          className={cn(
                            "group aspect-square w-full rounded-2xl border bg-background/70 transition-all duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none disabled:cursor-not-allowed disabled:opacity-100",
                            isWinningCell
                              ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_oklch(0.7_0.12_280/10%)]"
                              : "border-border/60",
                            value === null && !isComputerTurn && outcome === null
                              ? "hover:border-primary/40 hover:bg-primary/5"
                              : "hover:border-border/60"
                          )}
                        >
                          <span className="flex h-full w-full items-center justify-center">
                            {renderMark(value)}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" className="flex-1" onClick={startNewRound}>
              <RotateCcw className="h-4 w-4" />
              New round
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={restartMatch}>
              <RotateCcw className="h-4 w-4" />
              Restart match
            </Button>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Quick rules</p>
            <ul className="mt-2 space-y-1.5">
              <li>• You always play first as X and the computer plays O.</li>
              <li>• Make three marks in a row horizontally, vertically, or diagonally.</li>
              <li>• New round keeps the score. Restart match clears the score.</li>
            </ul>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
