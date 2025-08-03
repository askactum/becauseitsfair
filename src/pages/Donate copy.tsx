import { useState } from 'react';
import './Donate.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PRESET_AMOUNTS = [5, 20, 50, 100];

// Updated to use PayPal integration with .env for the client ID
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function Donate() {
  const [amount, setAmount] = useState('10.00');
  const [custom, setCustom] = useState('');
  const [type, setType] = useState('One-Time Donation');
  const [success] = useState(false);
  const [error] = useState('');

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
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
      <div className="page-content donate-page" style={{
        maxWidth: 950,
        minHeight: '70vh',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'Georgia, serif',
        color: '#222',
      }}>
        <div className="text-content">
          <h1 style={{ textAlign: 'left', fontWeight: 400, fontSize: '2.2rem', margin: '0 0 1.2rem 0', letterSpacing: '0.01em' }}>Give a high five.</h1>
          <p style={{ textAlign: 'left', margin: '0 0 1.1rem 0', fontSize: '1.35rem' }}>
            Start by giving $5 and take the first steps to ensure housing for all.
          </p>
          <p style={{ textAlign: 'left', margin: '0 0 2.2rem 0', fontSize: '1.35rem', color: '#444' }}>
            As of April 8, 2025, donations are not available at this time.
          </p>
          <div style={{ fontStyle: 'italic', fontSize: '1.35rem', color: '#444', margin: '0 0 0.7rem 0', textAlign: 'left' }}>
            We are a non-profit organization.<br />pending 501(c)(3) status. Your donation is <b>tax deductible.</b><br />100% of proceeds support the mission to fund our housing development operations.
          </div>
          <div style={{ fontSize: '1.35rem', color: '#444', margin: '0 0 0.7rem 0', textAlign: 'left' }}>
            Track how every penny of our funds are spent in our progress page.
          </div>
        </div>
        <div className="donation-box">
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
          <PayPalButtons
            style={{ layout: 'vertical' }}
            createOrder={(data: Record<string, unknown>, actions: any) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: amount || '0.00',
                  },
                }],
              });
            }}
            onApprove={(data: Record<string, unknown>, actions: any) => {
              return actions.order.capture().then((details: Record<string, unknown>) => {
                console.log('Order ID:', details.id);
                alert('Thank you for your donation!');
              });
            }}
            onError={(err: Record<string, unknown>) => {
              console.error('PayPal Checkout Error:', err);
              alert('An error occurred during the payment process.');
            }}
          />
          {success && <div style={{ color: 'green', marginTop: 10 }}>Thank you for your donation!</div>}
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
