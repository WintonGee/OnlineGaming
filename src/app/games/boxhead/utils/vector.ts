import { Vector2D, Direction } from "../types";
import { DIRECTION_VECTORS, DIRECTION_ANGLES } from "../constants";

export function add(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(v: Vector2D, s: number): Vector2D {
  return { x: v.x * s, y: v.y * s };
}

export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function distance(a: Vector2D, b: Vector2D): number {
  return magnitude(subtract(a, b));
}

export function dot(a: Vector2D, b: Vector2D): number {
  return a.x * b.x + a.y * b.y;
}

export function perpendicular(v: Vector2D): Vector2D {
  return { x: -v.y, y: v.x };
}

export function rotate(v: Vector2D, angleDegrees: number): Vector2D {
  const rad = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  };
}

export function angleToVector(angleDegrees: number): Vector2D {
  const rad = (angleDegrees * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

export function vectorToAngle(v: Vector2D): number {
  return (Math.atan2(v.y, v.x) * 180) / Math.PI;
}

export function directionToVector(direction: Direction): Vector2D {
  return DIRECTION_VECTORS[direction];
}

export function directionToAngle(direction: Direction): number {
  return DIRECTION_ANGLES[direction];
}

export function vectorToDirection(v: Vector2D): Direction {
  if (v.x === 0 && v.y === 0) return "down";

  const angle = vectorToAngle(v);
  const normalizedAngle = ((angle % 360) + 360) % 360;

  if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return "right";
  if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return "down-right";
  if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return "down";
  if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return "down-left";
  if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return "left";
  if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return "up-left";
  if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return "up";
  return "up-right";
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
