"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  TrendingUp,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  setLocalStorageValue,
  useLocalStorageValue,
} from "@/hooks/use-local-storage-value"

type Direction = "up" | "down" | "left" | "right"
type GameStatus = "idle" | "running" | "paused" | "gameOver"
type GameOverReason = "wall" | "self" | "boardFull" | null

type Point = {
  x: number
  y: number
}

type StoredStats = {
  highScore: number
  highestLevel: number
}

type GameState = {
  snake: Point[]
  food: Point
  direction: Direction
  queuedDirection: Direction
  status: GameStatus
  gameOverReason: GameOverReason
  score: number
  level: number
  foodsEaten: number
  highScore: number
  highestLevel: number
}

const GRID_SIZE = 16
const LEVEL_UP_EVERY = 4
const BASE_TICK_MS = 220
const SPEED_STEP_MS = 18
const MIN_TICK_MS = 90
const STORAGE_KEY = "portfolio-snake-stats"

const DEFAULT_STATS: StoredStats = {
  highScore: 0,
  highestLevel: 1,
}

const INITIAL_DIRECTION: Direction = "right"
const INITIAL_SNAKE: Point[] = [
  { x: 5, y: 8 },
  { x: 4, y: 8 },
  { x: 3, y: 8 },
]
const INITIAL_FOOD: Point = { x: 11, y: 8 }

const DIRECTION_BUTTONS = [
  {
    direction: "up" as const,
    label: "Move up",
    icon: ArrowUp,
    position: "col-start-2 row-start-1",
  },
  {
    direction: "left" as const,
    label: "Move left",
    icon: ArrowLeft,
    position: "col-start-1 row-start-2",
  },
  {
    direction: "down" as const,
    label: "Move down",
    icon: ArrowDown,
    position: "col-start-2 row-start-2",
  },
  {
    direction: "right" as const,
    label: "Move right",
    icon: ArrowRight,
    position: "col-start-3 row-start-2",
  },
]

function cloneSnake(): Point[] {
  return INITIAL_SNAKE.map((segment) => ({ ...segment }))
}

function pointKey(point: Point): string {
  return `${point.x}:${point.y}`
}

function samePoint(first: Point, second: Point): boolean {
  return first.x === second.x && first.y === second.y
}

function getLevel(foodsEaten: number): number {
  return Math.floor(foodsEaten / LEVEL_UP_EVERY) + 1
}

function getTickMs(level: number): number {
  return Math.max(MIN_TICK_MS, BASE_TICK_MS - (level - 1) * SPEED_STEP_MS)
}

function isValidStatNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
}

function parseStoredStats(rawValue: string | null): StoredStats {
  if (!rawValue) {
    return DEFAULT_STATS
  }

  try {
    const parsed: unknown = JSON.parse(rawValue)

    if (typeof parsed !== "object" || parsed === null) {
      return DEFAULT_STATS
    }

    const candidate = parsed as Record<string, unknown>

    return {
      highScore: isValidStatNumber(candidate.highScore)
        ? Math.floor(candidate.highScore)
        : DEFAULT_STATS.highScore,
      highestLevel: isValidStatNumber(candidate.highestLevel)
        ? Math.max(1, Math.floor(candidate.highestLevel))
        : DEFAULT_STATS.highestLevel,
    }
  } catch (error) {
    console.warn("Unable to read saved Snake results.", error)
    return DEFAULT_STATS
  }
}

function writeStoredStats(stats: StoredStats): void {
  try {
    setLocalStorageValue(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.warn("Unable to save Snake results.", error)
  }
}

function createFood(occupied: Point[]): Point | null {
  const occupiedKeys = new Set(occupied.map(pointKey))
  const available: Point[] = []

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const point = { x, y }

      if (!occupiedKeys.has(pointKey(point))) {
        available.push(point)
      }
    }
  }

  if (available.length === 0) {
    return null
  }

  return available[Math.floor(Math.random() * available.length)] ?? null
}

function isOppositeDirection(nextDirection: Direction, currentDirection: Direction): boolean {
  return (
    (nextDirection === "up" && currentDirection === "down") ||
    (nextDirection === "down" && currentDirection === "up") ||
    (nextDirection === "left" && currentDirection === "right") ||
    (nextDirection === "right" && currentDirection === "left")
  )
}

