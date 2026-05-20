import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVerificationReport } from '../services/verificationService';
import { 
  ShieldCheck, ArrowLeft, Printer, Check, X, AlertCircle, Calendar, 
  Mail, Database, CheckSquare, Loader
} from 'lucide-react';

const Report = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getVerificationReport(candidateId);
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to load candidate verification report.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error occurred while loading report details.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [candidateId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader size={40} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px 32px' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-error)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Report Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {error || 'The verification report has not been compiled yet for this candidate.'}
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { candidateDetails, aadhaarResult, panResult, overallStatus } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Action Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* Main Report Document Card */}
      <div className="glass-panel" style={{ padding: '48px', position: 'relative', overflow: 'hidden' }} id="printable-report">
        
        {/* Ribbon Glow depending on overallStatus */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: overallStatus === 'VERIFIED' 
            ? 'linear-gradient(90deg, #10b981, #059669)'
            : 'linear-gradient(90deg, #ef4444, #dc2626)'
        }} />

        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '32px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={28} style={{ color: 'var(--color-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em' }}>vShield Audit Report</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              DIGITAL BACKGROUND VERIFICATION SUMMARY & AUDIT TRAIL
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Ref ID</div>
            <div style={{ fontWeight: '600', fontSize: '0.95rem', fontFamily: 'monospace' }}>
              VSR-{candidateDetails.id.slice(-8).toUpperCase()}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Verified: {new Date(aadhaarResult.verificationDate || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Audit Target Details & Overall Badge */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', flexWrap: 'wrap', marginBottom: '40px' }}>
          
          {/* Target Profile Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Candidate Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</span>
                <p style={{ fontWeight: '600', fontSize: '1.1rem', marginTop: '2px' }}>{candidateDetails.fullName}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</span>
                <p style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> {candidateDetails.email}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date of Birth</span>
                <p style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> {new Date(candidateDetails.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submission Record</span>
                <p style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={14} /> Registered in DB
                </p>
              </div>
            </div>
          </div>

          {/* Overall Audit Result Badge */}
          <div style={{
            background: overallStatus === 'VERIFIED' 
              ? 'var(--color-success-bg)' 
              : 'var(--color-error-bg)',
            border: overallStatus === 'VERIFIED' 
              ? '1px solid var(--color-success-border)' 
              : '1px solid var(--color-error-border)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verification Status
            </span>
            
            {overallStatus === 'VERIFIED' ? (
              <>
                <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={32} />
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', textTransform: 'uppercase' }}>VERIFIED</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>All identity criteria successfully verified against database registries.</p>
              </>
            ) : (
              <>
                <div style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <X size={32} />
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', textTransform: 'uppercase' }}>FAILED</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Identity database matching failed or authentication declined.</p>
              </>
            )}
          </div>
        </div>

        {/* Detailed Gateway Reports (Aadhaar & PAN) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Aadhaar Registry Audit */}
          <div className="glass-panel" style={{ padding: '28px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <CheckSquare size={18} style={{ color: 'var(--color-primary)' }} />
                1. Aadhaar Card Verification (UIDAI Gateway)
              </h4>
              <span className={aadhaarResult.status === 'VERIFIED' ? 'badge badge-pass' : 'badge badge-fail'}>
                {aadhaarResult.status === 'VERIFIED' ? 'UIDAI Cleared' : 'UIDAI Failed'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Aadhaar Number</span>
                  <p style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    XXXX-XXXX-{aadhaarResult.aadhaarNumber.slice(-4)}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gateway Reference ID</span>
                  <p style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    {aadhaarResult.referenceId || 'N/A'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gateway Response</span>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {aadhaarResult.gatewayMessage || (aadhaarResult.status === 'VERIFIED'
                      ? 'Demographic match successful with National Identity Registry.'
                      : 'Verification rejected: Identity not active or details mismatch.')}
                  </p>
                </div>
              </div>

              {/* Extracted data from mock API */}
              {aadhaarResult.extractedData && (
                <div style={{ background: 'rgba(99,102,241,0.04)', borderRadius: '10px', padding: '14px 18px', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extracted Demographic Data</span>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {aadhaarResult.extractedData.nameMatch
                        ? <Check size={15} style={{ color: 'var(--color-success)' }} />
                        : <X size={15} style={{ color: 'var(--color-error)' }} />}
                      <span>Name Match</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {aadhaarResult.extractedData.dobMatch
                        ? <Check size={15} style={{ color: 'var(--color-success)' }} />
                        : <X size={15} style={{ color: 'var(--color-error)' }} />}
                      <span>DOB Match</span>
                    </div>
                    {aadhaarResult.extractedData.gender && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Gender:</span>
                        <span>{aadhaarResult.extractedData.gender}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback checklist when no extracted data */}
              {!aadhaarResult.extractedData && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {aadhaarResult.status === 'VERIFIED'
                        ? <Check size={16} style={{ color: 'var(--color-success)' }} />
                        : <X size={16} style={{ color: 'var(--color-error)' }} />}
                      <span>Identity Status Cleared</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PAN Card Registry Audit */}
          <div className="glass-panel" style={{ padding: '28px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <CheckSquare size={18} style={{ color: 'var(--color-primary)' }} />
                2. PAN Card Registry Verification (NSDL Gateway)
              </h4>
              <span className={panResult.status === 'VERIFIED' ? 'badge badge-pass' : 'badge badge-fail'}>
                {panResult.status === 'VERIFIED' ? 'Registry Checked' : 'NSDL Failed'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered PAN Card</span>
                  <p style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {panResult.panNumber}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gateway Reference ID</span>
                  <p style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    {panResult.referenceId || 'N/A'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gateway Response</span>
                  <p style={{ fontWeight: '500', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {panResult.gatewayMessage || (panResult.status === 'VERIFIED'
                      ? 'Taxpayer active record found in NSDL registry.'
                      : 'Verification rejected: Inactive PAN or taxpayer details mismatch.')}
                  </p>
                </div>
              </div>

              {/* Extracted data from mock API */}
              {panResult.extractedData && (
                <div style={{ background: 'rgba(99,102,241,0.04)', borderRadius: '10px', padding: '14px 18px', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extracted Tax Registry Data</span>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {panResult.extractedData.nameMatch
                        ? <Check size={15} style={{ color: 'var(--color-success)' }} />
                        : <X size={15} style={{ color: 'var(--color-error)' }} />}
                      <span>Name Match</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {panResult.extractedData.dobMatch
                        ? <Check size={15} style={{ color: 'var(--color-success)' }} />
                        : <X size={15} style={{ color: 'var(--color-error)' }} />}
                      <span>DOB Match</span>
                    </div>
                    {panResult.extractedData.category && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Category:</span>
                        <span>{panResult.extractedData.category}</span>
                      </div>
                    )}
                    {panResult.extractedData.panStatus && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-success)' }}>
                        <Check size={15} style={{ color: 'var(--color-success)' }} />
                        <span>PAN {panResult.extractedData.panStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback checklist */}
              {!panResult.extractedData && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                      {panResult.status === 'VERIFIED'
                        ? <Check size={16} style={{ color: 'var(--color-success)' }} />
                        : <X size={16} style={{ color: 'var(--color-error)' }} />}
                      <span>Taxpayer Status Cleared</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Footer Audit Signature */}
        <div style={{ marginTop: '48px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            This report represents a digitized, secure audit compliance record triggered by authenticated agency user context on the vShield Cloud API gateway.
          </p>
          <span style={{ display: 'inline-block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'monospace' }}>
            digital_fingerprint: sha256:{candidateDetails.id}
          </span>
        </div>

      </div>
    </div>
  );
};

export default Report;
