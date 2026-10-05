import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Scale,
  Droplets,
  Activity,
  Flame,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import Alert from '../../components/ui/Alert';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import {
  validateNumber,
  calculateProtein,
  calculateBmi,
  calculateWater,
  calculateBmrTdee
} from '../../utils/fitnessCalculators';

export default function MemberTools() {
  useDocumentTitle('GYMKHANA | My Fitness Tools', 'Member interactive fitness and nutrition calculators with profile pre-fill.');

  const [activeTab, setActiveTab] = useState('protein');
  const [syncedBiometrics, setSyncedBiometrics] = useState(null);

  // 1. Protein State
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
    calculateProtein({ weight: 75, goal: 'MUSCLE_GAIN', activityLevel: 'VERY_ACTIVE' })
  );

  // 2. BMI State
  const [bmiForm, setBmiForm] = useState({ height: '175', weight: '72' });
  const [bmiErrors, setBmiErrors] = useState({});
  const [bmiResult, setBmiResult] = useState(() =>
    calculateBmi({ weight: 72, height: 175 })
  );

  // 3. Water State
  const [waterForm, setWaterForm] = useState({ weight: '70', activityLevel: 'MODERATE' });
  const [waterErrors, setWaterErrors] = useState({});
  const [waterResult, setWaterResult] = useState(() =>
    calculateWater({ weight: 70, activityLevel: 'MODERATE' })
  );

  // 4. Calorie / TDEE State
  const [tdeeForm, setTdeeForm] = useState({
    age: '24',
    gender: 'MALE',
    height: '175',
    weight: '72',
    activityLevel: 'MODERATE',
    goal: 'MUSCLE_GAIN'
  });
  const [tdeeErrors, setTdeeErrors] = useState({});
  const [tdeeResult, setTdeeResult] = useState(() =>
    calculateBmrTdee({
      age: 24,
      gender: 'MALE',
      height: 175,
      weight: 72,
      activityLevel: 'MODERATE',
      goal: 'MUSCLE_GAIN'
    })
  );

  // Fetch member's latest biometrics from database to allow 1-click sync
  useEffect(() => {
    async function loadMemberBiometrics() {
      try {
        const res = await api.get('/members/dashboard');
        if (res.success && res.data?.latestProgress) {
          const prog = res.data.latestProgress;
          setSyncedBiometrics({
            weight: prog.weight_kg ? String(prog.weight_kg) : '',
            height: prog.height_cm ? String(prog.height_cm) : '',
            measuredOn: prog.measured_on
          });
        }
      } catch (err) {
        // Non-blocking error: calculators remain fully usable manually
      }
    }
    loadMemberBiometrics();
  }, []);

  const handleSyncBiometrics = () => {
    if (!syncedBiometrics) return;
    const w = syncedBiometrics.weight;
    const h = syncedBiometrics.height;

    if (w) {
      setProteinForm((prev) => ({ ...prev, weight: w, height: h || prev.height }));
      setProteinResult(calculateProtein({
        weight: w,
        goal: proteinForm.goal,
        activityLevel: proteinForm.activityLevel
      }));

      setWaterForm((prev) => ({ ...prev, weight: w }));
      setWaterResult(calculateWater({
        weight: w,
        activityLevel: waterForm.activityLevel
      }));

      setTdeeForm((prev) => ({ ...prev, weight: w, height: h || prev.height }));
      setTdeeResult(calculateBmrTdee({
        age: tdeeForm.age,
        gender: tdeeForm.gender,
        height: h || tdeeForm.height,
        weight: w,
        activityLevel: tdeeForm.activityLevel,
        goal: tdeeForm.goal
      }));
    }

    if (h && w) {
      setBmiForm({ height: h, weight: w });
      setBmiResult(calculateBmi({ weight: w, height: h }));
    }
  };

  // Submit handlers
  const handleProteinSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const wErr = validateNumber(proteinForm.weight, 30, 250, 'Weight');
    if (wErr) errors.weight = wErr;
    if (Object.keys(errors).length > 0) {
      setProteinErrors(errors);
      return;
    }
    setProteinErrors({});
    setProteinResult(calculateProtein(proteinForm));
  };

  const handleBmiSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const hErr = validateNumber(bmiForm.height, 50, 250, 'Height');
    const wErr = validateNumber(bmiForm.weight, 20, 300, 'Weight');
    if (hErr) errors.height = hErr;
    if (wErr) errors.weight = wErr;
    if (Object.keys(errors).length > 0) {
      setBmiErrors(errors);
      return;
    }
    setBmiErrors({});
    setBmiResult(calculateBmi(bmiForm));
  };

  const handleWaterSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const wErr = validateNumber(waterForm.weight, 20, 300, 'Weight');
    if (wErr) errors.weight = wErr;
    if (Object.keys(errors).length > 0) {
      setWaterErrors(errors);
      return;
    }
    setWaterErrors({});
    setWaterResult(calculateWater(waterForm));
  };

  const handleTdeeSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const aErr = validateNumber(tdeeForm.age, 12, 100, 'Age');
    const hErr = validateNumber(tdeeForm.height, 90, 250, 'Height');
    const wErr = validateNumber(tdeeForm.weight, 25, 300, 'Weight');
    if (aErr) errors.age = aErr;
    if (hErr) errors.height = hErr;
    if (wErr) errors.weight = wErr;
    if (Object.keys(errors).length > 0) {
      setTdeeErrors(errors);
      return;
    }
    setTdeeErrors({});
    setTdeeResult(calculateBmrTdee(tdeeForm));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Member Toolsuite
            </span>
            <Badge type="role" value="Zero Data Storage" />
          </div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.35rem' }}>
            My Fitness Tools & Calculators
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Calibrate your daily nutritional and hydration targets on demand. All calculations execute transparently in your browser session.
          </p>
        </div>

        {/* Sync Prompt if Biometrics Exist in DB */}
        {syncedBiometrics && (
          <div style={{
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Latest Gym Biometrics
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {syncedBiometrics.weight} kg {syncedBiometrics.height ? `• ${syncedBiometrics.height} cm` : ''}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={handleSyncBiometrics}
            >
              Fill From Log
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.75rem'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('protein')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'protein' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'protein' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
            color: activeTab === 'protein' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <Activity size={16} />
          Protein Calculator
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bmi')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'bmi' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'bmi' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
            color: activeTab === 'bmi' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <Scale size={16} />
          BMI Calculator
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('water')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'water' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'water' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
            color: activeTab === 'water' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <Droplets size={16} />
          Water Intake
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tdee')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: activeTab === 'tdee' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'tdee' ? 'var(--accent-primary-dim)' : 'var(--surface-card)',
            color: activeTab === 'tdee' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <Flame size={16} />
          Calorie & TDEE
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'protein' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: 'var(--accent-primary)' }} />
              Protein Settings
            </h3>
            <form onSubmit={handleProteinSubmit} noValidate>
              <FormInput
                label="Weight (kg)"
                type="number"
                value={proteinForm.weight}
                onChange={(e) => setProteinForm({ ...proteinForm, weight: e.target.value })}
                error={proteinErrors.weight}
                required
              />
              <FormSelect
                label="Activity Level"
                value={proteinForm.activityLevel}
                onChange={(e) => setProteinForm({ ...proteinForm, activityLevel: e.target.value })}
                options={[
                  { value: 'SEDENTARY', label: 'Sedentary' },
                  { value: 'LIGHT', label: 'Lightly Active (1–3 days/wk)' },
                  { value: 'MODERATE', label: 'Moderately Active (3–5 days/wk)' },
                  { value: 'VERY_ACTIVE', label: 'Very Active (6–7 days/wk)' }
                ]}
                required
              />
              <FormSelect
                label="Fitness Goal"
                value={proteinForm.goal}
                onChange={(e) => setProteinForm({ ...proteinForm, goal: e.target.value })}
                options={[
                  { value: 'MAINTENANCE', label: 'General Maintenance' },
                  { value: 'WEIGHT_LOSS', label: 'Fat Loss / Cutting' },
                  { value: 'MUSCLE_GAIN', label: 'Muscle Gain / Hypertrophy' },
                  { value: 'STRENGTH_TRAINING', label: 'Strength / Power' }
                ]}
                required
              />
              <div style={{ marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" style={{ width: '100%' }}>
                  Calculate Protein Target
                </Button>
              </div>
            </form>
          </Card>

          <Card style={{ border: '1px solid var(--accent-primary-border)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
              YOUR DAILY PROTEIN TARGET
            </span>
            {proteinResult && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  {proteinResult.minGrams} – {proteinResult.maxGrams} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>g/day</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Based on {proteinResult.minRate}–{proteinResult.maxRate} g/kg body weight.
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {proteinResult.rationale}
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem', color: 'var(--color-info)' }}>
                  {proteinResult.mealTip}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'bmi' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} style={{ color: 'var(--accent-primary)' }} />
              BMI Inputs
            </h3>
            <form onSubmit={handleBmiSubmit} noValidate>
              <FormInput
                label="Height (cm)"
                type="number"
                value={bmiForm.height}
                onChange={(e) => setBmiForm({ ...bmiForm, height: e.target.value })}
                error={bmiErrors.height}
                required
              />
              <FormInput
                label="Weight (kg)"
                type="number"
                value={bmiForm.weight}
                onChange={(e) => setBmiForm({ ...bmiForm, weight: e.target.value })}
                error={bmiErrors.weight}
                required
              />
              <div style={{ marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" style={{ width: '100%' }}>
                  Calculate BMI
                </Button>
              </div>
            </form>
          </Card>

          <Card style={{ border: '1px solid var(--accent-primary-border)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
              BODY MASS INDEX
            </span>
            {bmiResult && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: bmiResult.color, fontFamily: 'var(--font-mono)' }}>
                  {bmiResult.bmi} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kg/m²</span>
                </div>
                <div style={{ fontWeight: 600, color: bmiResult.color, fontSize: '1rem', marginTop: '0.25rem' }}>
                  {bmiResult.category}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {bmiResult.explanation}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Healthy Range:</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{bmiResult.healthyWeightRange}</strong>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'water' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Droplets size={18} style={{ color: 'var(--accent-primary)' }} />
              Hydration Inputs
            </h3>
            <form onSubmit={handleWaterSubmit} noValidate>
              <FormInput
                label="Weight (kg)"
                type="number"
                value={waterForm.weight}
                onChange={(e) => setWaterForm({ ...waterForm, weight: e.target.value })}
                error={waterErrors.weight}
                required
              />
              <FormSelect
                label="Activity Level"
                value={waterForm.activityLevel}
                onChange={(e) => setWaterForm({ ...waterForm, activityLevel: e.target.value })}
                options={[
                  { value: 'SEDENTARY', label: 'Sedentary (+0.0 L)' },
                  { value: 'LIGHT', label: 'Lightly Active (+0.35 L)' },
                  { value: 'MODERATE', label: 'Moderately Active (+0.70 L)' },
                  { value: 'VERY_ACTIVE', label: 'Very Active (+1.0 L)' }
                ]}
                required
              />
              <div style={{ marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" style={{ width: '100%' }}>
                  Calculate Water Target
                </Button>
              </div>
            </form>
          </Card>

          <Card style={{ border: '1px solid var(--accent-primary-border)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
              DAILY FLUID TARGET
            </span>
            {waterResult && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-info)', fontFamily: 'var(--font-mono)' }}>
                  {waterResult.liters} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Liters/day</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Approx. <strong>{waterResult.glasses} glasses</strong> (250 ml standard).
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {waterResult.explanation}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'tdee' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={18} style={{ color: 'var(--color-warning)' }} />
              Calorie Inputs
            </h3>
            <form onSubmit={handleTdeeSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormInput
                  label="Age"
                  type="number"
                  value={tdeeForm.age}
                  onChange={(e) => setTdeeForm({ ...tdeeForm, age: e.target.value })}
                  error={tdeeErrors.age}
                  required
                />
                <FormSelect
                  label="Gender"
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
                  type="number"
                  value={tdeeForm.height}
                  onChange={(e) => setTdeeForm({ ...tdeeForm, height: e.target.value })}
                  error={tdeeErrors.height}
                  required
                />
                <FormInput
                  label="Weight (kg)"
                  type="number"
                  value={tdeeForm.weight}
                  onChange={(e) => setTdeeForm({ ...tdeeForm, weight: e.target.value })}
                  error={tdeeErrors.weight}
                  required
                />
              </div>
              <FormSelect
                label="Activity Level"
                value={tdeeForm.activityLevel}
                onChange={(e) => setTdeeForm({ ...tdeeForm, activityLevel: e.target.value })}
                options={[
                  { value: 'SEDENTARY', label: 'Sedentary (1.2x)' },
                  { value: 'LIGHT', label: 'Lightly Active (1.375x)' },
                  { value: 'MODERATE', label: 'Moderately Active (1.55x)' },
                  { value: 'VERY_ACTIVE', label: 'Very Active (1.725x)' }
                ]}
                required
              />
              <FormSelect
                label="Goal"
                value={tdeeForm.goal}
                onChange={(e) => setTdeeForm({ ...tdeeForm, goal: e.target.value })}
                options={[
                  { value: 'MAINTENANCE', label: 'Maintain Weight' },
                  { value: 'WEIGHT_LOSS', label: 'Fat Loss (-450 kcal)' },
                  { value: 'MUSCLE_GAIN', label: 'Muscle Gain (+300 kcal)' }
                ]}
                required
              />
              <div style={{ marginTop: '1.25rem' }}>
                <Button type="submit" variant="primary" style={{ width: '100%' }}>
                  Calculate Calories
                </Button>
              </div>
            </form>
          </Card>

          <Card style={{ border: '1px solid var(--accent-primary-border)' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
              ESTIMATED DAILY ENERGY
            </span>
            {tdeeResult && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-warning)', fontFamily: 'var(--font-mono)' }}>
                  {tdeeResult.targetCalories} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>kcal/day</span>
                </div>
                <div style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                  {tdeeResult.goalNote}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {tdeeResult.explanation}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Progress Link Footnote */}
      <div style={{
        padding: '1.25rem',
        backgroundColor: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
              Want to record your longitudinal weight progress?
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Log official weigh-ins and circumference notes in your member progress journal.
            </div>
          </div>
        </div>
        <Link to="/member/progress">
          <Button variant="outline" size="sm" icon={ArrowRight}>
            Open Progress Tracker
          </Button>
        </Link>
      </div>
    </div>
  );
}
