import { createStorage } from "@/lib/utils/storage";
import { BestScores } from "../types";
import { BEST_SCORES_KEY } from "../constants";

export const bestScoresStorage = createStorage<BestScores>(BEST_SCORES_KEY);
