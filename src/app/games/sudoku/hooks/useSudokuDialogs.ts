"use client";

import { useState, useCallback } from "react";
import { useDialogState } from "@/hooks/useDialogState";
import { HelperActionResult } from "../types";
import { ConfirmationType } from "../components/ConfirmationDialog";

/**
 * Sudoku-specific dialog and helper state management hook
 * Manages instructions dialog, helper toast, and confirmation dialogs
 */
export function useSudokuDialogs() {
  // Instructions dialog
  const instructionsDialog = useDialogState();

  // Helper toast state
  const [helperResult, setHelperResult] = useState<HelperActionResult | null>(
    null
  );
  const [helperToastOpen, setHelperToastOpen] = useState(false);

  // Confirmation dialog state
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmationType | null>(
    null
  );

  // Run a helper action and display the result in the toast
  const runHelperAction = useCallback(
    (action: () => HelperActionResult | void) => {
      const result = action();
      if (result) {
        setHelperResult(result);
        setHelperToastOpen(true);
      }
    },
    []
  );

  // Close the helper toast
  const handleToastClose = useCallback(() => {
    setHelperToastOpen(false);
    setHelperResult(null);
  }, []);

  // Show confirmation dialog
  const showConfirmDialog = useCallback((type: ConfirmationType) => {
    setPendingConfirm(type);
  }, []);

  // Hide confirmation dialog
  const hideConfirmDialog = useCallback(() => {
    setPendingConfirm(null);
  }, []);

  // Show instructions dialog
  const showInstructionsDialog = useCallback(() => {
    instructionsDialog.open();
  }, [instructionsDialog]);

  return {
    // Helper toast
    helperResult,
    helperToastOpen,
    runHelperAction,
    handleToastClose,

    // Confirmation dialog
    pendingConfirm,
    showConfirmDialog,
    hideConfirmDialog,

    // Instructions dialog
    showInstructions: instructionsDialog.isOpen,
    showInstructionsDialog,
    setShowInstructions: instructionsDialog.setIsOpen,
  };
}
