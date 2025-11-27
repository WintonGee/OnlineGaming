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

/**
 * Multi-dialog state management hook
 * Manages multiple dialogs using a Set-based approach
 *
 * @param dialogs - Array of dialog identifiers
 * @returns Object with isOpen checker and control functions
 *
 * @example
 * ```tsx
 * const DIALOGS = ['instructions', 'settings', 'win'] as const;
 * const dialogs = useMultiDialogState(DIALOGS);
 *
 * <Dialog open={dialogs.isOpen('instructions')}>
 *   <DialogTrigger onClick={() => dialogs.open('instructions')}>
 *     Instructions
 *   </DialogTrigger>
 * </Dialog>
 * ```
 */
export function useMultiDialogState<T extends string>(dialogs?: readonly T[]) {
  const [openDialogs, setOpenDialogs] = useState<Set<T>>(new Set());

  const open = useCallback((dialog: T) => {
    setOpenDialogs((prev) => {
      const next = new Set(prev);
      next.add(dialog);
      return next;
    });
  }, []);

  const close = useCallback((dialog: T) => {
    setOpenDialogs((prev) => {
      const next = new Set(prev);
      next.delete(dialog);
      return next;
    });
  }, []);

  const toggle = useCallback((dialog: T) => {
    setOpenDialogs((prev) => {
      const next = new Set(prev);
      if (next.has(dialog)) {
        next.delete(dialog);
      } else {
        next.add(dialog);
      }
      return next;
    });
  }, []);

  const isOpen = useCallback(
    (dialog: T) => openDialogs.has(dialog),
    [openDialogs]
  );

  const closeAll = useCallback(() => {
    setOpenDialogs(new Set());
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    closeAll,
  };
}

