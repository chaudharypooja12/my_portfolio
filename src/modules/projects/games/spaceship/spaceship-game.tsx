"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Timer,
  Trophy,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import {
  setLocalStorageValue,
  useLocalStorageValue,
} from "@/hooks/use-local-storage-value";

const STORAGE_KEY = "portfolio-spaceship-survival:v1";
const LEVEL_MILESTONE_MS = 15_000;
const MAX_LEVEL = 10;
const MAX_BEST_SCORE_MS = 3_600_000;
const STARTING_LIVES = 3;
const INVULNERABILITY_MS = 1_400;
const FIELD_PADDING = 14;
const DEFAULT_DIMENSIONS = { width: 720, height: 420 };
const EMPTY_INPUT: InputState = {
  up: false,
  down: false,
  left: false,
  right: false,
};
const DEFAULT_PERSISTED_STATS: PersistedStats = {
  bestScoreMs: 0,
  bestLevel: 0,
};
const STATUS_LABELS: Record<GameStatus, string> = {
  ready: "Ready",
  running: "Running",
  paused: "Paused",
  over: "Game Over",
};
const STAR_POINTS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${((index * 31) % 91) + 4}%`,
  top: `${((index * 47) % 80) + 8}%`,
  size: 2 + (index % 3),
  opacity: 0.2 + (index % 5) * 0.12,
}));

type GameStatus = "ready" | "running" | "paused" | "over";
type Direction = "up" | "down" | "left" | "right";
type InputState = Record<Direction, boolean>;
type Dimensions = { width: number; height: number };
type PersistedStats = { bestScoreMs: number; bestLevel: number };
type Asteroid = {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  variant: number;
};
type RuntimeState = {
  status: GameStatus;
  shipX: number;
  shipY: number;
  asteroids: Asteroid[];
  elapsedMs: number;
  lives: number;
  level: number;
  spawnCarryMs: number;
  lastFrameMs: number | null;
  invulnerableUntilMs: number;
  pausedInvulnerabilityMs: number;
  nextAsteroidId: number;
};
type GameSnapshot = {
  status: GameStatus;
  shipX: number;
  shipY: number;
  asteroids: Asteroid[];
  elapsedMs: number;
  lives: number;
  level: number;
  invulnerableRemainingMs: number;
};

type ControlPadButtonProps = {
  direction: Direction;
  label: string;
  icon: ReactNode;
  active: boolean;
  onPressChange: (direction: Direction, pressed: boolean) => void;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function formatSeconds(milliseconds: number) {
  return `${(milliseconds / 1_000).toFixed(1)}s`;
}

function getShipMetrics(dimensions: Dimensions) {
  const width = clamp(dimensions.width * 0.08, 36, 56);
  const height = width * 0.72;

  return {
    width,
    height,
    radius: width * 0.34,
  };
}

function getShipSpeed(dimensions: Dimensions) {
  return clamp(Math.min(dimensions.width, dimensions.height) * 0.95, 240, 420);
}

function getLevelForElapsed(elapsedMs: number) {
  return clamp(1 + Math.floor(elapsedMs / LEVEL_MILESTONE_MS), 1, MAX_LEVEL);
}

function getNextLevelAt(level: number) {
  return level >= MAX_LEVEL ? null : level * LEVEL_MILESTONE_MS;
}

function getSpawnInterval(level: number) {
  return Math.max(300, 980 - (level - 1) * 75);
}

function getMaxAsteroids(level: number) {
  return Math.min(12, 5 + Math.floor((level - 1) * 0.8));
}

function getAsteroidSpeedRange(dimensions: Dimensions, level: number) {
  const minSpeed = Math.min(
    dimensions.height * 0.62,
    dimensions.height * (0.28 + (level - 1) * 0.028)
  );
  const maxSpeed = Math.min(
    dimensions.height * 0.88,
    dimensions.height * (0.42 + (level - 1) * 0.036)
  );

  return { minSpeed, maxSpeed };
}

function createRuntimeState(dimensions: Dimensions, status: GameStatus): RuntimeState {
  const ship = getShipMetrics(dimensions);

  return {
    status,
    shipX: dimensions.width / 2,
    shipY: dimensions.height - ship.height / 2 - FIELD_PADDING,
    asteroids: [],
    elapsedMs: 0,
    lives: STARTING_LIVES,
    level: 1,
    spawnCarryMs: 0,
    lastFrameMs: null,
    invulnerableUntilMs: 0,
    pausedInvulnerabilityMs: 0,
    nextAsteroidId: 1,
  };
}

function createSnapshot(runtime: RuntimeState, nowMs: number): GameSnapshot {
  return {
    status: runtime.status,
    shipX: runtime.shipX,
    shipY: runtime.shipY,
    asteroids: [...runtime.asteroids],
    elapsedMs: runtime.elapsedMs,
    lives: runtime.lives,
    level: runtime.level,
    invulnerableRemainingMs:
      runtime.status === "paused"
        ? runtime.pausedInvulnerabilityMs
        : Math.max(0, runtime.invulnerableUntilMs - nowMs),
  };
}

function createAsteroid(dimensions: Dimensions, level: number, id: number): Asteroid {
  const { minSpeed, maxSpeed } = getAsteroidSpeedRange(dimensions, level);
  const minSize = clamp(dimensions.width * 0.035, 22, 28);
  const maxSize = clamp(dimensions.width * 0.07, 34, 48);
  const size = randomBetween(minSize, maxSize);

  return {
    id,
    x: randomBetween(size / 2 + FIELD_PADDING, dimensions.width - size / 2 - FIELD_PADDING),
    y: -size,
    size,
    vx: randomBetween(-dimensions.width * 0.08, dimensions.width * 0.08),
    vy: randomBetween(minSpeed, maxSpeed),
    rotation: randomBetween(0, 360),
    spin: randomBetween(-65, 65),
    variant: id % 3,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizePersistedStats(value: unknown): PersistedStats {
  if (!isRecord(value)) {
    return DEFAULT_PERSISTED_STATS;
  }

  const rawScore = value.bestScoreMs;
  const rawLevel = value.bestLevel;
  const bestScoreMs =
    typeof rawScore === "number" && Number.isFinite(rawScore)
      ? clamp(rawScore, 0, MAX_BEST_SCORE_MS)
      : 0;
  const bestLevel =
    typeof rawLevel === "number" && Number.isInteger(rawLevel)
      ? clamp(rawLevel, 0, MAX_LEVEL)
      : 0;

  return { bestScoreMs, bestLevel };
}

function parsePersistedStats(rawValue: string | null) {
  if (!rawValue) {
    return DEFAULT_PERSISTED_STATS;
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    return sanitizePersistedStats(parsed);
  } catch (error) {
    console.warn("Unable to read saved Spaceship Survival results.", error);
    return DEFAULT_PERSISTED_STATS;
  }
}

function writePersistedStats(stats: PersistedStats) {
  try {
    setLocalStorageValue(
      STORAGE_KEY,
      JSON.stringify(sanitizePersistedStats(stats))
    );
  } catch (error) {
    console.warn("Unable to save Spaceship Survival results.", error);
  }
}

function getDirectionFromKey(key: string): Direction | null {
  const normalizedKey = key.toLowerCase();

  switch (normalizedKey) {
    case "arrowup":
    case "w":
      return "up";
    case "arrowdown":
    case "s":
      return "down";
    case "arrowleft":
    case "a":
      return "left";
    case "arrowright":
    case "d":
      return "right";
    default:
      return null;
  }
}

function ControlPadButton({
  direction,
  label,
  icon,
  active,
  onPressChange,
  className = "",
}: ControlPadButtonProps) {
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onPressChange(direction, true);
  };

  const handlePointerRelease = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    onPressChange(direction, false);
  };

  return (
    <button
      type="button"
      aria-label={label}
      className={[
        "flex h-12 w-12 touch-none items-center justify-center rounded-2xl border",
        "border-border/70 bg-background/75 text-foreground shadow-sm transition",
        "hover:border-primary/60 hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        active ? "border-primary/70 bg-primary/15 text-primary" : "",
        className,
      ].join(" ")}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerRelease}
      onPointerCancel={handlePointerRelease}
      onLostPointerCapture={() => onPressChange(direction, false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      {icon}
    </button>
  );
}

export function SpaceshipGame() {
  const gradientId = `spaceship-body-${useId().replace(/:/g, "")}`;
  const storedStatsValue = useLocalStorageValue(STORAGE_KEY);
  const storedStats = parsePersistedStats(storedStatsValue);
  const [initialRuntime] = useState(() =>
    createRuntimeState(DEFAULT_DIMENSIONS, "ready")
  );
  const [bestStats, setBestStats] = useState<PersistedStats>(
    DEFAULT_PERSISTED_STATS
  );
  const displayedBestStats = {
    bestScoreMs: Math.max(storedStats.bestScoreMs, bestStats.bestScoreMs),
    bestLevel: Math.max(storedStats.bestLevel, bestStats.bestLevel),
  };
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const runtimeRef = useRef<RuntimeState>(initialRuntime);
  const dimensionsRef = useRef<Dimensions>(DEFAULT_DIMENSIONS);
  const inputRef = useRef<InputState>(EMPTY_INPUT);
  const bestStatsRef = useRef<PersistedStats>(bestStats);
  const lastPersistedSecondRef = useRef(-1);

  const [dimensions, setDimensions] = useState<Dimensions>(DEFAULT_DIMENSIONS);
  const [snapshot, setSnapshot] = useState<GameSnapshot>(() =>
    createSnapshot(initialRuntime, 0)
  );
  const [inputState, setInputState] = useState<InputState>(EMPTY_INPUT);

  useEffect(() => {
    bestStatsRef.current = {
      bestScoreMs: Math.max(
        bestStatsRef.current.bestScoreMs,
        storedStats.bestScoreMs
      ),
      bestLevel: Math.max(
        bestStatsRef.current.bestLevel,
        storedStats.bestLevel
      ),
    };
  }, [storedStats.bestLevel, storedStats.bestScoreMs]);

  const commitBestStats = useCallback((stats: PersistedStats) => {
    const sanitized = sanitizePersistedStats(stats);

    bestStatsRef.current = sanitized;
    setBestStats(sanitized);
    writePersistedStats(sanitized);
  }, []);

  const syncSnapshot = useCallback((nowMs: number) => {
    setSnapshot(createSnapshot(runtimeRef.current, nowMs));
  }, []);

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const setDirectionPressed = useCallback(
    (direction: Direction, pressed: boolean) => {
      if (inputRef.current[direction] === pressed) {
        return;
      }

      const nextState: InputState = {
        ...inputRef.current,
        [direction]: pressed,
      };

      inputRef.current = nextState;
      setInputState(nextState);
    },
    []
  );

  const clearInput = useCallback(() => {
    inputRef.current = EMPTY_INPUT;
    setInputState(EMPTY_INPUT);
  }, []);

  const maybePersistProgress = useCallback(
    (elapsedMs: number, level: number, force = false) => {
      const currentBest = bestStatsRef.current;
      const nextBest: PersistedStats = {
        bestScoreMs: Math.max(currentBest.bestScoreMs, elapsedMs),
        bestLevel: Math.max(currentBest.bestLevel, level),
      };

      if (
        nextBest.bestScoreMs === currentBest.bestScoreMs &&
        nextBest.bestLevel === currentBest.bestLevel
      ) {
        return;
      }

      const currentWholeSecond = Math.floor(elapsedMs / 1_000);

      if (
        !force &&
        nextBest.bestLevel === currentBest.bestLevel &&
        currentWholeSecond === lastPersistedSecondRef.current
      ) {
        return;
      }

      lastPersistedSecondRef.current = currentWholeSecond;
      commitBestStats(nextBest);
    },
    [commitBestStats]
  );

  const step = useCallback(
    function runStep(nowMs: number) {
      const runtime = runtimeRef.current;

      if (runtime.status !== "running") {
        frameRef.current = null;
        return;
      }

      if (runtime.lastFrameMs === null) {
        runtime.lastFrameMs = nowMs;
      }

      const deltaMs = clamp(nowMs - runtime.lastFrameMs, 0, 40);
      runtime.lastFrameMs = nowMs;
      runtime.elapsedMs += deltaMs;
      runtime.level = getLevelForElapsed(runtime.elapsedMs);

      const currentDimensions = dimensionsRef.current;
      const ship = getShipMetrics(currentDimensions);
      const shipSpeed = getShipSpeed(currentDimensions);
      const horizontalAxis =
        Number(inputRef.current.right) - Number(inputRef.current.left);
      const verticalAxis =
        Number(inputRef.current.down) - Number(inputRef.current.up);

      if (horizontalAxis !== 0 || verticalAxis !== 0) {
        const length = Math.hypot(horizontalAxis, verticalAxis) || 1;

        runtime.shipX += (horizontalAxis / length) * shipSpeed * (deltaMs / 1_000);
        runtime.shipY += (verticalAxis / length) * shipSpeed * (deltaMs / 1_000);
      }

      runtime.shipX = clamp(
        runtime.shipX,
        ship.width / 2 + FIELD_PADDING,
        currentDimensions.width - ship.width / 2 - FIELD_PADDING
      );
      runtime.shipY = clamp(
        runtime.shipY,
        ship.height / 2 + FIELD_PADDING,
        currentDimensions.height - ship.height / 2 - FIELD_PADDING
      );

      const spawnInterval = getSpawnInterval(runtime.level);
      const maxAsteroids = getMaxAsteroids(runtime.level);

      runtime.spawnCarryMs += deltaMs;

      while (
        runtime.spawnCarryMs >= spawnInterval &&
        runtime.asteroids.length < maxAsteroids
      ) {
        runtime.asteroids.push(
          createAsteroid(
            currentDimensions,
            runtime.level,
            runtime.nextAsteroidId
          )
        );
        runtime.nextAsteroidId += 1;
        runtime.spawnCarryMs -= spawnInterval;
      }

      runtime.asteroids = runtime.asteroids
        .map((asteroid) => ({
          ...asteroid,
          x: asteroid.x + asteroid.vx * (deltaMs / 1_000),
          y: asteroid.y + asteroid.vy * (deltaMs / 1_000),
          rotation: asteroid.rotation + asteroid.spin * (deltaMs / 1_000),
        }))
        .filter(
          (asteroid) =>
            asteroid.y - asteroid.size < currentDimensions.height + asteroid.size &&
            asteroid.x + asteroid.size > -asteroid.size &&
            asteroid.x - asteroid.size < currentDimensions.width + asteroid.size
        );

      if (nowMs >= runtime.invulnerableUntilMs) {
        const hitIndex = runtime.asteroids.findIndex((asteroid) => {
          const dx = asteroid.x - runtime.shipX;
          const dy = asteroid.y - runtime.shipY;
          const distance = Math.hypot(dx, dy);

          return distance < ship.radius + asteroid.size * 0.38;
        });

        if (hitIndex >= 0) {
          runtime.asteroids.splice(hitIndex, 1);
          runtime.lives -= 1;

          if (runtime.lives > 0) {
            runtime.invulnerableUntilMs = nowMs + INVULNERABILITY_MS;
            runtime.pausedInvulnerabilityMs = 0;
          } else {
            runtime.lives = 0;
            runtime.status = "over";
            clearInput();
            maybePersistProgress(runtime.elapsedMs, runtime.level, true);
          }
        }
      }

      maybePersistProgress(runtime.elapsedMs, runtime.level);
      syncSnapshot(nowMs);

      if (runtime.status === "running") {
        frameRef.current = requestAnimationFrame(runStep);
      } else {
        frameRef.current = null;
      }
    },
    [clearInput, maybePersistProgress, syncSnapshot]
  );

  const startLoop = useCallback(() => {
    stopLoop();
    frameRef.current = requestAnimationFrame(step);
  }, [step, stopLoop]);

  const startGame = useCallback(() => {
    maybePersistProgress(
      runtimeRef.current.elapsedMs,
      runtimeRef.current.level,
      true
    );

    const nextRuntime = createRuntimeState(dimensionsRef.current, "running");

    runtimeRef.current = nextRuntime;
    lastPersistedSecondRef.current = -1;
    clearInput();
    syncSnapshot(0);
    startLoop();
  }, [clearInput, maybePersistProgress, startLoop, syncSnapshot]);

  const pauseGame = useCallback(() => {
    const runtime = runtimeRef.current;

    if (runtime.status !== "running") {
      return;
    }

    runtime.status = "paused";
    runtime.lastFrameMs = null;
    runtime.pausedInvulnerabilityMs = Math.max(
      0,
      runtime.invulnerableUntilMs - performance.now()
    );
    runtime.invulnerableUntilMs = 0;
    clearInput();
    stopLoop();
    maybePersistProgress(runtime.elapsedMs, runtime.level, true);
    syncSnapshot(performance.now());
  }, [clearInput, maybePersistProgress, stopLoop, syncSnapshot]);

  const resumeGame = useCallback(() => {
    const runtime = runtimeRef.current;

    if (runtime.status !== "paused") {
      return;
    }

    runtime.status = "running";
    runtime.lastFrameMs = null;
    runtime.invulnerableUntilMs =
      performance.now() + runtime.pausedInvulnerabilityMs;
    runtime.pausedInvulnerabilityMs = 0;
    syncSnapshot(performance.now());
    startLoop();
  }, [startLoop, syncSnapshot]);

  useEffect(() => {
    const fieldElement = fieldRef.current;

    if (!fieldElement) {
      return;
    }

    const syncDimensions = () => {
      const rect = fieldElement.getBoundingClientRect();
      const nextDimensions = {
        width: Math.max(280, Math.round(rect.width)),
        height: Math.max(220, Math.round(rect.height)),
      };

      dimensionsRef.current = nextDimensions;
      setDimensions((current) =>
        current.width === nextDimensions.width &&
        current.height === nextDimensions.height
          ? current
          : nextDimensions
      );

      const runtime = runtimeRef.current;
      const ship = getShipMetrics(nextDimensions);

      runtime.shipX = clamp(
        runtime.shipX,
        ship.width / 2 + FIELD_PADDING,
        nextDimensions.width - ship.width / 2 - FIELD_PADDING
      );
      runtime.shipY = clamp(
        runtime.shipY,
        ship.height / 2 + FIELD_PADDING,
        nextDimensions.height - ship.height / 2 - FIELD_PADDING
      );

      setSnapshot(createSnapshot(runtime, performance.now()));
    };

    syncDimensions();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncDimensions);

      return () => {
        window.removeEventListener("resize", syncDimensions);
      };
    }

    const resizeObserver = new ResizeObserver(syncDimensions);
    resizeObserver.observe(fieldElement);
    window.addEventListener("resize", syncDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncDimensions);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = getDirectionFromKey(event.key);

      if (!direction) {
        return;
      }

      event.preventDefault();
      setDirectionPressed(direction, true);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const direction = getDirectionFromKey(event.key);

      if (!direction) {
        return;
      }

      event.preventDefault();
      setDirectionPressed(direction, false);
    };

    const handleWindowBlur = () => {
      if (runtimeRef.current.status === "running") {
        pauseGame();
        return;
      }

      clearInput();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && runtimeRef.current.status === "running") {
        pauseGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clearInput, pauseGame, setDirectionPressed]);

  useEffect(() => stopLoop, [stopLoop]);

  const ship = getShipMetrics(dimensions);
  const nextLevelAt = getNextLevelAt(snapshot.level);
  const levelProgress =
    snapshot.level >= MAX_LEVEL
      ? 100
      : ((snapshot.elapsedMs % LEVEL_MILESTONE_MS) / LEVEL_MILESTONE_MS) * 100;
  const shipVisible =
    snapshot.invulnerableRemainingMs <= 0 ||
    Math.floor(snapshot.invulnerableRemainingMs / 100) % 2 === 0;

  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl border border-glass-border/60 p-4 shadow-[0_18px_60px_oklch(0.1_0.04_275_/_0.16)] sm:p-5">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 via-nebula-2/5 to-transparent" />

      <div className="relative space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-2xl bg-primary/12 p-2 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Spaceship Survival
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dodge the asteroid storm and stay alive long enough to rank up.
                </p>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Move with arrows or WASD, or hold the touch pad. Survive 15 seconds
              per level, use your 3 lives wisely, and exploit the short shield
              pulse after a hit.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(snapshot.status === "ready" || snapshot.status === "over") && (
              <Button onClick={startGame}>
                <Play className="h-4 w-4" />
                {snapshot.status === "over" ? "Play Again" : "Start Game"}
              </Button>
            )}

            {snapshot.status === "running" && (
              <>
                <Button variant="secondary" onClick={pauseGame}>
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
                <Button variant="outline" onClick={startGame}>
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </Button>
              </>
            )}

            {snapshot.status === "paused" && (
              <>
                <Button variant="secondary" onClick={resumeGame}>
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
                <Button variant="outline" onClick={startGame}>
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border/70 bg-background/65 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-[0.18em]">
                Survival
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatSeconds(snapshot.elapsedMs)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/65 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-[0.18em]">
                Best
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {formatSeconds(displayedBestStats.bestScoreMs)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/65 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-[0.18em]">
                Lives & Status
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {snapshot.lives} / {STARTING_LIVES}
            </p>
            <p className="text-sm text-muted-foreground">
              {STATUS_LABELS[snapshot.status]}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/65 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-[0.18em]">
                Level
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {snapshot.level}
            </p>
            <p className="text-sm text-muted-foreground">
              Best level {displayedBestStats.bestLevel}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/40 p-3 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.08)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Current level: {snapshot.level}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextLevelAt === null
                  ? "Difficulty capped: you've reached the final level."
                  : `Next level at ${formatSeconds(nextLevelAt)}.`}
              </p>
            </div>

            <div className="min-w-44 flex-1 sm:max-w-xs">
              <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>Level progress</span>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-nebula-2 to-accent transition-[width]"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div
            ref={fieldRef}
            className="relative aspect-[16/10] w-full min-h-[18rem] overflow-hidden rounded-[calc(var(--radius-3xl)-2px)] border border-border/70 bg-background"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background/90" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-nebula-2/15 via-primary/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-primary/10 via-accent/5 to-transparent" />
            <div className="absolute left-[10%] top-[8%] h-24 w-24 rounded-full bg-nebula-2/10 blur-3xl" />
            <div className="absolute bottom-[10%] right-[14%] h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

            {STAR_POINTS.map((star) => (
              <span
                key={star.id}
                className="absolute rounded-full bg-primary"
                style={{
                  left: star.left,
                  top: star.top,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                }}
              />
            ))}

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/25 to-transparent" />

            {snapshot.asteroids.map((asteroid) => (
              <div
                key={asteroid.id}
                className={
                  asteroid.variant === 0
                    ? "absolute text-foreground/40"
                    : asteroid.variant === 1
                      ? "absolute text-primary/35"
                      : "absolute text-accent/35"
                }
                style={{
                  left: `${asteroid.x - asteroid.size / 2}px`,
                  top: `${asteroid.y - asteroid.size / 2}px`,
                  width: `${asteroid.size}px`,
                  height: `${asteroid.size}px`,
                  transform: `rotate(${asteroid.rotation}deg)`,
                }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                  <path d="M52 6 74 15 94 38 88 63 74 85 47 94 19 82 6 55 15 27 32 10Z" />
                  <path
                    d="M36 28 52 24 66 34 62 52 46 59 31 48Z"
                    fill="var(--background)"
                    opacity="0.35"
                  />
                </svg>
              </div>
            ))}

            <div
              className="absolute transition-opacity"
              style={{
                left: `${snapshot.shipX - ship.width / 2}px`,
                top: `${snapshot.shipY - ship.height / 2}px`,
                width: `${ship.width}px`,
                height: `${ship.height}px`,
                opacity: shipVisible ? 1 : 0.35,
                filter:
                  snapshot.invulnerableRemainingMs > 0
                    ? "drop-shadow(0 0 18px var(--accent))"
                    : "drop-shadow(0 0 16px var(--primary))",
              }}
            >
              <svg viewBox="0 0 100 72" className="h-full w-full">
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="55%" stopColor="var(--nebula-2)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
                <path
                  d="M50 4 67 24 61 28 74 46 55 43 52 67 48 67 45 43 26 46 39 28 33 24Z"
                  fill={`url(#${gradientId})`}
                  stroke="var(--foreground)"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M42 56 50 48 58 56 55 68 45 68Z"
                  fill="var(--accent)"
                  opacity="0.92"
                />
                <circle cx="50" cy="27" r="8" fill="var(--background)" opacity="0.9" />
                <path
                  d="M48 12 52 12 56 22 50 30 44 22Z"
                  fill="var(--primary-foreground)"
                  opacity="0.28"
                />
              </svg>
            </div>

            {snapshot.status !== "running" && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/65 backdrop-blur-sm">
                <div className="max-w-xs rounded-3xl border border-border/70 bg-card/88 p-5 text-center shadow-lg">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                    {STATUS_LABELS[snapshot.status]}
                  </p>
                  <h4 className="mt-2 text-xl font-semibold text-foreground">
                    {snapshot.status === "ready"
                      ? "Launch when ready"
                      : snapshot.status === "paused"
                        ? "Game paused"
                        : "Hull breached"}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {snapshot.status === "over"
                      ? `You survived ${formatSeconds(snapshot.elapsedMs)} and reached level ${snapshot.level}.`
                      : "Asteroids keep accelerating every 15 seconds, so stay moving."}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="font-medium text-foreground">
                {STATUS_LABELS[snapshot.status]}
              </span>
              {snapshot.invulnerableRemainingMs > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span className="text-accent">Shielded</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Touch controls</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Hold a direction to strafe. Keyboard and touch controls work together,
              so you can swap inputs anytime.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 self-start">
            <div />
            <ControlPadButton
              direction="up"
              label="Move up"
              icon={<ChevronUp className="h-5 w-5" />}
              active={inputState.up}
              onPressChange={setDirectionPressed}
            />
            <div />

            <ControlPadButton
              direction="left"
              label="Move left"
              icon={<ChevronLeft className="h-5 w-5" />}
              active={inputState.left}
              onPressChange={setDirectionPressed}
            />
            <ControlPadButton
              direction="down"
              label="Move down"
              icon={<ChevronDown className="h-5 w-5" />}
              active={inputState.down}
              onPressChange={setDirectionPressed}
            />
            <ControlPadButton
              direction="right"
              label="Move right"
              icon={<ChevronRight className="h-5 w-5" />}
              active={inputState.right}
              onPressChange={setDirectionPressed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
