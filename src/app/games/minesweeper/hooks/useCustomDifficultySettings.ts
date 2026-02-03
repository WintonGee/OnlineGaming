import { useState, useEffect, useCallback } from 'react';
import { CustomSettings } from '../types';
import { validateCustomSettings } from '../logic/gameValidation';

interface UseCustomDifficultySettingsProps {
  currentCustomSettings?: CustomSettings;
  isOpen: boolean;
}

export function useCustomDifficultySettings({
  currentCustomSettings,
  isOpen,
}: UseCustomDifficultySettingsProps) {
  const [customWidth, setCustomWidth] = useState(
    currentCustomSettings?.width.toString() || '16'
  );
  const [customHeight, setCustomHeight] = useState(
    currentCustomSettings?.height.toString() || '16'
  );
  const [customMines, setCustomMines] = useState(
    currentCustomSettings?.mines.toString() || '40'
  );
  const [customError, setCustomError] = useState<string>('');

  // Update form values when dialog opens or custom settings change
  useEffect(() => {
    if (isOpen) {
      setCustomWidth(currentCustomSettings?.width.toString() || '16');
      setCustomHeight(currentCustomSettings?.height.toString() || '16');
      setCustomMines(currentCustomSettings?.mines.toString() || '40');
      setCustomError('');
    }
  }, [isOpen, currentCustomSettings]);

  const validateAndGetSettings = useCallback((): {
    valid: boolean;
    settings?: CustomSettings;
    error?: string;
  } => {
    const width = parseInt(customWidth);
    const height = parseInt(customHeight);
    const mines = parseInt(customMines);

    const validation = validateCustomSettings(width, height, mines);
    if (!validation.valid) {
      setCustomError(validation.error || 'Invalid settings');
      return { valid: false, error: validation.error };
    }

    return {
      valid: true,
      settings: { width, height, mines },
    };
  }, [customWidth, customHeight, customMines]);

  return {
    customWidth,
    customHeight,
    customMines,
    customError,
    setCustomWidth,
    setCustomHeight,
    setCustomMines,
    setCustomError,
    validateAndGetSettings,
  };
}
