import {
  validateNumber,
  calculateProtein,
  calculateBmi,
  calculateWater,
  calculateBmrTdee
} from './fitnessCalculators.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('========================================================');
console.log(' GYMKHANA FITNESS CALCULATORS — AUTOMATED TEST SUITE');
console.log('========================================================\n');

// 1. Validation tests
console.log('[TEST GROUP 1] Input Validation');
assert(validateNumber('', 10, 100, 'Weight') !== null, 'Empty string is rejected');
assert(validateNumber(null, 10, 100, 'Age') !== null, 'Null is rejected');
assert(validateNumber('abc', 10, 100, 'Height') !== null, 'Non-numeric string is rejected');
assert(validateNumber(-5, 0, 100, 'Weight') !== null, 'Negative value below min is rejected');
assert(validateNumber(300, 10, 200, 'Weight') !== null, 'Value above max is rejected');
assert(validateNumber(75, 10, 200, 'Weight') === null, 'Valid number in range passes');
assert(validateNumber('72.5', 10, 200, 'Weight') === null, 'Valid decimal in range passes');

// 2. Protein calculation tests
console.log('\n[TEST GROUP 2] Protein Requirement Estimator');
const prot1 = calculateProtein({ weight: 75, goal: 'MUSCLE_GAIN', activityLevel: 'VERY_ACTIVE' });
assert(prot1 !== null, 'Result is not null for valid inputs');
assert(prot1.minGrams === 135, `Min protein for 75kg muscle gain is 135g (got ${prot1.minGrams})`);
assert(prot1.maxGrams === 165, `Max protein for 75kg muscle gain is 165g (got ${prot1.maxGrams})`);
assert(prot1.minRate === '1.8' && prot1.maxRate === '2.2', `Rate is 1.8-2.2 g/kg (got ${prot1.minRate}-${prot1.maxRate})`);
assert(!isNaN(prot1.minGrams) && !isNaN(prot1.maxGrams), 'No NaN in protein results');
assert(typeof prot1.rationale === 'string' && prot1.rationale.length > 20, 'Has detailed rationale');

// Weight loss high protein
const prot2 = calculateProtein({ weight: 80, goal: 'WEIGHT_LOSS', activityLevel: 'MODERATE' });
assert(prot2.minGrams === 144 && prot2.maxGrams === 176, `Weight loss 80kg protein is 144-176g (got ${prot2.minGrams}-${prot2.maxGrams})`);

// Boundary values
const protMin = calculateProtein({ weight: 30, goal: 'MAINTENANCE', activityLevel: 'SEDENTARY' });
assert(protMin.minGrams === 30 && protMin.maxGrams === 42, `Min boundary 30kg: 30-42g (got ${protMin.minGrams}-${protMin.maxGrams})`);

const protMax = calculateProtein({ weight: 250, goal: 'STRENGTH_TRAINING', activityLevel: 'VERY_ACTIVE' });
assert(protMax.minGrams === 450 && protMax.maxGrams === 600, `Max boundary 250kg: 450-600g (got ${protMax.minGrams}-${protMax.maxGrams})`);

// 3. BMI tests
console.log('\n[TEST GROUP 3] BMI Calculator');
const bmiNormal = calculateBmi({ weight: 72, height: 175 });
assert(bmiNormal.bmi === 23.5, `BMI for 72kg, 175cm is 23.5 (got ${bmiNormal.bmi})`);
assert(bmiNormal.category === 'Normal Weight', `Category is Normal Weight (got ${bmiNormal.category})`);
assert(!isNaN(bmiNormal.bmi), 'No NaN in BMI calculation');
assert(bmiNormal.healthyWeightRange.includes('kg'), 'Healthy weight range string generated');

const bmiUnder = calculateBmi({ weight: 45, height: 170 });
assert(bmiUnder.category === 'Underweight', `Underweight detected (got ${bmiUnder.category})`);

const bmiOver = calculateBmi({ weight: 85, height: 175 });
assert(bmiOver.category === 'Overweight', `Overweight detected (got ${bmiOver.category})`);

const bmiObese = calculateBmi({ weight: 110, height: 170 });
assert(bmiObese.category === 'Obesity Category', `Obesity category detected (got ${bmiObese.category})`);

// 4. Water intake tests
console.log('\n[TEST GROUP 4] Water Intake Calculator');
const water1 = calculateWater({ weight: 70, activityLevel: 'MODERATE' });
assert(water1.liters === 3.2, `Water for 70kg moderate is 3.2L (got ${water1.liters}L)`);
assert(water1.glasses === 13, `Water glasses count is 13 (got ${water1.glasses})`);
assert(!isNaN(water1.liters) && !isNaN(water1.glasses), 'No NaN in water calculation');

const waterSed = calculateWater({ weight: 60, activityLevel: 'SEDENTARY' });
assert(waterSed.liters === 2.1, `Water for 60kg sedentary is 2.1L (got ${waterSed.liters}L)`);

// 5. Calorie & TDEE tests
console.log('\n[TEST GROUP 5] Mifflin-St Jeor TDEE Calculator');
const tdeeMale = calculateBmrTdee({
  age: 25,
  gender: 'MALE',
  height: 175,
  weight: 75,
  activityLevel: 'MODERATE',
  goal: 'MUSCLE_GAIN'
});
// BMR = 10*75 + 6.25*175 - 5*25 + 5 = 750 + 1093.75 - 125 + 5 = 1723.75 -> 1724
assert(tdeeMale.bmr === 1724, `Male BMR calculated correctly: 1724 (got ${tdeeMale.bmr})`);
// TDEE = 1724 * 1.55 = 2672
assert(tdeeMale.tdee === 2672, `TDEE calculated correctly: 2672 (got ${tdeeMale.tdee})`);
// Muscle gain target = 2672 + 300 = 2972
assert(tdeeMale.targetCalories === 2972, `Target calories calculated: 2972 (got ${tdeeMale.targetCalories})`);
assert(!isNaN(tdeeMale.bmr) && !isNaN(tdeeMale.tdee) && !isNaN(tdeeMale.targetCalories), 'No NaN in TDEE');

console.log('\n========================================================');
console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) {
  process.exit(1);
}
