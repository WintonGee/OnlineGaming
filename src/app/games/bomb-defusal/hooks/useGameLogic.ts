/**
 * Standardized game logic hook export
 * Re-exports useBombGame to comply with architecture naming convention
 * Note: This game combines state and logic in a single hook
 */
export * from "./useBombGame";
export { useBombGame as useGameLogic } from "./useBombGame";
