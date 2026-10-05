/**
 * GYMKHANA FITNESS CALCULATOR UTILITIES
 * ==============================================================================
 * Deterministic, rule-based fitness calculations designed for transparency,
 * scientific accuracy (ISSN / ACSM / WHO standards), and viva-friendly explanation.
 *
 * All formulas use standard metric units:
 * - Weight: kilograms (kg)
 * - Height: centimeters (cm)
 * - Daily protein: grams (g/day)
 * - Water intake: liters (L/day)
 * - Energy: kilocalories (kcal/day)
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. VALIDATION HELPERS
// ------------------------------------------------------------------------------
export function validateNumber(value, min, max, fieldName) {
  if (value === '' || value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (num > max) {
    return `${fieldName} cannot exceed ${max}`;
  }
  return null;
}

// ------------------------------------------------------------------------------
// 2. PROTEIN CALCULATOR LOGIC
// ------------------------------------------------------------------------------
/**
 * Daily Protein Requirement Calculation
 *
 * Methodology:
 * Based on peer-reviewed sports nutrition consensus (International Society of
 * Sports Nutrition - ISSN, American College of Sports Medicine - ACSM, and
 * Morton et al. 2018 systematic review on dietary protein).
 *
 * Ranges per kg of total body weight:
 * - General Fitness / Maintenance: 1.0 - 1.4 g/kg (sedentary baseline 1.0 - 1.2 g/kg)
 * - Weight Loss (Fat Loss Deficit): 1.6 - 2.0 g/kg (higher to preserve lean mass in deficit)
 * - Muscle Gain (Hypertrophy): 1.6 - 2.2 g/kg (optimal for muscle protein synthesis)
 * - Strength Training / Heavy Lifting: 1.8 - 2.4 g/kg (enhanced recovery & heavy neuromuscular repair)
 *
 * Formula:
 * Recommended Daily Protein (g) = Body Weight (kg) × Target Rate (g/kg)
 */
export function calculateProtein({ weight, goal, activityLevel, gender, age }) {
  const w = parseFloat(weight);
  if (!w || w <= 0) return null;

  // Base range matrix [minRate, maxRate] in g/kg
  let minRate = 1.2;
  let maxRate = 1.6;
  let rationale = '';

  switch (goal) {
    case 'WEIGHT_LOSS':
      // Protein needs increase during caloric restriction to spare lean muscle mass
      if (activityLevel === 'VERY_ACTIVE' || activityLevel === 'MODERATE') {
        minRate = 1.8;
        maxRate = 2.2;
        rationale = 'During fat loss with high activity, elevated protein (1.8–2.2 g/kg) protects existing skeletal muscle from catabolism while in a caloric deficit.';
      } else {
        minRate = 1.5;
        maxRate = 1.9;
        rationale = 'During weight loss, a higher protein intake (1.5–1.9 g/kg) improves satiety, supports metabolic rate, and prevents muscle loss.';
      }
      break;

    case 'MUSCLE_GAIN':
      // Standard hypertrophy range (ISSN position stand: 1.6 - 2.2 g/kg)
      if (activityLevel === 'VERY_ACTIVE') {
        minRate = 1.8;
        maxRate = 2.2;
        rationale = 'To maximize Muscle Protein Synthesis (MPS) with high training frequency, clinical research recommends 1.8–2.2 g/kg of body weight daily.';
      } else {
        minRate = 1.6;
        maxRate = 2.0;
        rationale = 'For progressive resistance training and muscle hypertrophy, 1.6–2.0 g/kg provides optimal amino acid availability for repair and growth.';
      }
      break;

    case 'STRENGTH_TRAINING':
      // Heavy strength & power athletes
      minRate = 1.8;
      maxRate = 2.4;
      rationale = 'Heavy compound lifting and strength adaptation require 1.8–2.4 g/kg to support dense connective tissue repair and neuromuscular recovery.';
      break;

    case 'MAINTENANCE':
    default:
      if (activityLevel === 'VERY_ACTIVE') {
        minRate = 1.4;
        maxRate = 1.8;
        rationale = 'For active maintenance with frequent training, 1.4–1.8 g/kg replenishes glycogen-sparing proteins and prevents training fatigue.';
      } else if (activityLevel === 'MODERATE') {
        minRate = 1.2;
        maxRate = 1.6;
        rationale = 'For moderate recreational gym training, 1.2–1.6 g/kg comfortably exceeds basic RDA to maintain healthy lean mass and recovery.';
      } else {
        minRate = 1.0;
        maxRate = 1.4;
        rationale = 'For general health and daily well-being, 1.0–1.4 g/kg provides sufficient amino acids for vital organ function, immune support, and daily energy.';
      }
      break;
  }

  // Calculate grams
  const minGrams = Math.round(w * minRate);
  const maxGrams = Math.round(w * maxRate);

  // Suggested per-meal distribution (3 to 4 meals)
  const mealsCount = 4;
  const perMealMin = Math.round(minGrams / mealsCount);
  const perMealMax = Math.round(maxGrams / mealsCount);

  return {
    minGrams,
    maxGrams,
    minRate: minRate.toFixed(1),
    maxRate: maxRate.toFixed(1),
    weightKg: w,
    goal,
    activityLevel,
    rationale,
    mealTip: `Spread across 3 to 4 daily meals (~${perMealMin}–${perMealMax}g per meal) to maintain regular Muscle Protein Synthesis (MPS) triggers.`
  };
}

