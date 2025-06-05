export interface UserMetrics {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'maintenance';
}

export interface NutritionPlan {
  targetCalories: number;
  bmr: number;
  tdee: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  water: number; // ml
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR(age: number, height: number, weight: number, gender: 'male' | 'female' = 'male'): number {
  const baseCalc = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseCalc + 5 : baseCalc - 161;
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: UserMetrics['activityLevel']): number {
  const multipliers = {
    'sedentary': 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
    'extremely-active': 1.9
  };
  
  return bmr * multipliers[activityLevel];
}

/**
 * Adjust calories based on fitness goal
 */
export function adjustCaloriesForGoal(tdee: number, goal: UserMetrics['fitnessGoal']): number {
  switch (goal) {
    case 'weight-loss':
      return tdee - 500; // 500 calorie deficit for ~1lb/week loss
    case 'muscle-gain':
      return tdee + 300; // 300 calorie surplus for lean gains
    case 'maintenance':
    default:
      return tdee;
  }
}

/**
 * Calculate macronutrient distribution
 */
export function calculateMacros(targetCalories: number, goal: UserMetrics['fitnessGoal']) {
  let proteinRatio = 0.3;
  let carbRatio = 0.4;
  let fatRatio = 0.3;

  // Adjust ratios based on goal
  if (goal === 'muscle-gain') {
    proteinRatio = 0.35;
    carbRatio = 0.4;
    fatRatio = 0.25;
  } else if (goal === 'weight-loss') {
    proteinRatio = 0.35;
    carbRatio = 0.35;
    fatRatio = 0.3;
  }

  return {
    protein: Math.round((targetCalories * proteinRatio) / 4), // 4 cal per gram
    carbs: Math.round((targetCalories * carbRatio) / 4), // 4 cal per gram
    fat: Math.round((targetCalories * fatRatio) / 9), // 9 cal per gram
  };
}

/**
 * Calculate daily water intake recommendation
 */
export function calculateWaterIntake(weight: number, activityLevel: UserMetrics['activityLevel']): number {
  const baseWater = weight * 35; // 35ml per kg body weight
  
  const activityMultipliers = {
    'sedentary': 1.0,
    'lightly-active': 1.1,
    'moderately-active': 1.2,
    'very-active': 1.3,
    'extremely-active': 1.4
  };
  
  return Math.round(baseWater * activityMultipliers[activityLevel]);
}

/**
 * Generate complete nutrition plan
 */
export function generateNutritionPlan(metrics: UserMetrics): NutritionPlan {
  const bmr = calculateBMR(metrics.age, metrics.height, metrics.weight, metrics.gender);
  const tdee = calculateTDEE(bmr, metrics.activityLevel);
  const targetCalories = adjustCaloriesForGoal(tdee, metrics.fitnessGoal);
  const macros = calculateMacros(targetCalories, metrics.fitnessGoal);
  const water = calculateWaterIntake(metrics.weight, metrics.activityLevel);

  return {
    targetCalories: Math.round(targetCalories),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    water,
  };
}
