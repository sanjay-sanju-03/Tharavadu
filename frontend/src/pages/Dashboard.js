import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="loading">Loading Dashboard</p>
      </div>
    );
  }

  const stats2023 = {
    done: data?.paymentsByYear['2023']?.filter(p => p.status === 'done').length || 0,
    pending: data?.paymentsByYear['2023']?.filter(p => p.status === 'not done').length || 0
  };

  const stats2024 = {
    done: data?.paymentsByYear['2024']?.filter(p => p.status === 'done').length || 0,
    pending: data?.paymentsByYear['2024']?.filter(p => p.status === 'not done').length || 0
  };

  const totalPayments = stats2023.done + stats2023.pending + stats2024.done + stats2024.pending;
  const completionRate = totalPayments > 0
    ? Math.round(((stats2023.done + stats2024.done) / totalPayments) * 100)
    : 0;

  return (
    <div>
      <h2>📊 Dashboard Overview</h2>
      <p style={{ color: 'var(--neutral-500)', marginBottom: '36px', fontSize: '16px' }}>
        Welcome back! Here's a quick summary of your Tharavad community.
      </p>

      {/* Stats Grid */}
      <div className="dashboard-grid" style={{ marginBottom: '40px' }}>
        <div className="stat-card">
          <h3>👥 Total Members</h3>
          <div className="value">{data?.totalMembers || 0}</div>
          <p>Active community members</p>
        </div>

        <div className="stat-card">
          <h3>✅ 2023 Completed</h3>
          <div className="value">{stats2023.done}</div>
          <p>of {stats2023.done + stats2023.pending} payments</p>
        </div>

        <div className="stat-card">
          <h3>⏳ 2023 Pending</h3>
          <div className="value">{stats2023.pending}</div>
          <p>awaiting payment</p>
        </div>

        <div className="stat-card">
          <h3>✅ 2024 Completed</h3>
          <div className="value">{stats2024.done}</div>
          <p>of {stats2024.done + stats2024.pending} payments</p>
        </div>

        <div className="stat-card">
          <h3>⏳ 2024 Pending</h3>
          <div className="value">{stats2024.pending}</div>
          <p>awaiting payment</p>
        </div>

        <div className="stat-card">
          <h3>💰 Total Collected</h3>
          <div className="value">₹{(data?.totalCollected || 0).toLocaleString('en-IN')}</div>
          <p>year-to-date revenue</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="card" style={{
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
        border: '2px solid rgba(99, 102, 241, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h3 style={{
              marginBottom: '8px',
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--neutral-800)'
            }}>
              📈 Overall Completion Rate
            </h3>
            <p style={{ color: 'var(--neutral-500)', margin: 0, fontSize: '15px' }}>
              {stats2023.done + stats2024.done} of {totalPayments} payments completed successfully
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '240px',
              height: '14px',
              background: 'var(--neutral-200)',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: `${completionRate}%`,
                height: '100%',
                background: completionRate >= 70
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : completionRate >= 50
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : 'linear-gradient(90deg, #ef4444, #f87171)',
                borderRadius: '999px',
                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: completionRate >= 70
                  ? '0 0 12px rgba(16, 185, 129, 0.5)'
                  : completionRate >= 50
                    ? '0 0 12px rgba(245, 158, 11, 0.5)'
                    : '0 0 12px rgba(239, 68, 68, 0.5)'
              }} />
            </div>
            <span style={{
              fontSize: '32px',
              fontWeight: '800',
              fontFamily: 'var(--font-display)',
              color: completionRate >= 70 ? '#059669' : completionRate >= 50 ? '#d97706' : '#dc2626',
              letterSpacing: '-1px'
            }}>
              {completionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Payment Details Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
        {/* 2023 Payments */}
        <div className="card">
          <h3>📅 2023 Payment Details</h3>
          {data?.paymentsByYear['2023']?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.paymentsByYear['2023']?.map(p => (
                    <tr key={p.id}>
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
                          #{p.memberId}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', fontSize: '15px' }}>
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`status-badge ${p.status === 'done' ? 'status-done' : 'status-pending'}`}>
                          {p.status === 'done' ? '✓ Done' : '○ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">📭</span>
              <p>No payment data available</p>
            </div>
          )}
        </div>

        {/* 2024 Payments */}
        <div className="card">
          <h3>📅 2024 Payment Details</h3>
          {data?.paymentsByYear['2024']?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.paymentsByYear['2024']?.map(p => (
                    <tr key={p.id}>
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
                          #{p.memberId}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', fontSize: '15px' }}>
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className={`status-badge ${p.status === 'done' ? 'status-done' : 'status-pending'}`}>
                          {p.status === 'done' ? '✓ Done' : '○ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">📭</span>
              <p>No payment data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