// ------------------------------------------------------------------------------
// 3. BMI CALCULATOR LOGIC
// ------------------------------------------------------------------------------
/**
 * Body Mass Index (BMI) Calculation
 *
 * Formula:
 * BMI = Weight (kg) / [Height (m)]²
 *
 * Standard WHO Categories for Adults:
 * - Underweight: < 18.5
 * - Normal weight: 18.5 – 24.9
 * - Overweight: 25.0 – 29.9
 * - Obese Class I/II/III: ≥ 30.0
 */
export function calculateBmi({ weight, height }) {
  const w = parseFloat(weight);
  const h = parseFloat(height);

  if (!w || !h || w <= 0 || h <= 0) return null;

  const heightInMeters = h / 100;
  const bmiRaw = w / (heightInMeters * heightInMeters);
  const bmi = parseFloat(bmiRaw.toFixed(1));

  let category = '';
  let color = '';
  let statusBadge = '';
  let explanation = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'var(--color-info)';
    statusBadge = 'info';
    explanation = 'Your BMI indicates body mass below the standard statistical threshold. Consider a structured strength plan and a caloric surplus focused on quality protein.';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    category = 'Normal Weight';
    color = 'var(--accent-primary)';
    statusBadge = 'success';
    explanation = 'Your BMI is within the healthy reference range. Continue balanced resistance workouts and nutrient-dense hydration to maintain vitality.';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    category = 'Overweight';
    color = 'var(--color-warning)';
    statusBadge = 'warning';
    explanation = 'Your BMI is slightly above standard reference. Note: If you do regular weight training, elevated muscle mass can naturally increase BMI.';
  } else {
    category = 'Obesity Category';
    color = 'var(--color-error)';
    statusBadge = 'error';
    explanation = 'Your BMI falls within the elevated category. A sustainable caloric balance combined with low-impact cardio and coached gym sessions is recommended.';
  }

  // Calculate healthy weight bounds for this height (18.5 to 24.9)
  const minHealthyWeight = (18.5 * (heightInMeters * heightInMeters)).toFixed(1);
  const maxHealthyWeight = (24.9 * (heightInMeters * heightInMeters)).toFixed(1);

  // Meter position percentage (capped between 10 and 40 BMI for display)
  const clampedBmi = Math.min(Math.max(bmi, 15), 35);
  const meterPercent = Math.round(((clampedBmi - 15) / (35 - 15)) * 100);

  return {
    bmi,
    category,
    color,
    statusBadge,
    explanation,
    heightCm: h,
    weightKg: w,
    healthyWeightRange: `${minHealthyWeight} – ${maxHealthyWeight} kg`,
    meterPercent,
    disclaimer: 'BMI is a general screening indicator. It does not measure body fat percentage directly, nor does it distinguish between bone density, muscle, and adipose tissue.'
  };
}

// ------------------------------------------------------------------------------
// 4. WATER INTAKE CALCULATOR LOGIC
// ------------------------------------------------------------------------------
/**
 * Daily Water Intake Estimation
 *
 * Methodology:
 * Base physiological requirement: 35 ml per kg of body weight (0.035 L/kg)
 * Activity hydration compensation:
 * - Sedentary: +0.0 L
 * - Lightly Active: +0.35 L
 * - Moderately Active: +0.70 L
 * - Very Active: +1.0 L
 *
 * Glass equivalent assumes standard 250 ml glass.
 */
