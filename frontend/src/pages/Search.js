import React, { useState } from 'react';
import api from '../api';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) { setResults([]); return; }

    setLoading(true);
    try {
      const membersResponse = await api.get('/members', { params: { search: searchQuery } });
      let combinedResults = [];

      if (searchType === 'all' || searchType === 'members') {
        combinedResults = membersResponse.data.map(member => ({ type: 'member', ...member }));
      }

      if ((searchType === 'all' || searchType === 'payments') && searchQuery) {
        const paymentsResponse = await api.get('/payments', { params: { search: searchQuery } });
        const paymentResults = paymentsResponse.data.map(payment => ({ type: 'payment', ...payment }));
        combinedResults = [...combinedResults, ...paymentResults];
      }

      setResults(combinedResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const memberResults = results.filter(r => r.type === 'member');
  const paymentResults = results.filter(r => r.type === 'payment');

  return (
    <div>
      <h2>🔍 Comprehensive Search</h2>
      <p style={{ color: 'var(--neutral-500)', marginBottom: '32px', fontSize: '16px' }}>
        Search across all members and payment records instantly
      </p>

      {/* Search Box */}
      <div className="search-bar" style={{ background: 'linear-gradient(145deg, #ffffff, #f8faff)', border: '2px solid rgba(99,102,241,0.12)', marginBottom: '32px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <input
              type="text" placeholder="Type to search by Name, ID, Phone, or Email..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus
              style={{ width: '100%', paddingLeft: '52px', fontSize: '16px', border: '2px solid var(--neutral-200)' }}
            />
            <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', opacity: 0.4 }}>🔍</span>
          </div>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ minWidth: '180px' }}>
            <option value="all">📋 All Records</option>
            <option value="members">👥 Members Only</option>
            <option value="payments">💳 Payments Only</option>
          </select>
          <button type="submit" style={{ minWidth: '150px' }}>🔍 Search</button>
        </form>
      </div>

      {/* Loading */}
      {loading && <div className="card"><p className="loading">Searching</p></div>}

      {/* Results */}
      {hasSearched && !loading && (
        <>
          {/* Summary badges */}
          {results.length > 0 && (
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
              {[
                { icon: '📊', label: 'Total Results', count: results.length, bg: 'linear-gradient(145deg, #ffffff, #f8faff)', border: 'rgba(99,102,241,0.1)', textColor: 'var(--neutral-800)', labelColor: 'var(--neutral-500)' },
                ...(memberResults.length > 0 ? [{ icon: '👥', label: 'Members', count: memberResults.length, bg: 'linear-gradient(145deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))', border: 'rgba(99,102,241,0.15)', textColor: 'var(--primary-700)', labelColor: 'var(--primary-600)' }] : []),
                ...(paymentResults.length > 0 ? [{ icon: '💳', label: 'Payments', count: paymentResults.length, bg: 'linear-gradient(145deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))', border: 'rgba(16,185,129,0.15)', textColor: '#047857', labelColor: '#059669' }] : [])
              ].map(({ icon, label, count, bg, border, textColor, labelColor }) => (
                <div key={label} style={{ background: bg, padding: '16px 24px', borderRadius: '16px', border: `1px solid ${border}`, boxShadow: 'var(--shadow-soft)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ fontSize: '28px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))', borderRadius: '12px' }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: '12px', color: labelColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: textColor, letterSpacing: '-1px' }}>{count}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {results.length === 0 && (
            <div className="card">
              <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px', filter: 'grayscale(0.3)' }}>🔍</div>
                <h3 style={{ color: 'var(--neutral-700)', marginBottom: '10px', fontSize: '20px', fontWeight: '700' }}>No results found</h3>
                <p style={{ color: 'var(--neutral-500)', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
                  We couldn't find any matches for "{searchQuery}". Try a different search term.
                </p>
              </div>
            </div>
          )}

          {/* Members table */}
          {memberResults.length > 0 && (
            <div className="card" style={{ marginBottom: '28px' }}>
              <h3>👥 Members ({memberResults.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr><th>Member ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Join Year</th><th>2023</th><th>2024</th></tr>
                  </thead>
                  <tbody>
                    {memberResults.map(member => (
                      <tr key={member.id}>
                        <td>
                          <span style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))', color: 'var(--primary-700)', padding: '8px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', border: '1px solid var(--primary-200)' }}>
                            {member.memberId}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600', color: 'var(--neutral-800)' }}>{member.name}</td>
                        <td style={{ color: 'var(--neutral-600)' }}>{member.phone}</td>
                        <td style={{ color: 'var(--neutral-500)', fontSize: '13px' }}>{member.email}</td>
                        <td>
                          <span style={{ background: 'var(--neutral-100)', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '13px' }}>{member.joinYear}</span>
                        </td>
                        <td>
                          {member.payments?.find(p => p.year === 2023)?.status === 'done'
                            ? <span className="status-badge status-done">✓ Done</span>
                            : <span className="status-badge status-pending">○ Pending</span>}
                        </td>
                        <td>
                          {member.payments?.find(p => p.year === 2024)?.status === 'done'
                            ? <span className="status-badge status-done">✓ Done</span>
                            : <span className="status-badge status-pending">○ Pending</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments table */}
          {paymentResults.length > 0 && (
            <div className="card">
              <h3>💳 Payments ({paymentResults.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr><th>Member</th><th>Year</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {paymentResults.map(payment => (
                      <tr key={payment.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))', color: 'var(--primary-700)', padding: '8px 14px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', border: '1px solid var(--primary-200)', display: 'inline-block' }}>
                              {payment.memberId}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>{payment.memberName}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ background: 'var(--neutral-100)', padding: '8px 16px', borderRadius: '10px', fontWeight: '700' }}>{payment.year}</span>
                        </td>
                        <td style={{ fontWeight: '700', color: 'var(--neutral-800)', fontSize: '16px' }}>₹{payment.amount.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`status-badge ${payment.status === 'done' ? 'status-done' : 'status-pending'}`}>
                            {payment.status === 'done' ? '✓ Completed' : '○ Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Initial state */}
      {!hasSearched && !loading && (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '90px', marginBottom: '24px', display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>🔎</div>
            <h3 style={{ color: 'var(--neutral-800)', marginBottom: '12px', fontSize: '24px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>Start Your Search</h3>
            <p style={{ fontSize: '15px', maxWidth: '450px', margin: '0 auto 32px', lineHeight: '1.7', color: 'var(--neutral-500)' }}>
              Search across all community members and their payment records.
              Try searching by name, member ID, phone number, or email address.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[['Ravi', 'var(--primary-100)', 'var(--primary-200)', 'var(--primary-700)'],
              ['T001', '#d1fae5', '#6ee7b7', '#047857'],
              ['9876', '#fef3c7', '#fcd34d', '#92400e']].map(([s, bg, border, color]) => (
                <button key={s} type="button"
                  style={{ background: `linear-gradient(135deg, ${bg}, ${bg})`, padding: '12px 22px', borderRadius: '25px', fontSize: '14px', fontWeight: '600', border: `1px solid ${border}`, color, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => setSearchQuery(s)}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span>💡</span> Try "{s}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }`}</style>
    </div>
  );
}

export default Search;
