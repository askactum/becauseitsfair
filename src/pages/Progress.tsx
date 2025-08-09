import { useEffect, useState, useRef } from 'react';
import amountImg from '../assets/moneyGIF.gif';
import homeImg from '../assets/homeGIF.gif';
import './Progress.css';
import { supabase } from '../supabaseClient';

const CACHE_KEY = 'paypalTotalCache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheData {
  amount: number;
  lastTransactionDate: string | null;
  timestamp: number;
}

function getCachedData(): CacheData | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  const data = JSON.parse(cached);
  if (Date.now() - data.timestamp > CACHE_TTL) return null;
  return data;
}

function setCachedData(amount: number, lastTransactionDate: string | null) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    amount,
    lastTransactionDate,
    timestamp: Date.now()
  }));
}

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

  useEffect(() => {
    const handleResize = () => {
      // Removed: setIsMobile(window.innerWidth <= 700);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch donation data from Supabase with caching
  useEffect(() => {
    // Try to get cached data first
    const cached = getCachedData();
    if (cached) {
      setAmount(cached.amount);
      setLastTransactionDate(cached.lastTransactionDate);
    }

    // Always fetch fresh data in background
    const fetchDonations = async () => {
  try {
      const { data, error } = await supabase
        .from('paypal_totals')
        .select('total, last_transaction_date, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1) // only get the latest record
        .single(); // return a single object instead of an array

      if (error) throw error;

      if (data) {
        const totalVal = data.total || 0;
        const lastDate = data.last_transaction_date || null;
        setAmount(totalVal);
        setLastTransactionDate(lastDate);
        setCachedData(totalVal, lastDate);
      } else {
        setAmount(0);
        setLastTransactionDate(null);
      }
    } catch {
      // Only fallback to 0 if we don't have cached data
      if (!cached) {
        setAmount(0);
        setLastTransactionDate(null);
      }
    }
  };

    fetchDonations();
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
    <div className="progress-container progress-center">
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
