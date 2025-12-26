/**
 * Storage utilities for Reaction Timer game
 */

import { createStorage } from "@/lib/utils/storage";
import { SavedBestTime } from "../types";
import { BEST_TIME_KEY } from "../constants";

export const bestTimeStorage = createStorage<SavedBestTime>(BEST_TIME_KEY);
