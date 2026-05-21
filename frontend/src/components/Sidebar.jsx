import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ShieldCheck } from 'lucide-react';

const navItems = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/submit-candidate', icon: UserPlus,         label: 'Register Candidate' },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="glass-panel" style={{
      width: '220px',
      minHeight: '100vh',
      borderRadius: 0,
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      padding: '24px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'sticky',
      top: 0
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginBottom: '16px' }}>
        <ShieldCheck size={22} style={{ color: 'var(--color-primary)' }} />
        <span style={{ fontWeight: '700', fontSize: '1rem' }}>vShield</span>
      </div>

      {/* Nav links */}
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to;
        return (
          <Link key={to} to={to} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '0.9rem', fontWeight: isActive ? '600' : '400',
            color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
            background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
            transition: 'var(--transition-smooth)'
          }}>
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
