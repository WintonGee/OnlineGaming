"use client";

import { useState, useCallback } from "react";

export function useDialogState() {
  const [showInstructions, setShowInstructions] = useState(false);

  const openInstructions = useCallback(() => {
    setShowInstructions(true);
  }, []);

  const closeInstructions = useCallback(() => {
    setShowInstructions(false);
  }, []);

  return {
    showInstructions,
    openInstructions,
    closeInstructions,
  };
}
