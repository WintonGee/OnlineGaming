"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WORD_CATEGORIES } from "../data/categories";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  currentCategory,
  onSelectCategory,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose a Category</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {WORD_CATEGORIES.map((category) => (
            <button
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium
                transition-colors
                ${
                  currentCategory === category.name
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {category.displayName}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
