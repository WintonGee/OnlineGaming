import { useCallback, useState } from "react";
import { ConfirmationType } from "../components/ConfirmationDialog";
import { HelperActionResult } from "../types";

/**
 * Dialog state management hook
 * Handles helper toasts, confirmation dialogs, and instructions dialog
 */
export function useDialogState() {
  const [helperResult, setHelperResult] = useState<HelperActionResult | null>(
    null
  );
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmationType | null>(
    null
  );
  const [helperToastOpen, setHelperToastOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const runHelperAction = useCallback((action: () => HelperActionResult) => {
    const result = action();
    setHelperResult(result);
    setHelperToastOpen(true);
  }, []);

  const handleToastClose = useCallback(() => {
    setHelperToastOpen(false);
    setHelperResult(null);
  }, []);

  const showConfirmDialog = useCallback((type: ConfirmationType) => {
    setPendingConfirm(type);
  }, []);

  const hideConfirmDialog = useCallback(() => {
    setPendingConfirm(null);
  }, []);

  const showInstructionsDialog = useCallback(() => {
    setShowInstructions(true);
  }, []);

  return {
    // Helper toast state
    helperResult,
    helperToastOpen,
    runHelperAction,
    handleToastClose,

    // Confirmation dialog state
    pendingConfirm,
    showConfirmDialog,
    hideConfirmDialog,

    // Instructions dialog state
    showInstructions,
    showInstructionsDialog,
    setShowInstructions,
  };
}
