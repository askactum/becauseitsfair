import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import labLogo from '../assets/lab_w.png';

export function LabEntryPrompt() {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#fff', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
    }}>
      <img src={labLogo} alt="Actum Lab Logo" style={{ width: 120, height: 120, marginBottom: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }} />
      <h2 style={{ color: '#222', fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'Georgia, serif', textAlign: 'center' }}>
        Would you like to enter the ACTUM LAB?
      </h2>
      <button
        style={{ background: '#2d4c8d', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem 2.2rem', fontWeight: 700, fontSize: 20, cursor: 'pointer', marginTop: 12 }}
        onClick={() => navigate('/lab-transition')}
      >
        Enter The LAB
      </button>
    </div>
  );
}

export default function LabTransition() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = 'Welcome to the Actum Lab';

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
        setTimeout(type, 60);
      } else {
        // After typing is done, wait 2 seconds, then navigate
        setTimeout(() => {
          navigate('/laboratory');
        }, 2000);
      }
    };
    type();
  }, [navigate]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#000', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
    }}>
      {/* Removed lab-transition-overlay div */}
      <h1 style={{ color: '#fff', fontSize: '3rem', zIndex: 2, fontWeight: 700, letterSpacing: 2, marginBottom: '2rem', fontFamily: 'Georgia, serif', textAlign: 'center', minHeight: '3.5em' }}>
        {typedText}
        <span style={{ borderRight: '2px solid #fff', marginLeft: 2, animation: 'blink 1s steps(1) infinite' }} />
      </h1>
      <img src={labLogo} alt="Actum Lab Logo" style={{ width: 150, height: 220, zIndex: 2, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.18)' }} />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
} 