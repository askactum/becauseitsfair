import React, { useEffect, useState } from 'react';
import './Donate.css';

const BUTTONS = [
  {
    id: 'house-5',
    hosted_button_id: 'DNRKJ4BASZA2N',
    amount: 5,
    sizeClass: 'size-1',
    isCustom: false,
  },
  {
    id: 'house-20',
    hosted_button_id: 'LFBC2EECY6HWG',
    amount: 20,
    sizeClass: 'size-2',
    isCustom: false,
  },
  {
    id: 'house-50',
    hosted_button_id: 'A4RU6SHE3S3N8',
    amount: 50,
    sizeClass: 'size-3',
    isCustom: false,
  },
  {
    id: 'house-100',
    hosted_button_id: 'YYM5CJVY88Q5A',
    amount: 100,
    sizeClass: 'size-4',
    isCustom: false,
  },
  {
    id: 'house-custom',
    hosted_button_id: 'DXAGF8K7GJ7G8',
    amount: 'Custom',
    sizeClass: 'size-custom',
    isCustom: true,
  },
];

// Image size configurations (for PayPal button images)
// const IMAGE_SIZES = {
//   small: 100,
//   medium: 150,
//   large: 200,
//   xlarge: 250,
//   xxlarge: 250
// };


const Donate: React.FC = () => {
  const [heartBalloon, setHeartBalloon] = useState<{x: number, y: number, visible: boolean}>({x: 0, y: 0, visible: false});
  
  // No longer need PayPal SDK since we're using custom buttons
  useEffect(() => {
    // Clean up any existing PayPal scripts
    const paypalScript = document.querySelector('script[src*="paypalobjects.com/donate/sdk/donate-sdk.js"]');
    if (paypalScript) {
      paypalScript.remove();
    }
  }, []);

  // Responsive heading margin
  const headingMarginTop = typeof window !== 'undefined' && window.innerWidth <= 700 ? '2.5rem' : '5rem';

  // No cleanup needed for single balloon

  return (
    <div className="donate-outer donate-center">
      {/* Heart balloon */}
      {heartBalloon.visible && (
        <div 
          className="heart-balloon"
          style={{
            left: `${heartBalloon.x}px`,
            top: `${heartBalloon.y}px`
          }}
        >
          ❤️
        </div>
      )}
      <div style={{ width: '100%' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '4rem', margin: `${headingMarginTop} 0 2.5rem 0`, textAlign: 'center', zIndex: 1 }}>give.</h1>
      </div>
      <div style={{marginTop: 100, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div className="donation-box" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '3.5rem', background: 'none', boxShadow: 'none', padding: 0, borderRadius: 0, marginBottom: 0, zIndex: 1 }}>
          {BUTTONS.filter(btn => !btn.isCustom).map((btn) => (
            <a
              key={btn.id}
              href={`#donate-${btn.amount}`}
              className={`donate-button ${btn.sizeClass}`}
              onMouseEnter={(e) => {
                // Show heart balloon
                const rect = e.currentTarget.getBoundingClientRect();
                setHeartBalloon({
                  x: rect.left + rect.width/2 - 41,
                  y: rect.top - 70,
                  visible: true
                });
              }}
              onMouseLeave={() => {
                // Hide heart balloon
                setHeartBalloon(prev => ({...prev, visible: false}));
              }}
              onClick={(e) => {
                e.preventDefault();
                // Create PayPal popup window
                const popup = window.open('', 'paypal_popup', 'width=600,height=700,scrollbars=yes,resizable=yes');
                
                if (popup) {
                  // Create form content for popup
                  const formHtml = `
                    <html>
                      <head><title>PayPal Donation</title></head>
                      <body>
                        <form method="POST" action="https://www.paypal.com/cgi-bin/webscr">
                          <input type="hidden" name="cmd" value="_s-xclick">
                          <input type="hidden" name="hosted_button_id" value="${btn.hosted_button_id}">
                        </form>
                        <script>document.forms[0].submit();</script>
                      </body>
                    </html>
                  `;
                  
                  popup.document.write(formHtml);
                  popup.document.close();
                }
              }}
            >
              <img src="/src/assets/actum.svg" className="actum-logo" alt="Actum" />
              <div className="amount">
                {!btn.isCustom && <span className="dollar-sign">$</span>}
                {btn.amount}
              </div>
            </a>
          ))}
        </div>
        <div className="custom-button-row" style={{ display: 'flex', justifyContent: 'center', gap: '3.5rem' }}>
          {BUTTONS.filter(btn => btn.isCustom).map((btn) => (
            <a
              key={btn.id}
              href="#donate-custom"
              className={`donate-button ${btn.sizeClass}`}
              onClick={(e) => {
                e.preventDefault();
                // Create PayPal popup window
                const popup = window.open('', 'paypal_popup', 'width=600,height=700,scrollbars=yes,resizable=yes');
                
                if (popup) {
                  // Create form content for popup
                  const formHtml = `
                    <html>
                      <head><title>PayPal Donation</title></head>
                      <body>
                        <form method="POST" action="https://www.paypal.com/cgi-bin/webscr">
                          <input type="hidden" name="cmd" value="_s-xclick">
                          <input type="hidden" name="hosted_button_id" value="${btn.hosted_button_id}">
                        </form>
                        <script>document.forms[0].submit();</script>
                      </body>
                    </html>
                  `;
                  
                  popup.document.write(formHtml);
                  popup.document.close();
                }
              }}
            >
              <img src="/src/assets/actum.svg" className="actum-logo" alt="Actum" />
              <div className="amount">
                {btn.amount}
              </div>
            </a>
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
