"use client";

import { useState, useCallback } from "react";

/**
 * Basic dialog state management hook
 * Provides simple open/close state for a single dialog
 *
 * @param initialState - Initial open state (default: false)
 * @returns Object with isOpen state and control functions
 *
 * @example
 * ```tsx
 * const dialog = useDialogState();
 *
 * <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
 *   <DialogTrigger onClick={dialog.open}>Open</DialogTrigger>
 *   <DialogContent>
 *     <button onClick={dialog.close}>Close</button>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export function useDialogState(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  };
}
