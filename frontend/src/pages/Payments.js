import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Payments() {
  const [payments, setPayments] = useState([]);
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async (filterYear = '', filterStatus = '', searchQuery = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/payments', {
        params: {
          year: filterYear,
          status: filterStatus,
          search: searchQuery
        }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
    setLoading(false);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchPayments(year, status, search);
  };

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/${paymentId}`, {
        status: newStatus
      });
      fetchPayments(year, status, search);
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const completedPayments = payments.filter(p => p.status === 'done');
  const pendingPayments = payments.filter(p => p.status !== 'done');
  const collectedAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h2>💳 Payment Tracking</h2>
      <p style={{ color: 'var(--neutral-500)', marginBottom: '32px', fontSize: '16px' }}>
        Track and manage payment status for all community members
      </p>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
          padding: '24px 28px',
          borderRadius: '20px',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-primary)'
          }} />
          <div style={{ fontSize: '13px', color: 'var(--neutral-500)', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📊 Total Payments
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--neutral-800)', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
            {payments.length}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)',
          padding: '24px 28px',
          borderRadius: '20px',
          border: '1px solid #6ee7b7',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-success)'
          }} />
          <div style={{ fontSize: '13px', color: '#059669', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ✓ Completed
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#047857', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
            {completedPayments.length}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)',
          padding: '24px 28px',
          borderRadius: '20px',
          border: '1px solid #fcd34d',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'var(--gradient-warning)'
          }} />
          <div style={{ fontSize: '13px', color: '#b45309', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ○ Pending
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#92400e', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
            {pendingPayments.length}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)',
          padding: '24px 28px',
          borderRadius: '20px',
          border: '1px solid #c4b5fd',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8b5cf6, #a855f7)'
          }} />
          <div style={{ fontSize: '13px', color: '#7c3aed', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            💰 Collected
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#6d28d9', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
            ₹{collectedAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="search-bar">
        <form onSubmit={handleFilter}>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">📅 All Years</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ minWidth: '170px' }}
          >
            <option value="">📊 All Status</option>
            <option value="done">✅ Completed</option>
            <option value="not done">⏳ Pending</option>
          </select>
          <input
            type="text"
            placeholder="🔍 Search by member name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '240px' }}
          />
          <button type="submit">🔍 Filter</button>
        </form>
      </div>

      {/* Payments Table */}
      <div className="card">
        {loading ? (
          <p className="loading">Loading Payments</p>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">💳</span>
            <p style={{ marginTop: '8px', fontSize: '16px' }}>No payments found</p>
            <p style={{ color: 'var(--neutral-400)', fontSize: '14px' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Year</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>
                      <span style={{
                        background: 'linear-gradient(135deg, var(--primary-100), var(--primary-50))',
                        color: 'var(--primary-700)',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '13px',
                        border: '1px solid var(--primary-200)'
                      }}>
                        #{payment.memberId}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        background: 'var(--neutral-100)',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}>
                        {payment.year}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: '800',
                        fontSize: '16px',
                        color: 'var(--neutral-800)'
                      }}>
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${payment.status === 'done' ? 'status-done' : 'status-pending'}`}>
                        {payment.status === 'done' ? '✓ Completed' : '○ Pending'}
                      </span>
                    </td>
                    <td>
                      {payment.status === 'done' ? (
                        <button
                          className="btn-small"
                          style={{
                            background: 'var(--neutral-100)',
                            color: 'var(--neutral-700)',
                            border: '2px solid var(--neutral-200)',
                            boxShadow: 'none'
                          }}
                          onClick={() => updatePaymentStatus(payment.id, 'not done')}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--neutral-200)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'var(--neutral-100)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          ↩ Mark Pending
                        </button>
                      ) : (
                        <button
                          className="btn-small"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          }}
                          onClick={() => updatePaymentStatus(payment.id, 'done')}
                        >
                          ✓ Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {payments.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '20px 28px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ fontSize: '14px', color: 'var(--neutral-600)', fontWeight: '600' }}>
            📋 Showing {payments.length} payment{payments.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Collected: </span>
              <span style={{ fontWeight: '800', color: '#059669' }}>₹{collectedAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ fontSize: '14px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Pending: </span>
              <span style={{ fontWeight: '800', color: '#b45309' }}>₹{pendingAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
