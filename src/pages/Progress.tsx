import { useEffect, useState, useRef } from 'react';

function formatDisplayDate(isoString: string | null): string {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Progress() {
  const [amount, setAmount] = useState<number | null>(null);
  const [homesBuilt, setHomesBuilt] = useState<number>(0);
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [lastTransactionDate, setLastTransactionDate] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);

  // Fetch the real amount (placeholder for now)
  useEffect(() => {
    fetch('/.netlify/functions/paypal-total')
      .then(res => res.json())
      .then(data => {
        setAmount(data.total);
        setLastTransactionDate(data.last_transaction_date || null);
      })
      .catch(() => {
        setAmount(0);
        setLastTransactionDate(null);
      });
    setHomesBuilt(0);
  }, []);

  // Animate the counter up to the amount
  useEffect(() => {
    if (amount === null) return;
    if (animationRef.current) clearInterval(animationRef.current);
    setDisplayAmount(0);
    const duration = 1200; // ms
    const frameRate = 30; // ms
    const steps = Math.ceil(duration / frameRate);
    let currentStep = 0;
    animationRef.current = window.setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const value = Math.floor(progress * amount);
      setDisplayAmount(value);
      if (progress === 1) {
        if (animationRef.current) clearInterval(animationRef.current);
      }
    }, frameRate);
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [amount]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        color: '#111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4rem' }}>
        <img
          src="/public/assets/amount.png"
          alt="Amount Raised"
          style={{ width: 260, height: 260, objectFit: 'contain', marginRight: 80, background: '#f7f6f3', borderRadius: 16 }}
        />
        <div>
          <div style={{ fontSize: '2rem', marginBottom: '1.2rem' }}>total amount raised</div>
          <div style={{ fontSize: '4.5rem', fontWeight: 400 }}>
            {amount !== null ? `$${displayAmount.toLocaleString()}` : '...'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/public/assets/home.png"
          alt="Homes Built"
          style={{ width: 260, height: 260, objectFit: 'contain', marginRight: 80, background: '#f7f6f3', borderRadius: 16 }}
        />
        <div>
          <div style={{ fontSize: '2rem', marginBottom: '1.2rem' }}>total homes built</div>
          <div style={{ fontSize: '4.5rem', fontWeight: 400 }}>{homesBuilt}</div>
        </div>
      </div>
      <div style={{ marginTop: '3rem', fontStyle: 'italic', fontSize: '1.1rem', color: '#888' }}>
        as of: {formatDisplayDate(lastTransactionDate)}.
      </div>
    </div>
  );
}