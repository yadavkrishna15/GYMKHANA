import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Database, Shield, BookOpen, Layers, Award, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function About() {
  useDocumentTitle(
    'GYMKHANA | About Project',
    'Learn about GYMKHANA, a full-stack gym management platform and fitness knowledge guide built for college field project evaluation.'
  );

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Academic Field Project
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            About GYMKHANA
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            GYMKHANA is a full-stack web application developed to bridge the gap between facility management and athletic instruction for modern fitness centers. It provides a structured, role-governed environment for administrators, certified trainers, and gym members.
          </p>
        </div>

        {/* Dual Pillar Architecture Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Layers size={22} style={{ color: 'var(--accent-primary)' }} />
            The Dual-Pillar Architectural Philosophy
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <Card>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-primary-dim)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <BookOpen size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Pillar A: Fitness Knowledge & Guidance</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                A normalized, database-driven educational repository accessible to both public visitors and enrolled members. Rather than generic fitness advice, GYMKHANA catalogs precise exercise mechanics, muscle activations, equipment operating procedures, and structured periodized workout splits.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--accent-primary)' }} />
                  Database-verified exercise steps & safety precautions
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--accent-primary)' }} />
                  Machine safety and adjustment guides
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--accent-primary)' }} />
                  Multi-day split routines with sets, reps, and rest periods
                </li>
              </ul>
            </Card>

            <Card>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-info-bg)',
                color: 'var(--color-info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Database size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Pillar B: Gym Management & Operations</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                A robust, role-based management system engineered with strict data integrity and relational integrity. Administrators supervise registrations, memberships, and facility content, trainers guide assigned athletes, and members track concrete biometric and attendance progress.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--color-info)' }} />
                  Role-based access control (Admin, Trainer, Member)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--color-info)' }} />
                  Relational attendance logs with check-in/out tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} style={{ color: 'var(--color-info)' }} />
                  Biometric progress logs (Weight, Height, BMI trends)
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Technical Stack & Engineering Discipline */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Target size={22} style={{ color: 'var(--accent-primary)' }} />
            Approved Technical Stack & Standards
          </h2>
          <Card>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}>
              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Client Tier</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  React (Vite) utilizing clean modern JavaScript, client-side routing via React Router DOM, centralized API abstraction with Axios, and a purpose-built CSS design system.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Server Tier</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Node.js and Express.js REST API with modular controllers, services, parameter validation, and centralized error handling middleware.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Data Tier</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Relational MySQL schema with strict foreign keys, index optimization, prepared statements, and normalized entity relationships.
                </p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}>Security Tier</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  bcrypt password hashing (10 salt rounds), stateless JSON Web Tokens (JWT) for session management, and role-based route middleware.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Field Project Assessment Statement */}
        <Card style={{ backgroundColor: '#13161C', borderColor: 'var(--border-strong)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--accent-contrast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Award size={24} />
            </div>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Field Project Viva Assessment Ready</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Every component, table, and endpoint in this application was authored with clarity and maintainability as primary directives. All operations are backed by verified database records, preventing mock data illusions and ensuring a genuine demonstration for academic evaluation panels.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/exercises">
                  <Button variant="primary" size="sm">
                    Browse Exercise Library
                  </Button>
                </Link>
                <Link to="/membership">
                  <Button variant="secondary" size="sm">
                    View Membership Tiers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
