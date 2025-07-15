import { useEffect, useState, useRef } from 'react';
import amountImg from '../assets/amount.png';
import homeImg from '../assets/home.png';
import './Progress.css';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="progress-container">
      <div className="progress-stat-block">
        <img src={amountImg} alt="Amount Raised" />
        <div className="progress-stat-text">
          <div className="progress-stat-title">total amount raised</div>
          <div className="progress-stat-value">
            {amount !== null ? `$${displayAmount.toLocaleString()}` : '...'}
          </div>
        </div>
      </div>
      <div className="progress-stat-block">
        <img src={homeImg} alt="Homes Built" />
        <div className="progress-stat-text">
          <div className="progress-stat-title">total homes built</div>
          <div className="progress-stat-value">{homesBuilt}</div>
        </div>
      </div>
      <div className="progress-date">
        as of: {formatDisplayDate(lastTransactionDate)}.
      </div>
    </div>
  );
}