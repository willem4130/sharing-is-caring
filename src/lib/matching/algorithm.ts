import type { UserProfile, VerificationLevel, SleepSchedule, Gender, GenderPreference } from '@prisma/client';
import { MATCHING_WEIGHTS } from './weights';

export interface ScoreBreakdown {
  sleepSchedule: number;
  cleanlinessLevel: number;
  smokingTolerance: number;
  drinkingTolerance: number;
  socialLevel: number;
  budgetCompatibility: number;
  interests: number;
  languages: number;
  verificationLevel: number;
  genderPreference: number;
}

/**
 * Calculate compatibility score breakdown between two user profiles
 */
export function calculateScoreBreakdown(
  userA: UserProfile,
  userB: UserProfile
): ScoreBreakdown {
  return {
    sleepSchedule: calculateSleepScore(userA.sleepSchedule, userB.sleepSchedule),
    cleanlinessLevel: calculateLevelScore(
      userA.cleanlinessLevel,
      userB.cleanlinessLevel,
      MATCHING_WEIGHTS.cleanlinessLevel
    ),
    smokingTolerance: calculateLevelScore(
      userA.smokingTolerance,
      userB.smokingTolerance,
      MATCHING_WEIGHTS.smokingTolerance
    ),
    drinkingTolerance: calculateLevelScore(
      userA.drinkingTolerance,
      userB.drinkingTolerance,
      MATCHING_WEIGHTS.drinkingTolerance
    ),
    socialLevel: calculateLevelScore(
      userA.socialLevel,
      userB.socialLevel,
      MATCHING_WEIGHTS.socialLevel
    ),
    budgetCompatibility: calculateBudgetScore(
      userA.budgetMin ? Number(userA.budgetMin) : null,
      userA.budgetMax ? Number(userA.budgetMax) : null,
      userB.budgetMin ? Number(userB.budgetMin) : null,
      userB.budgetMax ? Number(userB.budgetMax) : null
    ),
    interests: calculateInterestsScore(userA.interests, userB.interests),
    languages: calculateLanguagesScore(userA.languages, userB.languages),
    verificationLevel: calculateVerificationScore(
      userA.verificationLevel,
      userB.verificationLevel
    ),
    genderPreference: calculateGenderPreferenceScore(
      userA.gender,
      userA.genderPreference,
      userB.gender,
      userB.genderPreference
    ),
  };
}

/**
 * Calculate total score from breakdown
 */
export function calculateTotalScore(breakdown: ScoreBreakdown): number {
  return Object.values(breakdown).reduce((a, b) => a + b, 0);
}

/**
 * Sleep schedule scoring
 * Same = 100%, Adjacent = 60%, Opposite = 20%
 */
function calculateSleepScore(scheduleA: SleepSchedule, scheduleB: SleepSchedule): number {
  const weight = MATCHING_WEIGHTS.sleepSchedule;

  if (scheduleA === 'FLEXIBLE' || scheduleB === 'FLEXIBLE') {
    return weight * 0.9;
  }

  if (scheduleA === scheduleB) {
    return weight;
  }

  const scheduleOrder = ['EARLY_BIRD', 'MODERATE', 'NIGHT_OWL'];
  const indexA = scheduleOrder.indexOf(scheduleA);
  const indexB = scheduleOrder.indexOf(scheduleB);
  const distance = Math.abs(indexA - indexB);

  if (distance === 1) {
    return weight * 0.6;
  }

  return weight * 0.2;
}

/**
 * Level-based scoring (1-5 scale)
 */
function calculateLevelScore(levelA: number, levelB: number, maxWeight: number): number {
  const difference = Math.abs(levelA - levelB);
  const percentage = 1 - difference * 0.2;
  return maxWeight * Math.max(percentage, 0);
}

/**
 * Budget overlap scoring
 */
function calculateBudgetScore(
  minA: number | null,
  maxA: number | null,
  minB: number | null,
  maxB: number | null
): number {
  const weight = MATCHING_WEIGHTS.budgetCompatibility;

  if (!minA || !maxA || !minB || !maxB) {
    return weight * 0.8;
  }

  const overlapStart = Math.max(minA, minB);
  const overlapEnd = Math.min(maxA, maxB);

  if (overlapStart > overlapEnd) {
    const gap = overlapStart - overlapEnd;
    const tolerance = Math.min(maxA - minA, maxB - minB) * 0.3;

    if (gap <= tolerance) {
      return weight * 0.4;
    }
    return weight * 0.2;
  }

  const overlapRange = overlapEnd - overlapStart;
  const rangeA = maxA - minA;
  const rangeB = maxB - minB;
  const avgRange = (rangeA + rangeB) / 2;

  const overlapPercentage = avgRange > 0 ? Math.min(overlapRange / avgRange, 1) : 1;
  return weight * (0.4 + overlapPercentage * 0.6);
}

/**
 * Interests scoring using Jaccard similarity
 */
function calculateInterestsScore(interestsA: string[], interestsB: string[]): number {
  const weight = MATCHING_WEIGHTS.interests;

  if (!interestsA.length || !interestsB.length) {
    return weight * 0.5;
  }

  const setA = new Set(interestsA.map((i) => i.toLowerCase().trim()));
  const setB = new Set(interestsB.map((i) => i.toLowerCase().trim()));

  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;

  const similarity = union > 0 ? intersection / union : 0;
  return weight * similarity;
}

/**
 * Languages scoring
 */
function calculateLanguagesScore(languagesA: string[], languagesB: string[]): number {
  const weight = MATCHING_WEIGHTS.languages;

  if (!languagesA.length || !languagesB.length) {
    return weight * 0.5;
  }

  const setA = new Set(languagesA.map((l) => l.toLowerCase()));
  const setB = new Set(languagesB.map((l) => l.toLowerCase()));

  const commonLanguages = [...setA].filter((x) => setB.has(x)).length;

  if (commonLanguages === 0) {
    return 0;
  }

  return weight * Math.min(commonLanguages / 2, 1);
}

/**
 * Verification level bonus
 */
function calculateVerificationScore(
  levelA: VerificationLevel,
  levelB: VerificationLevel
): number {
  const weight = MATCHING_WEIGHTS.verificationLevel;

  const levelValues: Record<VerificationLevel, number> = {
    NONE: 0,
    EMAIL: 1,
    PHONE: 2,
    ID: 3,
    BACKGROUND: 4,
  };

  const avgLevel = (levelValues[levelA] + levelValues[levelB]) / 2;
  return weight * (avgLevel / 4);
}

/**
 * Gender preference scoring
 */
function calculateGenderPreferenceScore(
  genderA: Gender,
  prefA: GenderPreference,
  genderB: Gender,
  prefB: GenderPreference
): number {
  const weight = MATCHING_WEIGHTS.genderPreference;

  const aAllowsB = checkGenderAllowed(prefA, genderA, genderB);
  const bAllowsA = checkGenderAllowed(prefB, genderB, genderA);

  if (aAllowsB && bAllowsA) {
    return weight;
  } else if (aAllowsB || bAllowsA) {
    return weight * 0.5;
  }
  return 0;
}

function checkGenderAllowed(
  preference: GenderPreference,
  ownGender: Gender,
  otherGender: Gender
): boolean {
  switch (preference) {
    case 'ANY':
      return true;
    case 'SAME_GENDER':
      return ownGender === otherGender;
    case 'MALE_ONLY':
      return otherGender === 'MALE';
    case 'FEMALE_ONLY':
      return otherGender === 'FEMALE';
    case 'NON_BINARY_ONLY':
      return otherGender === 'NON_BINARY';
    default:
      return true;
  }
}
