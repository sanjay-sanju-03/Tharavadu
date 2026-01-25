import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ memberId: '', name: '', phone: '', email: '', joinYear: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async (searchQuery = '', filterYear = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/members', {
        params: {
          search: searchQuery,
          year: filterYear
        }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers(search, yearFilter);
  };

  const handleEdit = (member) => {
    setEditingMember(member.id);
    setEditForm({ ...member });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/members/${editingMember}`, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        joinYear: editForm.joinYear
      });
      setEditingMember(null);
      fetchMembers(search, yearFilter);
    } catch (error) {
      alert('Error updating member: ' + error.response?.data?.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditForm({});
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!addForm.memberId || !addForm.name || !addForm.phone || !addForm.email || !addForm.joinYear) {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/members', addForm);
      setShowAddModal(false);
      setAddForm({ memberId: '', name: '', phone: '', email: '', joinYear: '' });
      fetchMembers(search, yearFilter);
    } catch (error) {
      alert('Error adding member: ' + error.response?.data?.message);
    }
  };

  const getPaymentStatus = (member, year) => {
    const payment = member.payments?.find(p => p.year === year);
    if (!payment) return '—';
    return payment.status === 'done' ? '✓ Done' : '○ Pending';
  };

  const getPaymentStatusClass = (member, year) => {
    const payment = member.payments?.find(p => p.year === year);
    if (!payment) return '';
    return payment.status === 'done' ? 'status-done' : 'status-pending';
  };

  return (
    <div>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>👥 Members Management</h2>
          <p style={{ color: 'var(--neutral-500)', margin: 0, fontSize: '15px' }}>
            Manage and track all {members.length} community members
          </p>
        </div>
        <button
          className="btn-small"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '14px 28px',
            fontSize: '14px',
            borderRadius: '12px'
          }}
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add New Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍 Search by name, ID, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '280px' }}
          />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{ minWidth: '140px' }}
          >
            <option value="">📅 All Years</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
          <button type="submit">🔍 Search</button>
        </form>
      </div>

      {/* Members Table */}
      <div className="card">
        {loading ? (
          <p className="loading">Loading Members</p>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">👥</span>
            <p>No members found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Join Year</th>
                  <th>2023</th>
                  <th>2024</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td>
                      <span style={{
                        background: 'var(--primary-100)',
                        color: 'var(--primary-700)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        {member.memberId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--neutral-800)' }}>
                        {member.name}
                      </div>
                    </td>
                    <td style={{ color: 'var(--neutral-600)' }}>{member.phone}</td>
                    <td style={{ color: 'var(--neutral-500)', fontSize: '13px' }}>{member.email}</td>
                    <td>
                      <span style={{
                        background: 'var(--neutral-100)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {member.joinYear}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getPaymentStatusClass(member, 2023)}`}>
                        {getPaymentStatus(member, 2023)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getPaymentStatusClass(member, 2024)}`}>
                        {getPaymentStatus(member, 2024)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-small btn-edit"
                        onClick={() => handleEdit(member)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMember && (
        <div className="modal-overlay active">
          <div className="modal">
            <h2>✏️ Edit Member</h2>
            <p>Update the member details below</p>
            <div className="modal-form">
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Member ID</label>
                <input
                  type="text"
                  value={editForm.memberId || ''}
                  disabled
                  style={{ opacity: 0.7 }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Join Year</label>
                <input
                  type="number"
                  placeholder="Enter join year"
                  value={editForm.joinYear || ''}
                  onChange={(e) => setEditForm({ ...editForm, joinYear: parseInt(e.target.value) })}
                />
              </div>
              <div className="modal-form-buttons">
                <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                <button className="btn-save" onClick={handleSaveEdit}>💾 Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay active">
          <div className="modal">
            <h2>➕ Add New Member</h2>
            <p>Fill in all the details to register a new community member</p>
            <form onSubmit={handleAddMember} className="modal-form">
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Member ID</label>
                <input
                  type="text"
                  placeholder="e.g., T007"
                  value={addForm.memberId}
                  onChange={(e) => setAddForm({ ...addForm, memberId: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--neutral-600)'
                }}>Join Year</label>
                <input
                  type="number"
                  placeholder="e.g., 2024"
                  value={addForm.joinYear}
                  onChange={(e) => setAddForm({ ...addForm, joinYear: e.target.value })}
                  required
                />
              </div>
              <div className="modal-form-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({ memberId: '', name: '', phone: '', email: '', joinYear: '' });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">✅ Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Members;
