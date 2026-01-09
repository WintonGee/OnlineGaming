"use client";

import { useRef, useEffect, useCallback } from "react";
import { GameState, Player, Enemy, Projectile, Placeable } from "../types";
import { Explosion } from "../logic/collision";
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  PLAYER_SIZE,
  ZOMBIE_SIZE,
  DEVIL_SIZE,
  PROJECTILE_SIZE,
  COLORS,
  EXPLOSION_DURATION,
} from "../constants";
import {
  clearCanvas,
  drawRect,
  drawCircle,
  drawHealthBar,
  drawText,
  drawDirectionIndicator,
  drawExplosion,
} from "../utils/canvasHelpers";
import { directionToVector } from "../utils/vector";

interface GameCanvasProps {
  gameState: GameState;
  explosions: Explosion[];
}

export default function GameCanvas({ gameState, explosions }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (!canvasRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const aspectRatio = MAP_WIDTH / MAP_HEIGHT;

      let width = container.clientWidth;
      let height = width / aspectRatio;

      if (height > container.clientHeight) {
        height = container.clientHeight;
        width = height * aspectRatio;
      }

      // Set internal resolution
      canvasRef.current.width = MAP_WIDTH;
      canvasRef.current.height = MAP_HEIGHT;

      // Set display size
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Render game
  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clear
    clearCanvas(ctx, MAP_WIDTH, MAP_HEIGHT);

    // Draw map obstacles
    for (const obstacle of gameState.map.obstacles) {
      ctx.fillStyle = COLORS.obstacle;
      ctx.fillRect(
        obstacle.bounds.x,
        obstacle.bounds.y,
        obstacle.bounds.width,
        obstacle.bounds.height
      );
    }

    // Draw placeables
    for (const placeable of gameState.placeables) {
      drawPlaceable(ctx, placeable);
    }

    // Draw enemies
    for (const enemy of gameState.enemies) {
      if (enemy.isAlive) {
        drawEnemy(ctx, enemy);
      }
    }

    // Draw players
    gameState.players.forEach((player) => {
      if (player.isAlive) {
        drawPlayer(ctx, player);
      }
    });

    // Draw projectiles
    for (const projectile of gameState.projectiles) {
      drawProjectile(ctx, projectile);
    }

    // Draw explosions
    const now = Date.now();
    for (const explosion of explosions) {
      const age = now - explosion.createdAt;
      const progress = Math.min(1, age / EXPLOSION_DURATION);
      drawExplosion(ctx, explosion.position.x, explosion.position.y, explosion.radius, progress);
    }

    // Draw wave announcement
    if (gameState.wave.betweenWaves && gameState.wave.currentWave > 0) {
      const timeLeft = Math.ceil((gameState.wave.betweenWaveTimer - now) / 1000);
      drawText(
        ctx,
        `Wave ${gameState.wave.currentWave} Complete!`,
        MAP_WIDTH / 2,
        MAP_HEIGHT / 2 - 20,
        "#FFFFFF",
        32
      );
      drawText(
        ctx,
        `Next wave in ${timeLeft}...`,
        MAP_WIDTH / 2,
        MAP_HEIGHT / 2 + 20,
        "#AAAAAA",
        20
      );
    } else if (gameState.wave.currentWave > 0) {
      drawText(
        ctx,
        `Wave ${gameState.wave.currentWave}`,
        MAP_WIDTH / 2,
        30,
        "#FFFFFF88",
        16
      );
    }

    // Draw pause overlay
    if (gameState.phase === "paused") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      drawText(ctx, "PAUSED", MAP_WIDTH / 2, MAP_HEIGHT / 2 - 20, "#FFFFFF", 48);
      drawText(
        ctx,
        "Press P to resume",
        MAP_WIDTH / 2,
        MAP_HEIGHT / 2 + 30,
        "#AAAAAA",
        20
      );
    }
  }, [gameState, explosions]);

  // Animation loop
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      render();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [render]);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[4/3] flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="border-2 border-gray-700 rounded-lg"
        tabIndex={0}
      />
    </div>
  );
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  const { x, y } = player.position;
  const color = player.id === 1 ? COLORS.player1 : COLORS.player2;

  // Body
  drawRect(ctx, x, y, PLAYER_SIZE, PLAYER_SIZE, color);

  // Direction indicator
  const dir = directionToVector(player.direction);
  drawDirectionIndicator(ctx, x, y, PLAYER_SIZE, dir.x, dir.y, "#FFFFFF");

  // Health bar
  drawHealthBar(ctx, x, y - PLAYER_SIZE / 2 - 12, 40, 6, player.health, player.maxHealth);

  // Player number
  drawText(ctx, `P${player.id}`, x, y - PLAYER_SIZE / 2 - 22, "#FFFFFF", 10);
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  const { x, y } = enemy.position;
  const size = enemy.type === "zombie" ? ZOMBIE_SIZE : DEVIL_SIZE;
  const color = enemy.type === "zombie" ? COLORS.zombie : COLORS.devil;

  // Body
  drawRect(ctx, x, y, size, size, color);

  // Health bar for devils
  if (enemy.type === "devil") {
    drawHealthBar(ctx, x, y - size / 2 - 8, 30, 4, enemy.health, enemy.maxHealth);
  }
}

function drawProjectile(ctx: CanvasRenderingContext2D, projectile: Projectile) {
  const { x, y } = projectile.position;
  const color = projectile.source === "devil" ? COLORS.fireball : COLORS.projectile;
  const size = projectile.source === "devil" ? 8 : PROJECTILE_SIZE;

  drawCircle(ctx, x, y, size / 2, color);
}

function drawPlaceable(ctx: CanvasRenderingContext2D, placeable: Placeable) {
  const { x, y } = placeable.position;

  switch (placeable.type) {
    case "barrel":
      drawRect(ctx, x, y, 24, 24, "#8B4513");
      drawText(ctx, "B", x, y, "#FFFFFF", 12);
      break;
    case "fakeWall":
      drawRect(ctx, x, y, 32, 32, "#666666");
      break;
    case "claymore":
      drawRect(ctx, x, y, 16, 16, "#FF6600");
      drawText(ctx, "M", x, y, "#FFFFFF", 10);
      break;
    case "chargePack":
      drawRect(ctx, x, y, 20, 20, "#00FF00");
      drawText(ctx, "C", x, y, "#000000", 10);
      break;
  }
}