function moveHead(head: Point, direction: Direction): Point {
  if (direction === "up") {
    return { x: head.x, y: head.y - 1 }
  }

  if (direction === "down") {
    return { x: head.x, y: head.y + 1 }
  }

  if (direction === "left") {
    return { x: head.x - 1, y: head.y }
  }

  return { x: head.x + 1, y: head.y }
}

function createIdleGameState(stats: StoredStats = DEFAULT_STATS): GameState {
  return {
    snake: cloneSnake(),
    food: { ...INITIAL_FOOD },
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    status: "idle",
    gameOverReason: null,
    score: 0,
    level: 1,
    foodsEaten: 0,
    highScore: stats.highScore,
    highestLevel: stats.highestLevel,
  }
}

function createRunningGameState(stats: StoredStats = DEFAULT_STATS): GameState {
  const snake = cloneSnake()
  const food = createFood(snake) ?? { ...INITIAL_FOOD }

  return {
    snake,
    food,
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    status: "running",
    gameOverReason: null,
    score: 0,
    level: 1,
    foodsEaten: 0,
    highScore: stats.highScore,
    highestLevel: stats.highestLevel,
  }
}

function getStatusText(state: GameState): string {
  if (state.status === "idle") {
    return "Ready. Start, then steer with arrows, WASD, or touch."
  }

  if (state.status === "paused") {
    return "Paused."
  }

  if (state.status === "gameOver") {
    if (state.gameOverReason === "wall") {
      return "Game over: wall crash."
    }

    if (state.gameOverReason === "self") {
      return "Game over: you hit your tail."
    }

    if (state.gameOverReason === "boardFull") {
      return "You filled the board. Perfect run."
    }
  }

  return "Running. Grab fruit and keep the snake clear."
}

function getDirectionFromKey(key: string): Direction | null {
  if (key === "ArrowUp" || key.toLowerCase() === "w") {
    return "up"
  }

  if (key === "ArrowDown" || key.toLowerCase() === "s") {
    return "down"
  }

  if (key === "ArrowLeft" || key.toLowerCase() === "a") {
    return "left"
  }

  if (key === "ArrowRight" || key.toLowerCase() === "d") {
    return "right"
  }

  return null
}

