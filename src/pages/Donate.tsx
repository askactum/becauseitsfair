import React, { useEffect, useRef } from 'react';
import './Donate.css';

const BUTTONS = [
  {
    id: 'house-5',
    hosted_button_id: 'DNRKJ4BASZA2N',
    image: 'https://pics.paypal.com/00/s/YWJkYjNiNDYtYjVkNC00N2RmLWI1MTItMjQ0NmM0ZmYwZDQ5/file.PNG',
  },
  {
    id: 'house-20',
    hosted_button_id: 'LFBC2EECY6HWG',
    image: 'https://pics.paypal.com/00/s/Y2MzMGI4MTgtMjAzNC00MmMzLTg0ZTQtYWQxOTEzYjAxYTc4/file.PNG',
  },
  {
    id: 'house-50',
    hosted_button_id: 'A4RU6SHE3S3N8',
    image: 'https://pics.paypal.com/00/s/Mzk3NTUzYTUtOTE2Ny00OWFiLWJiN2UtZmU5ODY0M2NiYWVh/file.PNG',
  },
  {
    id: 'house-100',
    hosted_button_id: 'YYM5CJVY88Q5A',
    image: 'https://pics.paypal.com/00/s/MmY1YTMwYTYtMGM5Zi00OGQ5LWJiYWItNjZhYTRlMjE0ZTFm/file.PNG',
  },
  {
    id: 'house-custom',
    hosted_button_id: 'DXAGF8K7GJ7G8',
    image: 'https://pics.paypal.com/00/s/ZWZkNzg1YTgtZWJmNS00ZWE2LWEwNTgtYTFkYzI2Mzg1YWZk/file.PNG',
  },
];

const BUTTON_SIZE = 150;

const Donate: React.FC = () => {
  const buttonRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

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
        const ref = buttonRefs[idx].current;
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
      buttonRefs.forEach(ref => { if (ref.current) ref.current.innerHTML = ''; });
    };
  }, []);

  return (
    <div className="donate-outer" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: '100%' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '4rem', margin: '3rem 0 2.5rem 0', textAlign: 'center', zIndex: 1 }}>give.</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div className="donation-box" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '3.5rem', background: 'none', boxShadow: 'none', padding: 0, borderRadius: 0, marginBottom: 0, zIndex: 1 }}>
          {BUTTONS.slice(0, 4).map((btn, idx) => (
            <div key={btn.id}
              style={{
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
              }}
            >
              <div
                id={btn.id}
                ref={buttonRefs[idx]}
                style={{
                  minHeight: 45,
                  width: BUTTON_SIZE - 20,
                  height: BUTTON_SIZE - 20,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6rem' }}>
          <div
            key={BUTTONS[4].id}
            style={{
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
            }}
          >
            <div
              id={BUTTONS[4].id}
              ref={buttonRefs[4]}
              style={{
                minHeight: 45,
                width: BUTTON_SIZE - 20,
                height: BUTTON_SIZE - 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto',
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ marginTop: '2.5rem', marginBottom: '3.5rem', fontStyle: 'italic', fontSize: '1.18rem', color: '#222', fontFamily: 'Georgia, serif', textAlign: 'center', maxWidth: 600, zIndex: 0 }}>
        We are a non-profit organization pending 501(c)(3) status.<br />
        100% of proceeds support the mission to fund our housing development operations.
      </div>
    </div>
  );
};

export default Donate;
