import { useState } from 'react';
import PayPalButton from '../components/PayPalButton';

const PRESET_AMOUNTS = [10, 20, 50, 100];

export default function Donate() {
  const [amount, setAmount] = useState('10.00');
  const [custom, setCustom] = useState('');
  const [type, setType] = useState('One-Time Donation');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleAmount = (amt: string) => {
    setAmount(amt);
    setCustom('');
  };
  const handleCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^\d.]/g, '');
    setCustom(val);
    setAmount(val);
  };

  return (
    <div className="page-content donate-page" style={{
      maxWidth: 950,
      minHeight: '70vh',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: 'Georgia, serif',
      color: '#222',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2.5rem',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ flex: '1 1 340px', minWidth: 290, maxWidth: 400, marginRight: '1.5rem' }}>
        <h1 style={{ textAlign: 'left', fontWeight: 400, fontSize: '2.2rem', margin: '0 0 1.2rem 0', letterSpacing: '0.01em' }}>Give a high five.</h1>
        <p style={{ textAlign: 'left', margin: '0 0 1.1rem 0', fontSize: '1.13rem' }}>
          Start by giving $5 and take the first steps to ensure housing for all.
        </p>
        <p style={{ textAlign: 'left', margin: '0 0 2.2rem 0', fontSize: '1.08rem', color: '#444' }}>
          As of April 8, 2025, donations are not available at this time.
        </p>
        <div style={{ fontStyle: 'italic', fontSize: '1.04rem', color: '#444', margin: '0 0 0.7rem 0', textAlign: 'left' }}>
          We are a non-profit organization.<br />pending 501(c)(3) status. Your donation is <b>tax deductible.</b><br />100% of proceeds support the mission to fund our housing development operations.
        </div>
        <div style={{ fontSize: '1.01rem', color: '#444', margin: '0 0 0.7rem 0', textAlign: 'left' }}>
          Track how every penny of our funds are spent in our progress page.
        </div>
      </div>
      <div style={{ flex: '1 1 340px', minWidth: 290, maxWidth: 370, background: '#f7f6f3', borderRadius: 22, padding: '2.2rem 1.5rem 2rem 1.5rem', boxShadow: '0 2px 14px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {PRESET_AMOUNTS.map(amt => (
            <button key={amt} onClick={() => handleAmount(amt.toFixed(2))} style={{
              background: amount === amt.toFixed(2) && !custom ? '#111' : '#fff',
              color: amount === amt.toFixed(2) && !custom ? '#fff' : '#111',
              border: '1.5px solid #bbb',
              borderRadius: 8,
              padding: '0.55rem 1.2rem',
              fontWeight: 600,
              fontSize: '1.09rem',
              marginBottom: 6,
              cursor: 'pointer',
              outline: 'none',
              transition: 'background 0.18s, color 0.18s',
            }}> ${amt.toFixed(2)} </button>
          ))}
          <input
            type="text"
            placeholder="Custom Amount"
            value={custom}
            onChange={handleCustom}
            style={{
              border: '1.5px solid #bbb',
              borderRadius: 8,
              padding: '0.55rem 1.2rem',
              fontWeight: 500,
              fontSize: '1.09rem',
              width: 130,
              outline: 'none',
              marginBottom: 6,
              color: '#111',
              background: '#fff',
            }}
          />
        </div>
        <select value={type} onChange={e => setType(e.target.value)} style={{
          width: '100%',
          padding: '0.7rem 0.9rem',
          borderRadius: 8,
          border: '1.5px solid #bbb',
          fontSize: '1.08rem',
          marginBottom: 18,
          fontFamily: 'Georgia, serif',
        }}>
          <option>One-Time Donation</option>
          <option>Monthly Donation</option>
        </select>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.09rem', marginBottom: 18 }}>
          <span>Total</span>
          <span>${amount || '0.00'}</span>
        </div>
        {/* Uncomment below to enable PayPal live integration */}
        {/*
        <PayPalButton
          amount={amount || '0.00'}
          onSuccess={details => setSuccess(true)}
          onError={err => setError('Payment failed. Please try again.')}
          disabled={parseFloat(amount) < 1}
        />
        */}
        <button style={{
          width: '100%',
          padding: '0.9rem 0',
          borderRadius: 12,
          background: '#111',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.15rem',
          border: 'none',
          marginTop: 10,
          cursor: 'not-allowed',
        }} disabled>
          Donate
        </button>
        {success && <div style={{ color: 'green', marginTop: 10 }}>Thank you for your donation!</div>}
        {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      </div>
    </div>
  );
}
