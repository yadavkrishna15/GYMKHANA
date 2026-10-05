import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('GYMKHANA | 404 Page Not Found', 'The requested page could not be located.');

  return (
    <div className="container" style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '520px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--accent-primary-dim)',
          border: '1px solid var(--accent-primary-border)',
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <Dumbbell size={36} />
        </div>

        <span style={{
          fontSize: '0.875rem',
          fontWeight: 700,
          color: 'var(--accent-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Error 404
        </span>

        <h1 style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
          Page Not Located
        </h1>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
          The requested route does not exist or has been restructured. Please verify the URL or return to the platform homepage.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Return to Home
            </Button>
          </Link>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => window.history.back()}>
            Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
}
