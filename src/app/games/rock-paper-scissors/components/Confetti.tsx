"use client";

import { useEffect, useState, useRef } from "react";
import "../styles.css";

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  color: string;
  size: number;
  type: "circle" | "square" | "triangle";
}

const COLORS = [
  "#10B981", // green
  "#3B82F6", // blue
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#06B6D4", // cyan
];

const PIECE_COUNT = 50;
const CONFETTI_DURATION = 3000;

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 8 + 6,
    type: (["circle", "square", "triangle"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated with latest callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!show) {
      setPieces([]);
      return;
    }

    // Generate new pieces when show becomes true
    setPieces(generatePieces());

    // Clear confetti after animation
    const timer = setTimeout(() => {
      setPieces([]);
      onCompleteRef.current?.();
    }, CONFETTI_DURATION);

    return () => clearTimeout(timer);
  }, [show]);

  if (pieces.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
      aria-hidden="true"
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            backgroundColor:
              piece.type !== "triangle" ? piece.color : "transparent",
            width: piece.size,
            height: piece.size,
            borderRadius: piece.type === "circle" ? "50%" : "0",
            ...(piece.type === "triangle" && {
              width: 0,
              height: 0,
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
              backgroundColor: "transparent",
            }),
          }}
        />
      ))}
    </div>
  );
}
