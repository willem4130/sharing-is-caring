/**
 * Matching Algorithm Weights Configuration
 * Total: 100 points
 */

export const MATCHING_WEIGHTS = {
  sleepSchedule: 20,
  cleanlinessLevel: 15,
  smokingTolerance: 12,
  drinkingTolerance: 10,
  socialLevel: 10,
  budgetCompatibility: 15,
  interests: 8,
  languages: 5,
  verificationLevel: 3,
  genderPreference: 2,
} as const;

export const SCORE_THRESHOLDS = {
  excellent: 85,
  good: 70,
  moderate: 55,
  minimum: 40,
} as const;

export type MatchingWeights = typeof MATCHING_WEIGHTS;
export type ScoreThresholds = typeof SCORE_THRESHOLDS;
