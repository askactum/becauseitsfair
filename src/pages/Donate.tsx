import React, { useEffect, useRef } from 'react';
import './Donate.css';
import house5Img from '../assets/Donate/house-5.png';
import house20Img from '../assets/Donate/house-20.png';
import house50Img from '../assets/Donate/house-50.png';
import house100Img from '../assets/Donate/house-100.png';
import donateCustomImg from '../assets/Donate/donate_custom_amt.png';

const BUTTONS = [
  {
    id: 'house-5',
    hosted_button_id: 'DNRKJ4BASZA2N',
    amount: 5,
    image: house5Img,
    size: 'small',
    isCustom: false,
  },
  {
    id: 'house-20',
    hosted_button_id: 'LFBC2EECY6HWG',
    amount: 20,
    image: house20Img,
    size: 'medium',
    isCustom: false,
  },
  {
    id: 'house-50',
    hosted_button_id: 'A4RU6SHE3S3N8',
    amount: 50,
    image: house50Img,
    size: 'large',
    isCustom: false,
  },
  {
    id: 'house-100',
    hosted_button_id: 'YYM5CJVY88Q5A',
    amount: 100,
    image: house100Img,
    size: 'xlarge',
    isCustom: false,
  },
  {
    id: 'house-custom',
    hosted_button_id: 'DXAGF8K7GJ7G8',
    amount: 'Custom',
    image: donateCustomImg,
    size: 'xxlarge',
    isCustom: true,
  },
];

// Button size configurations
const BUTTON_SIZES = {
  small: 100,
  medium: 140,
  large: 180,
  xlarge: 220,
  xxlarge: 200
};

// Current button size - can be changed to any of the above
const BUTTON_SIZE = BUTTON_SIZES.large;

// Image size configurations (for PayPal button images)
const IMAGE_SIZES = {
  small: 100,
  medium: 150,
  large: 200,
  xlarge: 250,
  xxlarge: 250
};

// Current image size
const IMAGE_SIZE = IMAGE_SIZES.large;

// Extracted style objects for reuse
const buttonContainerStyle: React.CSSProperties = {
  background: '#fff',
  padding: '0.8rem',
  margin: '0 1.2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  boxSizing: 'border-box',
  position: 'relative',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
};

const buttonInnerStyle: React.CSSProperties = {
  minHeight: IMAGE_SIZE * 0.3,
  width: IMAGE_SIZE,
  height: IMAGE_SIZE,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
  objectFit: 'contain',
};

const Donate: React.FC = () => {
  // One ref per button
  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Responsive sizing based on screen width
  const getResponsiveButtonSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 600) return BUTTON_SIZES.small;
      if (window.innerWidth <= 900) return BUTTON_SIZES.medium;
      if (window.innerWidth <= 1200) return BUTTON_SIZES.large;
      return BUTTON_SIZES.xlarge;
    }
    return BUTTON_SIZES.large;
  };

  const getResponsiveImageSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 600) return IMAGE_SIZES.small;
      if (window.innerWidth <= 900) return IMAGE_SIZES.medium;
      if (window.innerWidth <= 1200) return IMAGE_SIZES.large;
      return IMAGE_SIZES.xlarge;
    }
    return IMAGE_SIZES.large;
  };

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

  return (
    <div className="donate-outer donate-center">
      <div style={{ width: '100%' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: '4rem', margin: `${headingMarginTop} 0 2.5rem 0`, textAlign: 'center', zIndex: 1 }}>give.</h1>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div className="donation-box" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: '3.5rem', background: 'none', boxShadow: 'none', padding: 0, borderRadius: 0, marginBottom: 0, zIndex: 1 }}>
          {BUTTONS.filter(btn => !btn.isCustom).map((btn, idx) => (
            <img 
              key={btn.id}
              src={btn.image} 
              alt={`Donate $${btn.amount}`}
              style={{
                width: `${IMAGE_SIZES[btn.size as keyof typeof IMAGE_SIZES]}px`,
                height: `${IMAGE_SIZES[btn.size as keyof typeof IMAGE_SIZES]}px`,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 1.2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.filter = 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))';
              }}
              onClick={() => {
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
            />
          ))}
        </div>
                <div className="custom-button-row" style={{ display: 'flex', justifyContent: 'center' }}>
          {BUTTONS.filter(btn => btn.isCustom).map((btn) => (
            <img 
              key={btn.id}
              src={btn.image} 
              alt={`Donate Custom Amount`}
              style={{
                width: `${IMAGE_SIZES[btn.size as keyof typeof IMAGE_SIZES]}px`,
                height: `${IMAGE_SIZES[btn.size as keyof typeof IMAGE_SIZES]}px`,
                objectFit: 'contain',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                margin: '0 1.2rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                e.currentTarget.style.filter = 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))';
              }}
              onClick={() => {
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
            />
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
