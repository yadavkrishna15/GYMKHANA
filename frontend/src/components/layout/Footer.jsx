import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#0A0C0F',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--accent-contrast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}>
                <Dumbbell size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                GYMKHANA
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
              A dual-pillar gym management platform and fitness knowledge guide providing structured workout plans, equipment directories, and member progress tracking.
            </p>
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.625rem',
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: 'var(--accent-primary)',
              fontWeight: 600,
            }}>
              College Field Project System
            </div>
          </div>

          {/* Quick Links: Fitness Library */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Fitness Guide
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <li>
                <Link to="/exercises" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Exercise Library
                </Link>
              </li>
              <li>
                <Link to="/equipment" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Equipment Directory
                </Link>
              </li>
              <li>
                <Link to="/workout-plans" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Workout Plans
                </Link>
              </li>
              <li>
                <Link to="/trainers" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Certified Trainers
                </Link>
              </li>
              <li>
                <Link to="/calculator" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Fitness Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Gym & Platform */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Gym Management
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <li>
                <Link to="/about" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  About GYMKHANA
                </Link>
              </li>
              <li>
                <Link to="/membership" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Membership Tiers
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Member Portal Login
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Facility & Contact Details */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Facility & Inquiries
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <MapPin size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>Sector 4 Campus Athletic Complex</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem' }}>
                <Phone size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <a href="tel:+919876543210" style={{ color: 'var(--text-secondary)' }}>
                  +91 98765 43210
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem' }}>
                <Mail size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <a href="mailto:support@gymkhana.local" style={{ color: 'var(--text-secondary)' }}>
                  support@gymkhana.local
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Viva Attribution */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            &copy; {currentYear} GYMKHANA. All rights reserved. Built as a College Field Project for viva assessment.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: 'var(--text-muted)' }}>Project Architecture</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)' }}>Feedback Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
