import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Dumbbell,
  Layers,
  Wrench,
  Users,
  CreditCard,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle(
    'GYMKHANA | Smart Gym Management & Fitness Guide',
    'A full-stack gym management platform and fitness knowledge guide offering structured workout plans, equipment directories, and member progress tracking.'
  );

  const [stats, setStats] = useState(null);
  const [featuredPlans, setFeaturedPlans] = useState([]);
  const [featuredTrainers, setFeaturedTrainers] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        // Fetch real data from public endpoints
        const [workoutsRes, trainersRes, membershipsRes] = await Promise.allSettled([
          api.get('/workouts'),
          api.get('/trainers'),
          api.get('/memberships')
        ]);

        if (isMounted) {
          if (workoutsRes.status === 'fulfilled' && workoutsRes.value.success) {
            const plans = workoutsRes.value.data?.plans || [];
            setFeaturedPlans(plans.slice(0, 3));
          }
          if (trainersRes.status === 'fulfilled' && trainersRes.value.success) {
            const trainers = trainersRes.value.data?.trainers || [];
            setFeaturedTrainers(trainers.slice(0, 3));
          }
          if (membershipsRes.status === 'fulfilled' && membershipsRes.value.success) {
            const memberships = membershipsRes.value.data?.memberships || [];
            setMembershipPlans(memberships.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: '#0B0D11',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-primary-dim)',
              border: '1px solid var(--accent-primary-border)',
              color: 'var(--accent-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.5rem',
            }}>
              <ShieldCheck size={16} />
              Production Field Project &bull; Full-Stack Gym Platform
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}>
              Intelligent Gym Management &amp; <span style={{ color: 'var(--accent-primary)' }}>Guided Athletic Training.</span>
            </h1>

            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
              maxWidth: '680px',
            }}>
              A dual-pillar system pairing a database-backed fitness knowledge library with full role-based administration for members, certified coaches, and gym operators.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/workout-plans">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore Workout Plans
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Join GYMKHANA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Knowledge Library Preview */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pillar A: Knowledge Base
              </span>
              <h2 style={{ fontSize: '1.875rem', marginTop: '0.25rem' }}>
                Curated Fitness &amp; Technique Directory
              </h2>
            </div>
            <Link to="/exercises" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
              View all directory archives <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <Link to="/exercises">
              <Card interactive style={{ height: '100%' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-primary-dim)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Dumbbell size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Exercise Library</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  20+ movements cataloged with targeted body parts, step-by-step cues, execution benefits, safety tips, and common form flaws.
                </p>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  Browse exercises &rarr;
                </span>
              </Card>
            </Link>

            <Link to="/equipment">
              <Card interactive style={{ height: '100%' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-info-bg)',
                  color: 'var(--color-info)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Wrench size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Equipment Manual</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Complete facility machine guide covering pin-loaded stations, cable configurations, and safety latch operations.
                </p>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-info)' }}>
                  Inspect equipment &rarr;
                </span>
              </Card>
            </Link>

            <Link to="/workout-plans">
              <Card interactive style={{ height: '100%' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <Layers size={22} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Periodized Workout Plans</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Structured training programs ordered by day, set schemes, target reps, and rest periods for strength and hypertrophy.
                </p>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-warning)' }}>
                  View training plans &rarr;
                </span>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Gym Management Features Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#0B0D11', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ maxWidth: '640px', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pillar B: Gym Operations
            </span>
            <h2 style={{ fontSize: '1.875rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
              Engineered for Modern Fitness Facilities
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Replace paper logs and disjointed spreadsheets with secure, role-governed data pipelines.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Users size={20} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontSize: '1.1rem' }}>Role-Based Dashboards</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Dedicated workspaces for Admins to govern members and trainers, Trainers to manage athlete programs, and Members to inspect their schedules.
              </p>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CalendarCheck size={20} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontSize: '1.1rem' }}>Attendance Logging</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Digital check-in and check-out tracking linked to individual member IDs with month-by-month historical filtering.
              </p>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontSize: '1.1rem' }}>Biometric Progress</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Longitudinal tracking of body weight, height, computed BMI scores, and clinical progress notes over time.
              </p>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CreditCard size={20} style={{ color: 'var(--accent-primary)' }} />
                <h4 style={{ fontSize: '1.1rem' }}>Membership Control</h4>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Tiered membership plans with duration, privilege specifications, and member tier assignment without mock payment pretenses.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Workout Plans Preview */}
      {featuredPlans.length > 0 && (
        <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Training Programs
                </span>
                <h2 style={{ fontSize: '1.875rem', marginTop: '0.25rem' }}>
                  Featured Workout Plans
                </h2>
              </div>
              <Link to="/workout-plans" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
                Explore all plans <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {featuredPlans.map((plan) => (
                <Card key={plan.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <Badge type="difficulty" value={plan.difficulty} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {plan.duration_weeks} Weeks Duration
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Goal: {plan.goal}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '1.5rem' }}>
                    {plan.description}
                  </p>
                  <Link to={`/workout-plans/${plan.id}`}>
                    <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                      View Plan Schedule &rarr;
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trainer Highlights */}
      {featuredTrainers.length > 0 && (
        <section style={{ padding: '4.5rem 0', backgroundColor: '#0B0D11', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Coaching Staff
                </span>
                <h2 style={{ fontSize: '1.875rem', marginTop: '0.25rem' }}>
                  Certified Floor Trainers
                </h2>
              </div>
              <Link to="/trainers" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
                All trainer profiles <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {featuredTrainers.map((trainer) => (
                <Card key={trainer.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#1E222B',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'var(--accent-primary)',
                      flexShrink: 0,
                    }}>
                      {trainer.full_name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{trainer.full_name}</h4>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {trainer.specialization} &bull; {trainer.experience_years} yrs exp
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {trainer.bio}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge type="status" value={trainer.availability_status} />
                    <Link to="/trainers" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Profile details &rarr;
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Membership Tiers Summary */}
      {membershipPlans.length > 0 && (
        <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Clear Pricing
              </span>
              <h2 style={{ fontSize: '1.875rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                Membership Access Tiers
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                Database-driven membership enrollment for students and athletic trainees.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {membershipPlans.map((tier) => (
                <Card key={tier.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{tier.name}</h3>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {tier.duration_months} Months
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    &#8377;{Number(tier.price).toLocaleString()}
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                    {tier.access_details}
                  </p>
                  <Link to="/membership">
                    <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                      View Tier Privileges &rarr;
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer Section */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0B0D11' }}>
        <div className="container">
          <Card style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            borderColor: 'var(--border-strong)',
            maxWidth: '840px',
            margin: '0 auto',
            backgroundColor: 'var(--surface-card)',
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Ready to Begin Training at GYMKHANA?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Register your member profile today to browse comprehensive movement guides, follow periodized workouts, and coordinate directly with coaching staff.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Create Member Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  Submit An Inquiry
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
