import { createStorage } from "@/lib/utils/storage";
import { SavedGameState } from "../types";
import { GAME_STATE_KEY } from "../constants";

// Create type-safe storage for game state
export const gameStateStorage = createStorage<SavedGameState>(GAME_STATE_KEY);
