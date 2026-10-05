import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Scale,
  Droplets,
  Flame,
  Activity,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldAlert,
  ArrowRight,
  Dumbbell
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import Alert from '../../components/ui/Alert';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  validateNumber,
  calculateProtein,
  calculateBmi,
  calculateWater,
  calculateBmrTdee
} from '../../utils/fitnessCalculators';

export default function FitnessCalculator() {
  useDocumentTitle(
    'GYMKHANA | Fitness Calculator',
    'Evidence-based fitness calculators for daily protein requirements, BMI classification, hydration intake, and TDEE calorie estimation.'
  );

  const [activeTab, setActiveTab] = useState('protein');

  // ---------------------------------------------------------------------------
  // 1. PROTEIN CALCULATOR STATE
  // ---------------------------------------------------------------------------
  const [proteinForm, setProteinForm] = useState({
    weight: '75',
    goal: 'MUSCLE_GAIN',
    activityLevel: 'VERY_ACTIVE',
    age: '24',
    gender: 'MALE',
    height: '178'
  });
  const [proteinErrors, setProteinErrors] = useState({});
  const [proteinResult, setProteinResult] = useState(() =>
    calculateProtein({
      weight: 75,
      goal: 'MUSCLE_GAIN',
      activityLevel: 'VERY_ACTIVE'
    })
  );

  const handleProteinSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    const weightErr = validateNumber(proteinForm.weight, 30, 250, 'Weight (kg)');
    if (weightErr) errors.weight = weightErr;

    const ageErr = validateNumber(proteinForm.age, 12, 100, 'Age');
    if (ageErr) errors.age = ageErr;

    const heightErr = validateNumber(proteinForm.height, 90, 250, 'Height (cm)');
    if (heightErr) errors.height = heightErr;

    if (!proteinForm.goal) errors.goal = 'Please select a fitness goal';
    if (!proteinForm.activityLevel) errors.activityLevel = 'Please select an activity level';

    if (Object.keys(errors).length > 0) {
      setProteinErrors(errors);
      return;
    }

    setProteinErrors({});
    const res = calculateProtein({
      weight: proteinForm.weight,
      goal: proteinForm.goal,
      activityLevel: proteinForm.activityLevel,
      gender: proteinForm.gender,
      age: proteinForm.age
    });
    setProteinResult(res);
  };

  const handleProteinReset = () => {
    setProteinForm({
      weight: '',
      goal: 'MAINTENANCE',
      activityLevel: 'MODERATE',
      age: '',
      gender: 'MALE',
      height: ''
    });
    setProteinErrors({});
    setProteinResult(null);
  };

  // ---------------------------------------------------------------------------
  // 2. BMI CALCULATOR STATE
  // ---------------------------------------------------------------------------
  const [bmiForm, setBmiForm] = useState({
    height: '175',
    weight: '72'
  });
  const [bmiErrors, setBmiErrors] = useState({});
  const [bmiResult, setBmiResult] = useState(() =>
    calculateBmi({ weight: 72, height: 175 })
  );

  const handleBmiSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    const heightErr = validateNumber(bmiForm.height, 50, 250, 'Height (cm)');
    if (heightErr) errors.height = heightErr;

    const weightErr = validateNumber(bmiForm.weight, 20, 300, 'Weight (kg)');
    if (weightErr) errors.weight = weightErr;

    if (Object.keys(errors).length > 0) {
      setBmiErrors(errors);
      return;
    }

    setBmiErrors({});
    const res = calculateBmi({
      weight: bmiForm.weight,
      height: bmiForm.height
    });
    setBmiResult(res);
  };

  const handleBmiReset = () => {
    setBmiForm({ height: '', weight: '' });
    setBmiErrors({});
    setBmiResult(null);
  };

  // ---------------------------------------------------------------------------
  // 3. WATER INTAKE CALCULATOR STATE
  // ---------------------------------------------------------------------------
  const [waterForm, setWaterForm] = useState({
    weight: '70',
    activityLevel: 'MODERATE'
  });
  const [waterErrors, setWaterErrors] = useState({});
  const [waterResult, setWaterResult] = useState(() =>
    calculateWater({ weight: 70, activityLevel: 'MODERATE' })
  );

  const handleWaterSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    const weightErr = validateNumber(waterForm.weight, 20, 300, 'Weight (kg)');
    if (weightErr) errors.weight = weightErr;

    if (!waterForm.activityLevel) errors.activityLevel = 'Please select an activity level';

    if (Object.keys(errors).length > 0) {
      setWaterErrors(errors);
      return;
    }

    setWaterErrors({});
    const res = calculateWater({
      weight: waterForm.weight,
      activityLevel: waterForm.activityLevel
    });
    setWaterResult(res);
  };

  const handleWaterReset = () => {
    setWaterForm({ weight: '', activityLevel: 'SEDENTARY' });
    setWaterErrors({});
    setWaterResult(null);
  };

  // ---------------------------------------------------------------------------
  // 4. CALORIE & TDEE CALCULATOR STATE (VIVA DEMO BONUS)
  // ---------------------------------------------------------------------------
  const [tdeeForm, setTdeeForm] = useState({
    age: '23',
    gender: 'MALE',
    height: '175',
    weight: '72',
    activityLevel: 'MODERATE',
    goal: 'MUSCLE_GAIN'
  });
  const [tdeeErrors, setTdeeErrors] = useState({});
  const [tdeeResult, setTdeeResult] = useState(() =>
    calculateBmrTdee({
      age: 23,
      gender: 'MALE',
      height: 175,
      weight: 72,
      activityLevel: 'MODERATE',
      goal: 'MUSCLE_GAIN'
    })
  );

  const handleTdeeSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    const ageErr = validateNumber(tdeeForm.age, 12, 100, 'Age');
    if (ageErr) errors.age = ageErr;

    const heightErr = validateNumber(tdeeForm.height, 90, 250, 'Height (cm)');
    if (heightErr) errors.height = heightErr;

    const weightErr = validateNumber(tdeeForm.weight, 25, 300, 'Weight (kg)');
    if (weightErr) errors.weight = weightErr;

    if (Object.keys(errors).length > 0) {
      setTdeeErrors(errors);
      return;
    }

    setTdeeErrors({});
    const res = calculateBmrTdee({
      age: tdeeForm.age,
      gender: tdeeForm.gender,
      height: tdeeForm.height,
      weight: tdeeForm.weight,
      activityLevel: tdeeForm.activityLevel,
      goal: tdeeForm.goal
    });
    setTdeeResult(res);
  };

  const handleTdeeReset = () => {
    setTdeeForm({
      age: '',
      gender: 'MALE',
      height: '',
      weight: '',
      activityLevel: 'MODERATE',
      goal: 'MAINTENANCE'
    });
    setTdeeErrors({});
    setTdeeResult(null);
  };

  // ---------------------------------------------------------------------------
  // HELPER FORMATTERS
  // ---------------------------------------------------------------------------
  const goalLabels = {
    MAINTENANCE: 'General Fitness / Maintenance',
    WEIGHT_LOSS: 'Weight Loss / Caloric Deficit',
    MUSCLE_GAIN: 'Muscle Gain / Hypertrophy',
    STRENGTH_TRAINING: 'Strength Training / Athletic Performance'
  };

  const activityLabels = {
    SEDENTARY: 'Sedentary (Desk Job / Minimal Movement)',
    LIGHT: 'Lightly Active (1–3 training days/week)',
    MODERATE: 'Moderately Active (3–5 training days/week)',
    VERY_ACTIVE: 'Very Active (6–7 intense training days/week)'
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <section style={{
        backgroundColor: '#0A0C0F',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3.5rem 0 2.5rem',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              backgroundColor: 'var(--accent-primary-dim)',
              border: '1px solid var(--accent-primary-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.85rem',
              fontSize: '0.8125rem',
              color: 'var(--accent-primary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Calculator size={15} />
              Evidence-Based Fitness Tools
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            GYMKHANA Fitness Calculators
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', lineHeight: '1.6' }}>
            Accurate, transparent, and rule-based nutritional and biometric estimators designed to help you calibrate your training nutrition, hydration, and body composition.
          </p>
        </div>
      </section>

      {/* Main Tool Container */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('protein')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'protein' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'protein' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
              color: activeTab === 'protein' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Activity size={18} />
            Protein Calculator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bmi')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'bmi' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'bmi' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
              color: activeTab === 'bmi' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Scale size={18} />
            BMI Calculator
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('water')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'water' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'water' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
              color: activeTab === 'water' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Droplets size={18} />
            Water Intake
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tdee')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: activeTab === 'tdee' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: activeTab === 'tdee' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
              color: activeTab === 'tdee' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Flame size={18} />
            Calorie & TDEE
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 1. PROTEIN CALCULATOR TAB */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'protein' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Input Form Card */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary-dim)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>Daily Protein Estimator</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Calculates recommended grams/day using peer-reviewed protein-per-kg methodology.
                  </p>
                </div>
              </div>

              <form onSubmit={handleProteinSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormInput
                    label="Body Weight"
                    name="weight"
                    type="number"
                    placeholder="e.g. 75"
                    value={proteinForm.weight}
                    onChange={(e) => setProteinForm({ ...proteinForm, weight: e.target.value })}
                    error={proteinErrors.weight}
                    helper="Metric kg (30–250)"
                    required
                  />

                  <FormInput
                    label="Height"
                    name="height"
                    type="number"
                    placeholder="e.g. 178"
                    value={proteinForm.height}
                    onChange={(e) => setProteinForm({ ...proteinForm, height: e.target.value })}
                    error={proteinErrors.height}
                    helper="Metric cm (90–250)"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    placeholder="e.g. 24"
                    value={proteinForm.age}
                    onChange={(e) => setProteinForm({ ...proteinForm, age: e.target.value })}
                    error={proteinErrors.age}
                    helper="Years (12–100)"
                    required
                  />

                  <FormSelect
                    label="Biological Gender"
                    name="gender"
                    value={proteinForm.gender}
                    onChange={(e) => setProteinForm({ ...proteinForm, gender: e.target.value })}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' }
                    ]}
                    required
                  />
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <FormSelect
                    label="Weekly Activity Level"
                    name="activityLevel"
                    value={proteinForm.activityLevel}
                    onChange={(e) => setProteinForm({ ...proteinForm, activityLevel: e.target.value })}
                    error={proteinErrors.activityLevel}
                    options={[
                      { value: 'SEDENTARY', label: 'Sedentary (desk work, little exercise)' },
                      { value: 'LIGHT', label: 'Lightly Active (1–3 training days/week)' },
                      { value: 'MODERATE', label: 'Moderately Active (3–5 training days/week)' },
                      { value: 'VERY_ACTIVE', label: 'Very Active (6–7 heavy training days/week)' }
                    ]}
                    required
                  />
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <FormSelect
                    label="Primary Fitness Goal"
                    name="goal"
                    value={proteinForm.goal}
                    onChange={(e) => setProteinForm({ ...proteinForm, goal: e.target.value })}
                    error={proteinErrors.goal}
                    options={[
                      { value: 'MAINTENANCE', label: 'General Fitness / Weight Maintenance' },
                      { value: 'WEIGHT_LOSS', label: 'Weight Loss / Caloric Deficit' },
                      { value: 'MUSCLE_GAIN', label: 'Muscle Gain / Hypertrophy Split' },
                      { value: 'STRENGTH_TRAINING', label: 'Strength Training / Powerlifting' }
                    ]}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Button type="submit" variant="primary" icon={Calculator} style={{ flex: 1 }}>
                    Calculate Protein
                  </Button>
                  <Button type="button" variant="secondary" icon={RotateCcw} onClick={handleProteinReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            {/* Result Presentation Card */}
            <div>
              {proteinResult ? (
                <Card style={{ border: '1px solid var(--accent-primary-border)', backgroundColor: 'var(--surface-card)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.75rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      YOUR ESTIMATED REQUIREMENT
                    </span>
                    <Badge type="role" value="Deterministic Model" />
                  </div>

                  {/* Primary Large Display */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      fontSize: 'clamp(2.25rem, 5vw, 3rem)',
                      fontWeight: 800,
                      color: 'var(--accent-primary)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {proteinResult.minGrams} – {proteinResult.maxGrams} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>g / day</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.35rem' }}>
                      Equivalent to <strong style={{ color: 'var(--text-primary)' }}>{proteinResult.minRate} – {proteinResult.maxRate} g/kg</strong> of body weight.
                    </div>
                  </div>

                  {/* Parameter Summary Box */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Entered Weight:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{proteinResult.weightKg} kg</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Selected Goal:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{goalLabels[proteinResult.goal] || proteinResult.goal}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Activity Level:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{activityLabels[proteinResult.activityLevel] || proteinResult.activityLevel}</strong>
                    </div>
                  </div>

                  {/* Rationale & Explanation */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)' }} />
                      Why this recommendation?
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {proteinResult.rationale}
                    </p>
                  </div>

                  {/* Meal Distribution Tip */}
                  <div style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid var(--color-info-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1rem',
                    fontSize: '0.8125rem',
                    color: 'var(--color-info)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem'
                  }}>
                    <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Meal Strategy: </strong>
                      {proteinResult.mealTip}
                    </div>
                  </div>

                  {/* Action Link to Workout Plans */}
                  <Link to="/workout-plans">
                    <Button variant="secondary" size="sm" icon={Dumbbell} style={{ width: '100%' }}>
                      Explore Matching Gym Workout Plans &rarr;
                    </Button>
                  </Link>
                </Card>
              ) : (
                <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Activity size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    No Calculation Yet
                  </h3>
                  <p style={{ fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto' }}>
                    Enter your body weight, fitness goal, and training volume to generate your daily protein target.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 2. BMI CALCULATOR TAB */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'bmi' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Input Form Card */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary-dim)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Scale size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>Body Mass Index (BMI)</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Standard World Health Organization (WHO) adult screening formula: Weight (kg) / Height (m)².
                  </p>
                </div>
              </div>

              <form onSubmit={handleBmiSubmit} noValidate>
                <FormInput
                  label="Height in Centimeters"
                  name="height"
                  type="number"
                  placeholder="e.g. 175"
                  value={bmiForm.height}
                  onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })}
                  error={bmiErrors.height}
                  helper="Enter height in cm (50–250)"
                  required
                />

                <div style={{ marginTop: '0.5rem' }}>
                  <FormInput
                    label="Weight in Kilograms"
                    name="weight"
                    type="number"
                    placeholder="e.g. 72"
                    value={bmiForm.weight}
                    onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })}
                    error={bmiErrors.weight}
                    helper="Enter body weight in kg (20–300)"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Button type="submit" variant="primary" icon={Calculator} style={{ flex: 1 }}>
                    Calculate BMI
                  </Button>
                  <Button type="button" variant="secondary" icon={RotateCcw} onClick={handleBmiReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            {/* Result Presentation Card */}
            <div>
              {bmiResult ? (
                <Card style={{ border: '1px solid var(--accent-primary-border)', backgroundColor: 'var(--surface-card)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.75rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      YOUR BMI RESULT
                    </span>
                    <Badge type="status" value={bmiResult.category} />
                  </div>

                  {/* Primary Large Display */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
                      fontWeight: 800,
                      color: bmiResult.color,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {bmiResult.bmi} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>kg/m²</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                      Category: <span style={{ color: bmiResult.color }}>{bmiResult.category}</span>
                    </div>
                  </div>

                  {/* Visual Range Indicator Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      <span>Underweight (&lt;18.5)</span>
                      <span>Normal (18.5–24.9)</span>
                      <span>Overweight (25–29.9)</span>
                      <span>Obese (≥30)</span>
                    </div>
                    <div style={{
                      height: '10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(to right, #38BDF8 0%, #38BDF8 25%, #C6F135 25%, #C6F135 60%, #F59E0B 60%, #F59E0B 80%, #EF4444 80%, #EF4444 100%)',
                      position: 'relative'
                    }}>
                      {/* Pin marker */}
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min(Math.max(bmiResult.meterPercent, 2), 98)}%`,
                        top: '-5px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '3px solid #0F1115',
                        transform: 'translateX(-50%)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
                      }} />
                    </div>
                  </div>

                  {/* Parameter Summary Box */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Height:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{bmiResult.heightCm} cm</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Weight:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{bmiResult.weightKg} kg</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Normal Weight Range (for this height):</span>
                      <strong style={{ color: 'var(--accent-primary)' }}>{bmiResult.healthyWeightRange}</strong>
                    </div>
                  </div>

                  {/* Explanation */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                    {bmiResult.explanation}
                  </p>

                  {/* Specific Disclaimer */}
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)'
                  }}>
                    <strong>Note: </strong> {bmiResult.disclaimer}
                  </div>
                </Card>
              ) : (
                <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Scale size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Enter Height & Weight
                  </h3>
                  <p style={{ fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto' }}>
                    Provide your height in centimeters and weight in kilograms to calculate your BMI index.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 3. WATER INTAKE CALCULATOR TAB */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'water' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Input Form Card */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary-dim)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Droplets size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>Daily Hydration Estimator</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Estimates daily water intake based on 35 ml/kg baseline plus athletic sweat replenishment.
                  </p>
                </div>
              </div>

              <form onSubmit={handleWaterSubmit} noValidate>
                <FormInput
                  label="Body Weight in Kilograms"
                  name="weight"
                  type="number"
                  placeholder="e.g. 70"
                  value={waterForm.weight}
                  onChange={(e) => setWaterForm({ ...waterForm, weight: e.target.value })}
                  error={waterErrors.weight}
                  helper="Enter your weight in kg (20–300)"
                  required
                />

                <div style={{ marginTop: '0.5rem' }}>
                  <FormSelect
                    label="Physical Activity Level"
                    name="activityLevel"
                    value={waterForm.activityLevel}
                    onChange={(e) => setWaterForm({ ...waterForm, activityLevel: e.target.value })}
                    error={waterErrors.activityLevel}
                    options={[
                      { value: 'SEDENTARY', label: 'Sedentary (No formal workout: +0.0 L)' },
                      { value: 'LIGHT', label: 'Lightly Active (Light exercise 1–3 days: +0.35 L)' },
                      { value: 'MODERATE', label: 'Moderately Active (Gym workout 3–5 days: +0.70 L)' },
                      { value: 'VERY_ACTIVE', label: 'Very Active (Intense daily training: +1.0 L)' }
                    ]}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Button type="submit" variant="primary" icon={Calculator} style={{ flex: 1 }}>
                    Calculate Water Intake
                  </Button>
                  <Button type="button" variant="secondary" icon={RotateCcw} onClick={handleWaterReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            {/* Result Presentation Card */}
            <div>
              {waterResult ? (
                <Card style={{ border: '1px solid var(--accent-primary-border)', backgroundColor: 'var(--surface-card)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.75rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      ESTIMATED DAILY FLUID INTAKE
                    </span>
                    <Badge type="role" value="Hydration Guide" />
                  </div>

                  {/* Primary Large Display */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
                      fontWeight: 800,
                      color: 'var(--color-info)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {waterResult.liters} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Liters / day</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '0.4rem' }}>
                      Approximately <strong style={{ color: 'var(--text-primary)' }}>{waterResult.glasses} standard glasses</strong> (250 ml each)
                    </div>
                  </div>

                  {/* Hydration Breakdown */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Base Physiological Need (35 ml/kg):</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{waterResult.baseLiters} L</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Workout Sweat Compensation:</span>
                      <strong style={{ color: 'var(--color-info)' }}>+{waterResult.activityBonus} L</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Daily Target:</span>
                      <strong style={{ color: 'var(--accent-primary)' }}>{waterResult.liters} Liters</strong>
                    </div>
                  </div>

                  {/* Tips list */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      Best Hydration Practices:
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: 0 }}>
                      {waterResult.tips.map((tip, idx) => (
                        <li key={idx} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={14} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)'
                  }}>
                    Fluid needs increase under hot, humid Indian weather or high-intensity cardiovascular sessions.
                  </div>
                </Card>
              ) : (
                <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Droplets size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Enter Body Weight
                  </h3>
                  <p style={{ fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto' }}>
                    Enter your body weight in kilograms to calculate recommended daily fluid hydration.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 4. CALORIE & TDEE TAB (VIVA DEMO BONUS) */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'tdee' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Input Form Card */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Flame size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>Calorie & TDEE Calculator</h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Mifflin-St Jeor clinical formula for Basal Metabolic Rate (BMR) & Total Daily Energy Expenditure.
                  </p>
                </div>
              </div>

              <form onSubmit={handleTdeeSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    placeholder="e.g. 23"
                    value={tdeeForm.age}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, age: e.target.value })}
                    error={tdeeErrors.age}
                    helper="Years (12–100)"
                    required
                  />

                  <FormSelect
                    label="Biological Gender"
                    name="gender"
                    value={tdeeForm.gender}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, gender: e.target.value })}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' }
                    ]}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.25rem' }}>
                  <FormInput
                    label="Height (cm)"
                    name="height"
                    type="number"
                    placeholder="e.g. 175"
                    value={tdeeForm.height}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, height: e.target.value })}
                    error={tdeeErrors.height}
                    helper="Height in cm"
                    required
                  />

                  <FormInput
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    placeholder="e.g. 72"
                    value={tdeeForm.weight}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, weight: e.target.value })}
                    error={tdeeErrors.weight}
                    helper="Weight in kg"
                    required
                  />
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <FormSelect
                    label="Physical Activity Factor"
                    name="activityLevel"
                    value={tdeeForm.activityLevel}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, activityLevel: e.target.value })}
                    options={[
                      { value: 'SEDENTARY', label: 'Sedentary (1.2x: Desk job / little movement)' },
                      { value: 'LIGHT', label: 'Lightly Active (1.375x: 1–3 gym workouts/wk)' },
                      { value: 'MODERATE', label: 'Moderately Active (1.55x: 3–5 gym workouts/wk)' },
                      { value: 'VERY_ACTIVE', label: 'Very Active (1.725x: 6–7 intense workouts/wk)' }
                    ]}
                    required
                  />
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <FormSelect
                    label="Fitness Goal Strategy"
                    name="goal"
                    value={tdeeForm.goal}
                    onChange={(e) => setTdeeForm({ ...tdeeForm, goal: e.target.value })}
                    options={[
                      { value: 'MAINTENANCE', label: 'Maintain Current Weight (Zero deficit)' },
                      { value: 'WEIGHT_LOSS', label: 'Fat Loss / Deficit (~450 kcal reduction)' },
                      { value: 'MUSCLE_GAIN', label: 'Muscle Hypertrophy / Lean Bulk (+300 kcal)' },
                      { value: 'STRENGTH_TRAINING', label: 'Strength & Performance Fuel (+200 kcal)' }
                    ]}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Button type="submit" variant="primary" icon={Calculator} style={{ flex: 1 }}>
                    Calculate Calories
                  </Button>
                  <Button type="button" variant="secondary" icon={RotateCcw} onClick={handleTdeeReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </Card>

            {/* Result Presentation Card */}
            <div>
              {tdeeResult ? (
                <Card style={{ border: '1px solid var(--accent-primary-border)', backgroundColor: 'var(--surface-card)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.75rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      RECOMMENDED DAILY ENERGY TARGET
                    </span>
                    <Badge type="status" value={tdeeResult.multName} />
                  </div>

                  {/* Primary Large Display */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{
                      fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
                      fontWeight: 800,
                      color: 'var(--color-warning)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {tdeeResult.targetCalories} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 500 }}>kcal / day</span>
                    </div>
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.9375rem', marginTop: '0.4rem', fontWeight: 600 }}>
                      {tdeeResult.goalNote}
                    </div>
                  </div>

                  {/* Energy Breakdown */}
                  <div style={{
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Basal Metabolic Rate (BMR):</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{tdeeResult.bmr} kcal/day</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Activity Multiplier:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{tdeeResult.multiplier}x</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Total Daily Energy Expenditure (TDEE):</span>
                      <strong style={{ color: 'var(--color-warning)' }}>{tdeeResult.tdee} kcal/day</strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                    {tdeeResult.explanation}
                  </p>

                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)'
                  }}>
                    Calculated using the Mifflin-St Jeor formula, widely recognized in clinical sports medicine for healthy adults.
                  </div>
                </Card>
              ) : (
                <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Flame size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                  <h3 style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Enter Biometrics & Goal
                  </h3>
                  <p style={{ fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto' }}>
                    Enter your age, gender, height, and training activity to compute your baseline BMR and TDEE calorie target.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MEDICAL & HEALTH DISCLAIMER */}
        {/* ------------------------------------------------------------------ */}
        <div style={{
          marginTop: '3.5rem',
          backgroundColor: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <ShieldAlert size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              GYMKHANA Fitness & Nutrition Disclaimer
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              The calculations provided by GYMKHANA are general fitness estimates for informational purposes only. They are not medical advice or a substitute for advice from a qualified healthcare or nutrition professional. Individual nutritional requirements may vary based on health history, metabolic factors, and specific training phases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
