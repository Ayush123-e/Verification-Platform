import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Floating Toast Notification Containers */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: 'calc(100% - 48px)'
      }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            border: toast.type === 'success' 
              ? '1px solid rgba(16, 185, 129, 0.25)' 
              : toast.type === 'error'
              ? '1px solid rgba(239, 68, 68, 0.25)'
              : '1px solid rgba(59, 130, 246, 0.25)',
            boxShadow: toast.type === 'success'
              ? '0 8px 30px rgba(16, 185, 129, 0.15)'
              : toast.type === 'error'
              ? '0 8px 30px rgba(239, 68, 68, 0.15)'
              : '0 8px 30px rgba(59, 130, 246, 0.15)',
            animation: 'toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {toast.type === 'success' && <CheckCircle size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />}
              {toast.type === 'error' && <XCircle size={20} style={{ color: 'var(--color-error)', flexShrink: 0 }} />}
              {toast.type === 'info' && <Info size={20} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />}
              
              <span style={{ fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.4' }}>
                {toast.message}
              </span>
            </div>
            
            <button 
              onClick={() => removeToast(toast.id)} 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
