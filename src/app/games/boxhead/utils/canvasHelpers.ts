import { Vector2D, BoundingBox } from "../types";
import { COLORS } from "../constants";

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);
}

export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(x - width / 2, y - height / 2, width, height);
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: Vector2D,
  to: Vector2D,
  color: string,
  width: number = 2
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

export function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  health: number,
  maxHealth: number
): void {
  const healthPercent = health / maxHealth;

  // Background
  ctx.fillStyle = COLORS.healthBg;
  ctx.fillRect(x - width / 2, y, width, height);

  // Health fill
  ctx.fillStyle = healthPercent > 0.3 ? COLORS.health : "#FF0000";
  ctx.fillRect(x - width / 2, y, width * healthPercent, height);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width / 2, y, width, height);
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize: number = 16,
  align: CanvasTextAlign = "center"
): void {
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

export function drawDirectionIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  directionX: number,
  directionY: number,
  color: string
): void {
  const indicatorDistance = size / 3;
  const indicatorSize = 4;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(
    x + directionX * indicatorDistance,
    y + directionY * indicatorDistance,
    indicatorSize,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number // 0 to 1
): void {
  const alpha = 1 - progress;
  const currentRadius = radius * (0.5 + progress * 0.5);

  // Outer glow
  ctx.fillStyle = `rgba(255, 136, 0, ${alpha * 0.3})`;
  ctx.beginPath();
  ctx.arc(x, y, currentRadius * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Main explosion
  ctx.fillStyle = `rgba(255, 200, 0, ${alpha * 0.7})`;
  ctx.beginPath();
  ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
  ctx.fill();

  // Core
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.beginPath();
  ctx.arc(x, y, currentRadius * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBoundingBox(
  ctx: CanvasRenderingContext2D,
  box: BoundingBox,
  color: string
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(box.x, box.y, box.width, box.height);
}

export function getBoundingBox(
  position: Vector2D,
  size: number
): BoundingBox {
  return {
    x: position.x - size / 2,
    y: position.y - size / 2,
    width: size,
    height: size,
  };
}

export function checkAABBCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function checkCircleCollision(
  center: Vector2D,
  radius: number,
  box: BoundingBox
): boolean {
  const closestX = Math.max(box.x, Math.min(center.x, box.x + box.width));
  const closestY = Math.max(box.y, Math.min(center.y, box.y + box.height));
  const dx = center.x - closestX;
  const dy = center.y - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

export function isPointInBounds(
  point: Vector2D,
  width: number,
  height: number,
  margin: number = 0
): boolean {
  return (
    point.x >= margin &&
    point.x <= width - margin &&
    point.y >= margin &&
    point.y <= height - margin
  );
}
