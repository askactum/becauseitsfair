import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import labLogo from '../assets/lab_w.png';

export default function LabTransition() {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = 'Welcome to Actum Lab';

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