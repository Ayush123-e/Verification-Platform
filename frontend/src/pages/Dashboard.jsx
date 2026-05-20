import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCandidates, getDashboardStats, triggerVerification } from '../services/verificationService';
import { 
  Users, CheckCircle2, AlertTriangle, XCircle, Search, 
  Plus, LogOut, ShieldAlert, Sparkles, Clipboard, ArrowUpRight, Loader
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({
    totalSubmitted: 0,
    pendingVerification: 0,
    totalVerified: 0,
    passed: 0,
    warning: 0,
    failed: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [verifyingMap, setVerifyingMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { user, logoutUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [candidatesData, statsData] = await Promise.all([
        getCandidates(),
        getDashboardStats()
      ]);
      
      if (candidatesData.success) setCandidates(candidatesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logoutUser();
    showToast('Signed out of session.', 'info');
    navigate('/login');
  };

  const handleRunVerification = async (candidateId) => {
    setVerifyingMap(prev => ({ ...prev, [candidateId]: true }));
    showToast('Triggering digital registry checks...', 'info');
    try {
      const response = await triggerVerification(candidateId);
      if (response.success) {
        showToast('Demographic matching audit complete!', 'success');
        await fetchData();
      }
    } catch (err) {
      console.error('Verification error:', err);
      showToast(err.response?.data?.message || 'Verification process failed.', 'error');
    } finally {
      setVerifyingMap(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  // Masking helpers for UI rendering
  const maskAadhaar = (aadhaar) => {
    if (!aadhaar || aadhaar.length < 4) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${aadhaar.slice(-4)}`;
  };

  const maskPAN = (pan) => {
    if (!pan || pan.length < 4) return 'XXXXX-XXXX';
    return `XXXXX${pan.slice(-4)}`;
  };

  // Filtering candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && candidate.status === statusFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <header className="glass-panel" style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        position: 'sticky',
        top: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            padding: '8px',
            borderRadius: '8px',
            color: '#fff',
            display: 'flex'
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: 1 }}>vShield</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verification Portal</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'Administrator'}</p>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.company || 'Company Inc'}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      {/* Content Body */}
      <main style={{ padding: '40px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        
        {/* Banner */}
        <div className="glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.07) 0%, rgba(6, 182, 212, 0.07) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          padding: '28px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              Welcome back to vShield <Sparkles size={20} style={{ color: 'var(--color-secondary)' }} />
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Register new hires and trigger standard biometric and tax registry checks in seconds.
            </p>
          </div>
          <Link to="/submit-candidate" className="btn btn-primary">
            <Plus size={18} /> Register Candidate
          </Link>
        </div>

        {/* Loading placeholder */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0', flex: 1 }}>
            <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : (
          <>
            {/* Stats Metrics Panel */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
                  <Users size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidates</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '2px' }}>{stats.totalSubmitted}</h3>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passed</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '2px' }}>{stats.passed}</h3>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Warnings</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '2px' }}>{stats.warning}</h3>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
                  <XCircle size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failed</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '2px' }}>{stats.failed}</h3>
                </div>
              </div>

            </div>

            {/* Candidates Table Panel */}
            <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Candidate Submissions</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Search Input */}
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '38px', py: '8px', fontSize: '0.85rem', width: '240px' }}
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ py: '8px', fontSize: '0.85rem', width: '160px', background: 'var(--bg-surface)' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Table rendering */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <th style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate</th>
                      <th style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aadhaar Number</th>
                      <th style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PAN Number</th>
                      <th style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Date</th>
                      <th style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Status</th>
                      <th style={{ padding: '16px 12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                          <Clipboard size={36} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                          <p>No candidate records found matching current criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map((candidate) => (
                        <tr key={candidate._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'var(--transition-smooth)' }} 
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.01)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '16px 12px' }}>
                            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{candidate.fullName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{candidate.email}</div>
                          </td>
                          <td style={{ padding: '16px 12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {maskAadhaar(candidate.aadhaarNumber)}
                          </td>
                          <td style={{ padding: '16px 12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {maskPAN(candidate.panNumber)}
                          </td>
                          <td style={{ padding: '16px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(candidate.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td style={{ padding: '16px 12px' }}>
                            {candidate.status === 'pending' && <span className="badge badge-pending">Pending</span>}
                            {candidate.status === 'completed' && <span className="badge badge-pass">Success</span>}
                            {candidate.status === 'failed' && <span className="badge badge-fail">Failed</span>}
                          </td>
                          <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                            {candidate.status === 'pending' ? (
                              <button
                                onClick={() => handleRunVerification(candidate._id)}
                                className="btn btn-primary"
                                disabled={verifyingMap[candidate._id]}
                                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                              >
                                {verifyingMap[candidate._id] ? (
                                  <>
                                    <Loader size={14} className="animate-spin" /> Verifying...
                                  </>
                                ) : (
                                  'Run verification'
                                )}
                              </button>
                            ) : (
                              <Link
                                to={`/report/${candidate._id}`}
                                className="btn btn-secondary"
                                style={{ padding: '8px 16px', fontSize: '0.8rem', gap: '4px' }}
                              >
                                View Report <ArrowUpRight size={14} />
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
