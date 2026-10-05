import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Search, Filter, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { FormInput, FormSelect } from '../../components/ui/FormControls';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import api from '../../services/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export default function Equipment() {
  useDocumentTitle('GYMKHANA | Equipment', 'Explore GYMKHANA facility equipment, cable stations, free weights, and biomechanical machines.');

  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [bodyPartFilter, setBodyPartFilter] = useState('');

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/equipment');
      if (res.success) {
        setEquipmentList(res.data?.equipment || []);
      } else {
        setError(res.error?.message || 'Failed to load equipment catalog');
      }
    } catch (err) {
      setError(err.message || 'Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const categories = Array.from(new Set(equipmentList.map((eq) => eq.category).filter(Boolean)));
  const bodyParts = Array.from(new Set(equipmentList.map((eq) => eq.target_body_part).filter(Boolean)));

  const filtered = equipmentList.filter((eq) => {
    const matchesSearch =
      eq.name?.toLowerCase().includes(search.toLowerCase()) ||
      eq.description?.toLowerCase().includes(search.toLowerCase()) ||
      eq.category?.toLowerCase().includes(search.toLowerCase()) ||
      eq.target_body_part?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !categoryFilter || eq.category === categoryFilter;
    const matchesPart = !bodyPartFilter || eq.target_body_part === bodyPartFilter;
    return matchesSearch && matchesCat && matchesPart;
  });

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '740px', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Facility Machinery &amp; Apparatus
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Gym Equipment Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Familiarize yourself with our facility's pin-selected machines, plate-loaded apparatus, free weight stations, and safety adjustment mechanisms.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
          backgroundColor: 'var(--surface-card)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
        }}>
          <FormInput
            id="equipmentSearch"
            placeholder="Search equipment by name or purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormSelect
            id="categoryFilter"
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />

          <FormSelect
            id="bodyPartFilter"
            placeholder="All Target Body Parts"
            value={bodyPartFilter}
            onChange={(e) => setBodyPartFilter(e.target.value)}
            options={bodyParts.map((b) => ({ value: b, label: b }))}
          />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" label="Cataloging facility machines..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchEquipment} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No equipment matched your filters"
            description="Clear your keyword or category selections to view all facility machines."
            actionText="Reset Filters"
            onAction={() => {
              setSearch('');
              setCategoryFilter('');
              setBodyPartFilter('');
            }}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            {filtered.map((item) => (
              <Link key={item.id} to={`/equipment/${item.id}`} style={{ textDecoration: 'none' }}>
                <Card interactive style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {item.image_url ? (
                    <div style={{
                      height: '180px',
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#12151B',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:0.875rem;">${item.category}</div>`;
                        }}
                      />
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: '#1E222B', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {item.target_body_part}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {item.name}
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.875rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-muted)',
                  }}>
                    <span>Target: {item.target_body_part}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                      Operational Manual &rarr;
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
