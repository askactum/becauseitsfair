import React, { useEffect, useRef } from 'react';
import './Donate.css';

const BUTTONS = [
  {
    id: 'house-5',
    hosted_button_id: 'DNRKJ4BASZA2N',
    image: 'https://pics.paypal.com/00/s/Y2IzMGY5MzMtODFhNC00ZGYzLWEyNjAtZGY3YjU3YjI4ZWE5/file.PNG',
    isCustom: false,
  },
  {
    id: 'house-20',
    hosted_button_id: 'LFBC2EECY6HWG',
    image: 'https://pics.paypal.com/00/s/Y2Q1YWJjZjQtYjE5MC00ZThhLTkxZWItYTYyNWRiNGQ2NTgy/file.PNG',
    isCustom: false,
  },
  {
    id: 'house-50',
    hosted_button_id: 'A4RU6SHE3S3N8',
    image: 'https://pics.paypal.com/00/s/ZjY4N2UxYWQtYmJmNS00MWQyLTgwNWYtOGU4ZDRjMjE0Nzk1/file.PNG',
    isCustom: false,
  },
  {
    id: 'house-100',
    hosted_button_id: 'YYM5CJVY88Q5A',
    image: 'https://pics.paypal.com/00/s/OTA3ODE1ZDItNGY4Ny00M2FjLThkN2YtOGM5NGY1OThiYjFi/file.PNG',
    isCustom: false,
  },
  {
    id: 'house-custom',
    hosted_button_id: 'DXAGF8K7GJ7G8',
    image: 'https://pics.paypal.com/00/s/ZWZkNzg1YTgtZWJmNS00ZWE2LWEwNTgtYTFkYzI2Mzg1YWZk/file.PNG',
    isCustom: true,
  },
];

const BUTTON_SIZE = 150;

// Extracted style objects for reuse
const buttonContainerStyle: React.CSSProperties = {
  background: '#fff',
  padding: '0.7rem',
  margin: '0 1rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  boxSizing: 'border-box',
  position: 'relative',
};

const buttonInnerStyle: React.CSSProperties = {
  minHeight: 45,
  width: BUTTON_SIZE - 20,
  height: BUTTON_SIZE - 20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
};

const Donate: React.FC = () => {
  // One ref per button
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let script = document.querySelector('script[src*="paypalobjects.com/donate/sdk/donate-sdk.js"]');
    if (!script) {
      const newScript = document.createElement('script');
      newScript.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
      newScript.charset = 'UTF-8';
      document.body.appendChild(newScript);
      newScript.onload = renderButtons;
    } else {
      renderButtons();
    }

    function renderButtons() {
      BUTTONS.forEach((btn, idx) => {
        const ref = buttonRefs.current[idx];
        if (ref) {
          ref.innerHTML = '';
          // @ts-ignore
          if (window.PayPal && window.PayPal.Donation) {
            // @ts-ignore
            window.PayPal.Donation.Button({
              env: 'production',
              hosted_button_id: btn.hosted_button_id,
              image: {
                src: btn.image,
                alt: 'Donate with PayPal button',
                title: 'PayPal - The safer, easier way to pay online!',
              },
            }).render(`#${btn.id}`);
          }
        }
      });
    }

    return () => {
      if (buttonRefs.current) {
        buttonRefs.current.forEach(ref => { if (ref) ref.innerHTML = ''; });
      }
    };
  }, []);

  // Responsive heading margin
  const headingMarginTop = typeof window !== 'undefined' && window.innerWidth <= 700 ? '2.5rem' : '5rem';

  return (
    <div className="donate-outer donate-center">
      <div style={{ width: '100%' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '4rem', margin: `${headingMarginTop} 0 2.5rem 0`, textAlign: 'center', zIndex: 1 }}>give.</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div className="donation-box" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '3.5rem', background: 'none', boxShadow: 'none', padding: 0, borderRadius: 0, marginBottom: 0, zIndex: 1 }}>
          {BUTTONS.filter(btn => !btn.isCustom).map((btn, idx) => (
            <div key={btn.id} style={buttonContainerStyle}>
              <div
                id={btn.id}
                ref={el => { buttonRefs.current[idx] = el; }}
                style={buttonInnerStyle}
              />
            </div>
          ))}
        </div>
        <div className="custom-button-row" style={{ display: 'flex', justifyContent: 'center' }}>
          {BUTTONS.filter(btn => btn.isCustom).map((btn, idx) => (
            <div className="donation-custom" key={btn.id} style={buttonContainerStyle}>
              <div
                id={btn.id}
                ref={el => { buttonRefs.current[4] = el; }}
                style={buttonInnerStyle}
              />
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '1rem', marginBottom: '2rem', fontStyle: 'italic', fontSize: '1.18rem', color: '#222', fontFamily: 'Georgia, serif', textAlign: 'center', maxWidth: 600, zIndex: 0 }}>
        We are a non-profit organization pending 501(c)(3) status.<br />
        100% of proceeds support the mission to fund our housing development operations.
      </div>
    </div>
  );
};

export default Donate;
