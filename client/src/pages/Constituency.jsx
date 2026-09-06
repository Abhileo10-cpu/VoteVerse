import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Constituency = () => {
  const [constituencies, setConstituencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/constituency');

        if (!response.ok) {
          throw new Error(`Server status ${response.status}`);
        }

        const data = await response.json();
        setConstituencies(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, []);

  const filtered = constituencies.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    const nameMatch = item.name && item.name.toLowerCase().includes(term);
    const districtMatch = item.district && item.district.toLowerCase().includes(term);
    const numMatch = item.constituencyNumber && item.constituencyNumber.toString().includes(term);

    return nameMatch || districtMatch || numMatch;
  });

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>WEST BENGAL ASSEMBLY</span>
            <h1 style={{ fontSize: '32px', margin: '4px 0', color: '#1e293b' }}>Select Constituency</h1>
            <p style={{ color: '#64748b', margin: 0 }}>Choose your constituency to view candidates and cast your vote.</p>
          </div>

          <input
            type="text"
            placeholder="Search constituency or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px',
              width: '320px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>

        <p style={{ fontWeight: '600', color: '#334155', marginBottom: '16px' }}>
          {filtered.length} Constituencies Available
        </p>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading constituencies from database...</p>
        ) : error ? (
          <p style={{ color: '#ef4444' }}>Error: {error}. Please verify server is running on port 5000.</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#64748b' }}>No constituencies found matching "{searchTerm}".</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px'
            }}
          >
            {filtered.map((c) => (
              <div
                key={c._id || c.id}
                onClick={() => navigate(`/vote?constituency=${encodeURIComponent(c.name)}`)}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>
                  No. {c.constituencyNumber || '-'}
                </span>
                <h3 style={{ fontSize: '18px', margin: '6px 0', color: '#0f172a' }}>{c.name}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>District: {c.district || 'West Bengal'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Constituency;