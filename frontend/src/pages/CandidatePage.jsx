import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCandidate } from '../services/verificationService';
import { User, Mail, Calendar, CreditCard, Award, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const SubmitCandidate = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await submitCandidate({
        fullName,
        email,
        dob,
        aadhaarNumber,
        panNumber
      });

      if (response.success) {
        setSuccess(true);
        showToast('Candidate successfully onboarded!', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit candidate details. Please try again.';
      setError(msg);
      showToast(msg, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '700px', margin: '0 auto' }}>
      {/* Back button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="btn btn-secondary"
        style={{ padding: '8px 16px', marginBottom: '24px', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-panel glow-card-indigo" style={{ padding: '40px 32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px' }}>Submit Candidate Profile</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Provide candidate details exactly as printed on their government documents for digital verification checks.
          </p>
        </div>

        {error && (
          <div className="badge-fail" style={{
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            display: 'block',
            textTransform: 'none',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '40px 0',
            textAlign: 'center'
          }}>
            <CheckCircle size={60} style={{ color: 'var(--color-success)' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600' }}>Submission Successful</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Candidate registration complete. Redirecting back to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Jane Mary Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Must match spelling on Aadhaar and PAN records.
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  zIndex: 2
                }} />
                <input
                  type="date"
                  required
                  className="form-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '18px'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Aadhaar Card Number</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }} />
                  <input
                    type="text"
                    required
                    maxLength={12}
                    className="form-input"
                    placeholder="12 digit number"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">PAN Card Number</label>
                <div style={{ position: 'relative' }}>
                  <Award size={18} style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }} />
                  <input
                    type="text"
                    required
                    maxLength={10}
                    className="form-input"
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', marginTop: '16px', height: '50px' }}
            >
              {isLoading ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                'Save and Register Candidate'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitCandidate;
