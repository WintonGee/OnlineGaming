"use client";

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleButtonGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Reusable toggle button group for selecting between options
 * Used for difficulty selection, game mode selection, etc.
 *
 * @example
 * ```tsx
 * <ToggleButtonGroup
 *   options={[
 *     { value: "easy", label: "Easy" },
 *     { value: "medium", label: "Medium" },
 *     { value: "hard", label: "Hard" },
 *   ]}
 *   value={difficulty}
 *   onChange={handleDifficultyChange}
 * />
 * ```
 */
export default function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  className = "",
}: ToggleButtonGroupProps<T>) {
  return (
    <div
      className={`inline-flex rounded-full border-2 border-gray-300 dark:border-gray-600 p-0.5 bg-gray-100 dark:bg-gray-800 ${className}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
            value === option.value
              ? "bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