export function SnakeGame() {
  const storedStatsValue = useLocalStorageValue(STORAGE_KEY)
  const storedStats = parseStoredStats(storedStatsValue)
  const [gameState, setGameState] = useState<GameState>(createIdleGameState)
  const highScore = Math.max(storedStats.highScore, gameState.highScore)
  const highestLevel = Math.max(storedStats.highestLevel, gameState.highestLevel)

  const intervalRef = useRef<number | null>(null)

  const updateGameState = useCallback(
    (updater: GameState | ((previousState: GameState) => GameState)) => {
      setGameState((previousState) =>
        typeof updater === "function"
          ? (updater as (previousState: GameState) => GameState)(previousState)
          : updater
      )
    },
    []
  )

  const handleDirectionChange = useCallback(
    (nextDirection: Direction) => {
      updateGameState((previousState) => {
        if (previousState.status === "idle" || previousState.status === "gameOver") {
          return previousState
        }

        if (isOppositeDirection(nextDirection, previousState.direction)) {
          return previousState
        }

        return {
          ...previousState,
          queuedDirection: nextDirection,
        }
      })
    },
    [updateGameState]
  )

  const startGame = useCallback(() => {
    updateGameState((previousState) => {
      if (previousState.status === "running" || previousState.status === "paused") {
        return previousState
      }

      return createRunningGameState({
        highScore: Math.max(storedStats.highScore, previousState.highScore),
        highestLevel: Math.max(
          storedStats.highestLevel,
          previousState.highestLevel
        ),
      })
    })
  }, [storedStats.highScore, storedStats.highestLevel, updateGameState])

  const pauseGame = useCallback(() => {
    updateGameState((previousState) =>
      previousState.status === "running"
        ? {
            ...previousState,
            status: "paused",
          }
        : previousState
    )
  }, [updateGameState])

  const resumeGame = useCallback(() => {
    updateGameState((previousState) =>
      previousState.status === "paused"
        ? {
            ...previousState,
            status: "running",
          }
        : previousState
    )
  }, [updateGameState])

  const restartGame = useCallback(() => {
    updateGameState((previousState) =>
      createRunningGameState({
        highScore: Math.max(storedStats.highScore, previousState.highScore),
        highestLevel: Math.max(
          storedStats.highestLevel,
          previousState.highestLevel
        ),
      })
    )
  }, [storedStats.highScore, storedStats.highestLevel, updateGameState])

  const tick = useCallback(() => {
    updateGameState((previousState) => {
      if (previousState.status !== "running") {
        return previousState
      }

      const direction = previousState.queuedDirection
      const currentHead = previousState.snake[0]

      if (!currentHead) {
        return createRunningGameState({
          highScore: previousState.highScore,
          highestLevel: previousState.highestLevel,
        })
      }

      const nextHead = moveHead(currentHead, direction)
      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= GRID_SIZE ||
        nextHead.y < 0 ||
        nextHead.y >= GRID_SIZE

      if (hitWall) {
        return {
          ...previousState,
          status: "gameOver",
          gameOverReason: "wall",
        }
      }

      const ateFood = samePoint(nextHead, previousState.food)
      const collisionSegments = ateFood
        ? previousState.snake
        : previousState.snake.slice(0, previousState.snake.length - 1)
      const hitSelf = collisionSegments.some((segment) => samePoint(segment, nextHead))

      if (hitSelf) {
        return {
          ...previousState,
          status: "gameOver",
          gameOverReason: "self",
        }
      }

      const nextSnake = ateFood
        ? [nextHead, ...previousState.snake]
        : [nextHead, ...previousState.snake.slice(0, previousState.snake.length - 1)]

      if (!ateFood) {
        return {
          ...previousState,
          snake: nextSnake,
          direction,
          queuedDirection: direction,
        }
      }

      const foodsEaten = previousState.foodsEaten + 1
      const level = getLevel(foodsEaten)
      const score = previousState.score + 10 * level
      const nextFood = createFood(nextSnake)

      if (!nextFood) {
        return {
          ...previousState,
          snake: nextSnake,
          direction,
          queuedDirection: direction,
          foodsEaten,
          level,
          score,
          highScore: Math.max(previousState.highScore, score),
          highestLevel: Math.max(previousState.highestLevel, level),
          status: "gameOver",
          gameOverReason: "boardFull",
        }
      }

      return {
        ...previousState,
        snake: nextSnake,
        food: nextFood,
        direction,
        queuedDirection: direction,
        foodsEaten,
        level,
        score,
        highScore: Math.max(previousState.highScore, score),
        highestLevel: Math.max(previousState.highestLevel, level),
      }
    })
  }, [updateGameState])

  useEffect(() => {
    if (
      gameState.highScore <= storedStats.highScore &&
      gameState.highestLevel <= storedStats.highestLevel
    ) {
      return
    }

    writeStoredStats({
      highScore,
      highestLevel,
    })
  }, [
    gameState.highScore,
    gameState.highestLevel,
    highScore,
    highestLevel,
    storedStats.highScore,
    storedStats.highestLevel,
  ])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const nextDirection = getDirectionFromKey(event.key)

      if (!nextDirection) {
        return
      }

      event.preventDefault()
      handleDirectionChange(nextDirection)
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleDirectionChange])

  useEffect(() => {
    const pauseWhenInactive = () => {
      if (document.visibilityState === "hidden") {
        pauseGame()
      }
    }

    window.addEventListener("blur", pauseGame)
    document.addEventListener("visibilitychange", pauseWhenInactive)

    return () => {
      window.removeEventListener("blur", pauseGame)
      document.removeEventListener("visibilitychange", pauseWhenInactive)
    }
  }, [pauseGame])

  useEffect(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (gameState.status !== "running") {
      return
    }

    intervalRef.current = window.setInterval(tick, getTickMs(gameState.level))

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [gameState.level, gameState.status, tick])

  const cells = useMemo(
    () =>
      Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
        x: index % GRID_SIZE,
        y: Math.floor(index / GRID_SIZE),
      })),
    []
  )

  const snakeCellKeys = useMemo(
    () => new Set(gameState.snake.map(pointKey)),
    [gameState.snake]
  )
  const headKey = gameState.snake[0] ? pointKey(gameState.snake[0]) : ""
  const foodKey = pointKey(gameState.food)
  const foodsProgress = gameState.foodsEaten % LEVEL_UP_EVERY
  const foodsUntilNextLevel =
    foodsProgress === 0 ? LEVEL_UP_EVERY : LEVEL_UP_EVERY - foodsProgress
  const speedMs = getTickMs(gameState.level)

  return (
    <Card className="relative w-full overflow-hidden border border-border/60 bg-card/85 shadow-[0_0_24px_oklch(0.55_0.16_300/10%)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.82_0.16_140/18%),transparent_35%),radial-gradient(circle_at_bottom_right,oklch(0.78_0.16_30/18%),transparent_28%)]" />

      <CardHeader className="relative gap-2 px-3 pb-2 pt-3 sm:px-4">
        <div className="grid grid-cols-2 gap-2">
              <div className="glass rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <Trophy className="h-3.5 w-3.5" />
                  Score
                </div>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold text-foreground">{gameState.score}</span>
                  <span className="text-xs text-muted-foreground">Best {highScore}</span>
                </div>
              </div>

              <div className="glass rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Level
                </div>
                <div className="mt-1 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold text-foreground">{gameState.level}</span>
                  <span className="text-xs text-muted-foreground">
                    Best {highestLevel}
                  </span>
                </div>
              </div>

          <p
            aria-live="polite"
            className="col-span-2 text-center text-xs text-muted-foreground"
          >
            {getStatusText(gameState)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 pt-0">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-background/50 px-2.5 py-1">
            Grid {GRID_SIZE}×{GRID_SIZE}
          </span>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-700 dark:text-emerald-300">
            Next level in {foodsUntilNextLevel} food
          </span>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300">
            Speed {speedMs} ms
          </span>
        </div>

        <div className="mx-auto w-full max-w-[20rem] rounded-[calc(var(--radius-xl)+2px)] border border-border/60 bg-background/55 p-1.5 shadow-[inset_0_1px_0_oklch(1_0_0/12%)] sm:p-2">
          <div
            role="img"
            aria-label={`Snake board, ${GRID_SIZE} by ${GRID_SIZE}. Score ${gameState.score}, level ${gameState.level}. ${getStatusText(gameState)}`}
            className="grid aspect-square w-full gap-px overflow-hidden rounded-[var(--radius-xl)] bg-emerald-950/20"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {cells.map((cell) => {
              const key = pointKey(cell)
              const isHead = key === headKey
              const isFood = key === foodKey
              const isSnake = snakeCellKeys.has(key)

              return (
                <div
                  key={key}
                  aria-hidden="true"
                  className={[
                    "flex aspect-square items-center justify-center bg-emerald-950/10 text-[clamp(0.45rem,1.5vw,0.9rem)] leading-none transition-all",
                    isHead
                      ? "bg-gradient-to-br from-lime-300 via-emerald-400 to-green-600 shadow-[0_0_14px_oklch(0.8_0.23_145/40%)]"
                      : "",
                    !isHead && isSnake
                      ? "bg-gradient-to-br from-emerald-400 via-green-500 to-lime-500"
                      : "",
                    isFood
                      ? "bg-gradient-to-br from-orange-200 via-amber-300 to-rose-300 shadow-[0_0_12px_oklch(0.82_0.18_55/40%)]"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isFood ? <span className="drop-shadow-sm">🍎</span> : null}
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center text-xs text-muted-foreground">
            Use arrows or WASD, or tap the controls below.
          </div>

          <div className="mx-auto grid w-full max-w-[11rem] grid-cols-3 gap-2">
            {DIRECTION_BUTTONS.map(({ direction, icon: Icon, label, position }) => (
              <button
                key={direction}
                type="button"
                aria-label={label}
                onPointerDown={() => handleDirectionChange(direction)}
                className={[
                  "glass flex h-11 touch-manipulation items-center justify-center rounded-xl text-emerald-700 transition-all duration-200 hover:border-emerald-500/50 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100",
                  "active:scale-95 active:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                  position,
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={startGame}
              disabled={gameState.status === "running" || gameState.status === "paused"}
            >
              <Play className="h-4 w-4" />
              Start
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={pauseGame}
              disabled={gameState.status !== "running"}
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={resumeGame}
              disabled={gameState.status !== "paused"}
            >
              <Play className="h-4 w-4" />
              Resume
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={restartGame}>
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative justify-center border-t border-border/60 bg-background/30 py-3">
        <span className="text-center text-xs text-muted-foreground">
          Best score and level stay saved on this device.
        </span>
      </CardFooter>
    </Card>
  )
}
