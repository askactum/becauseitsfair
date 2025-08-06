import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import labLogo from '../assets/lab_w.png';
import './Lab.css';

export default function Lab() {
  const navigate = useNavigate();
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [typedText, setTypedText] = useState('');

  // Logo bubbles effect
  useEffect(() => {
    const createLogoBubble = () => {
      if (!logoContainerRef.current) return;
      
      const container = logoContainerRef.current;
      const bubble = document.createElement('span');
      bubble.className = 'logo-bubble';
      
      // Random size between 5-20px
      const size = Math.random() * 30 + 10;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random position within logo area
      const startX = 0;
      const startY = -150;
      
      // Random end position
      const endX = startX + (Math.random() * 80 - 20);
      const endY = -300;
      
      bubble.style.setProperty('--startX', `${startX}px`);
      bubble.style.setProperty('--startY', `${startY}px`);
      bubble.style.setProperty('--endX', `${endX}px`);
      bubble.style.setProperty('--endY', `${endY}px`);
      
      container.appendChild(bubble);
      
      setTimeout(() => {
        bubble.remove();
      }, 3000);
    };

    const interval = setInterval(createLogoBubble, Math.random() * 500 + 300);
    return () => clearInterval(interval);
  }, []);

  // Button bubbles effect
  const createButtonBubble = (e: React.MouseEvent) => {
    if (!buttonRef.current || !isHovering) return;
    
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bubble = document.createElement('span');
    bubble.className = 'button-bubble';
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    
    const size = Math.random() * 15 + 5;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    bubble.style.setProperty('--tx', `${tx}px`);
    bubble.style.setProperty('--ty', `${-Math.abs(ty)}px`);
    
    button.appendChild(bubble);
    
    setTimeout(() => {
      bubble.remove();
    }, 1000);
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHovering && Math.random() > 0.7) {
      createButtonBubble(e);
    }
  };

  const handleEnterLab = () => {
    setShowTransition(true);
    // Typewriter effect
    let i = 0;
    const fullText = 'Welcome to the Actum Lab';
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
  };

  return (
    <div className="lab-container" ref={logoContainerRef}>
      {showTransition ? (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh',
          background: '#000', 
          zIndex: 9999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column'
        }}>
          <h1 style={{ 
            color: '#fff', 
            fontSize: '3rem', 
            zIndex: 2, 
            fontWeight: 700, 
            letterSpacing: 2, 
            marginBottom: '2rem', 
            fontFamily: 'Georgia, serif', 
            textAlign: 'center', 
            minHeight: '3.5em' 
          }}>
            {typedText}
            <span style={{ 
              borderRight: '2px solid #fff', 
              marginLeft: 2, 
              animation: 'blink 1s steps(1) infinite' 
            }} />
          </h1>
          <img 
            src={labLogo} 
            alt="Actum Lab Logo" 
            style={{ 
              width: 150, 
              height: 220, 
              zIndex: 2, 
              borderRadius: 16, 
              boxShadow: '0 2px 16px rgba(0,0,0,0.18)' 
            }} 
          />
          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </div>
      ) : (
        <>
          <img
            src={labLogo}
            alt="Actum Lab Logo"
            className="lab-logo"
          />
          <p className="lab-description">
            A live global idea forum where volunteers shape the future of shelter. Contributors gather here to reimagine what's possible, debate strategies, ask questions, and propose new systems. From ethics to technology, the Lab is where Actum's mission evolves— together, with you.
          </p>
          <button
            ref={buttonRef}
            className="lab-button"
            onClick={handleEnterLab}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            Enter The LAB
          </button>
        </>
      )}
    </div>
  );
}
