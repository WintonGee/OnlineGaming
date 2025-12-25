"use client";

import { useState, useCallback, DragEvent } from "react";
import { Card, CardLocation, DraggedCards } from "../types";

export function useDragDrop() {
  const [draggedCards, setDraggedCards] = useState<DraggedCards | null>(null);
  const [dragOverPile, setDragOverPile] = useState<CardLocation | null>(null);

  const handleDragStart = useCallback(
    (cards: Card[], source: CardLocation) => (e: DragEvent) => {
      // Set drag data for compatibility
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify({ cards, source }));

      // Store in state for immediate access
      setDraggedCards({ cards, source });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDraggedCards(null);
    setDragOverPile(null);
  }, []);

  const handleDragOver = useCallback(
    (location: CardLocation) => (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverPile(location);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOverPile(null);
  }, []);

  const handleDrop = useCallback(
    (
      destLocation: CardLocation,
      onMove: (source: CardLocation, dest: CardLocation, cardCount: number) => boolean
    ) =>
    (e: DragEvent) => {
      e.preventDefault();
      setDragOverPile(null);

      if (!draggedCards) return;

      const { cards, source } = draggedCards;
      onMove(source, destLocation, cards.length);
      setDraggedCards(null);
    },
    [draggedCards]
  );

  return {
    draggedCards,
    dragOverPile,
    isDragging: draggedCards !== null,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
