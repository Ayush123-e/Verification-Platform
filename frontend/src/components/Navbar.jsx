import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    showToast('Signed out of session.', 'info');
    navigate('/login');
  };

  return (
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
      {/* Brand */}
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
          padding: '8px', borderRadius: '8px', color: '#fff', display: 'flex'
        }}>
          <ShieldAlert size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '700', lineHeight: 1 }}>vShield</h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Verification Portal</span>
        </div>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/submit-candidate" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
          <Plus size={16} /> Register Candidate
        </Link>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user?.name || 'Administrator'}</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.company || 'Company Inc'}</span>
        </div>

        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
