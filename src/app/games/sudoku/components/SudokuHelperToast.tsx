"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HelperActionResult } from "../types";

const STATUS_CONFIG = {
  success: {
    title: "Great job!",
    icon: CheckCircle2,
    accent:
      "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
  },
  info: {
    title: "FYI",
    icon: Info,
    accent:
      "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100",
  },
  warning: {
    title: "Heads up",
    icon: AlertTriangle,
    accent:
      "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100",
  },
  error: {
    title: "Check again",
    icon: XCircle,
    accent: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-100",
  },
} as const;

interface SudokuHelperToastProps {
  result: HelperActionResult | null;
  open: boolean;
  onClose: () => void;
  duration?: number;
}

export default function SudokuHelperToast({
  result,
  open,
  onClose,
  duration = 3500,
}: SudokuHelperToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, duration, onClose, result]);

  if (!mounted || !result || !open) {
    return null;
  }

  const config = STATUS_CONFIG[result.status];
  const Icon = config.icon;

  return createPortal(
    <div className="fixed inset-x-4 bottom-4 z-[60] flex w-full justify-end sm:inset-auto sm:bottom-6 sm:w-auto sm:right-6">
      <div className="flex w-full max-w-sm items-start gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 pr-5 text-left shadow-2xl ring-1 ring-black/5 transition dark:border-gray-700 dark:bg-gray-900/95">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            config.accent
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-black dark:text-white">
            {config.title}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {result.message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          aria-label="Dismiss helper message"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}