export function calculateWater({ weight, activityLevel }) {
  const w = parseFloat(weight);
  if (!w || w <= 0) return null;

  // Base: 35 ml / kg
  const baseLiters = w * 0.035;

  let activityBonus = 0;
  let activityLabel = 'Sedentary';

  switch (activityLevel) {
    case 'LIGHT':
      activityBonus = 0.35;
      activityLabel = 'Light (1–3 days/wk)';
      break;
    case 'MODERATE':
      activityBonus = 0.70;
      activityLabel = 'Moderate (3–5 days/wk)';
      break;
    case 'VERY_ACTIVE':
      activityBonus = 1.0;
      activityLabel = 'Very Active (6–7 days/wk)';
      break;
    case 'SEDENTARY':
    default:
      activityBonus = 0.0;
      activityLabel = 'Sedentary (desk work)';
      break;
  }

  const totalLitersRaw = baseLiters + activityBonus;
  const totalLiters = parseFloat(totalLitersRaw.toFixed(1));
  const glasses = Math.round((totalLiters * 1000) / 250);

  return {
    liters: totalLiters,
    glasses,
    baseLiters: baseLiters.toFixed(1),
    activityBonus: activityBonus.toFixed(1),
    weightKg: w,
    activityLabel,
    explanation: `Your baseline hydration is ~${baseLiters.toFixed(1)} L/day (35 ml/kg) + ${activityBonus.toFixed(1)} L added to offset workout sweat losses and metabolic demand.`,
    tips: [
      'Drink 300–500 ml of water 30 minutes prior to workouts.',
      'Sip 150–250 ml every 15–20 minutes during intense gym sessions.',
      'Pale straw-colored urine is the gold standard indicator of optimal hydration.'
    ]
  };
}

// ------------------------------------------------------------------------------
// 5. CALORIE & ENERGY (TDEE) CALCULATOR LOGIC (BONUS VIVA MODULE)
// ------------------------------------------------------------------------------
/**
 * Mifflin-St Jeor Energy Expenditure Formula
 *
 * Clinical standard for Basal Metabolic Rate (BMR):
 * Men:   (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Women: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 *
 * Total Daily Energy Expenditure (TDEE) = BMR × Activity Multiplier
 * - Sedentary: 1.2
 * - Light: 1.375
 * - Moderate: 1.55
 * - Very Active: 1.725
 */
export function calculateBmrTdee({ weight, height, age, gender, activityLevel, goal }) {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return null;

  // Mifflin-St Jeor
  let bmr = (10 * w) + (6.25 * h) - (5 * a);
  if (gender === 'FEMALE') {
    bmr -= 161;
  } else {
    bmr += 5;
  }
  bmr = Math.round(bmr);

  // Multiplier
  let multiplier = 1.2;
  let multName = 'Sedentary';
  switch (activityLevel) {
    case 'LIGHT':
      multiplier = 1.375;
      multName = 'Lightly Active';
      break;
    case 'MODERATE':
      multiplier = 1.55;
      multName = 'Moderately Active';
      break;
    case 'VERY_ACTIVE':
      multiplier = 1.725;
      multName = 'Very Active';
      break;
    case 'SEDENTARY':
    default:
      multiplier = 1.2;
      multName = 'Sedentary';
      break;
  }

  const tdee = Math.round(bmr * multiplier);

  // Target calories based on goal
  let targetCalories = tdee;
  let goalNote = 'Maintenance (Zero calorie surplus or deficit)';
  if (goal === 'WEIGHT_LOSS') {
    targetCalories = Math.max(1200, Math.round(tdee - 450));
    goalNote = 'Caloric Deficit (~450 kcal/day for safe ~0.45 kg/week fat loss)';
  } else if (goal === 'MUSCLE_GAIN') {
    targetCalories = Math.round(tdee + 300);
    goalNote = 'Lean Surplus (~300 kcal/day for progressive muscle hypertrophy)';
  } else if (goal === 'STRENGTH_TRAINING') {
    targetCalories = Math.round(tdee + 200);
    goalNote = 'Performance Fuel (~200 kcal/day to support high-intensity lifting)';
  }

  return {
    bmr,
    tdee,
    targetCalories,
    multiplier,
    multName,
    goalNote,
    explanation: `Your body burns approximately ${bmr} kcal at complete rest (BMR), and ~${tdee} kcal total with your activity level. To reach your goal, your daily intake target is ~${targetCalories} kcal.`
  };
}
