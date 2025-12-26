/**
 * Storage utilities for Rock Paper Scissors
 */

import { createStorage } from "@/lib/utils/storage";
import { SavedStats } from "../types";
import { STATS_STORAGE_KEY } from "../constants";

/**
 * Storage for game statistics
 */
export const statsStorage = createStorage<SavedStats>(STATS_STORAGE_KEY);
