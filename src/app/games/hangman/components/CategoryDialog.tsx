"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WORD_CATEGORIES } from "../data/categories";
import { createSessionStorage } from "../utils/storage";
import { CATEGORY_CACHE_KEY } from "../constants";

const categoryCache = createSessionStorage<string[]>(CATEGORY_CACHE_KEY);

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCategories: (categoryNames: string[]) => void;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  onSelectCategories,
}: CategoryDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );

  // Load cached categories when dialog opens
  useEffect(() => {
    if (open) {
      const cached = categoryCache.load();
      if (cached && cached.length > 0) {
        setSelectedCategories(new Set(cached));
      } else {
        setSelectedCategories(new Set());
      }
    }
  }, [open]);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedCategories.size === WORD_CATEGORIES.length) {
      // Deselect all
      setSelectedCategories(new Set());
    } else {
      // Select all
      setSelectedCategories(new Set(WORD_CATEGORIES.map((cat) => cat.name)));
    }
  };

  const handleStartGame = () => {
    const categoriesArray = Array.from(selectedCategories);
    categoryCache.save(categoriesArray);
    onSelectCategories(categoriesArray);
    onOpenChange(false);
  };

  const allSelected = selectedCategories.size === WORD_CATEGORIES.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Categories</DialogTitle>
          <DialogDescription>
            Select one or more categories to start a new game. Words will be
            randomly selected from your chosen categories. Leave all unchecked to use all categories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Select All Option */}
          <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
            />
            <label
              htmlFor="select-all"
              className="text-lg font-semibold cursor-pointer flex-1"
            >
              All Categories
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCategories.size} of {WORD_CATEGORIES.length} selected
            </span>
          </div>

          {/* Category List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WORD_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.has(category.name);
              return (
                <div
                  key={category.name}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-black dark:border-white bg-gray-100 dark:bg-gray-800"
                      : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                  onClick={() => toggleCategory(category.name)}
                >
                  <Checkbox
                    id={category.name}
                    checked={isSelected}
                    onCheckedChange={() => toggleCategory(category.name)}
                    className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
                  />
                  <label
                    htmlFor={category.name}
                    className="text-base font-medium cursor-pointer flex-1"
                  >
                    {category.name}
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.words.length}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Start Game Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleStartGame}
              className="min-w-[120px]"
            >
              Start Game
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
