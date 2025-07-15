import { useEffect } from 'react';
import './Donate.css';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PRESET_AMOUNTS = [5, 20, 50, 100];

// Updated to use PayPal integration with .env for the client ID
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const PAYPAL_BUTTON_ID = "HYKMLWYSDE5EL"; // Your live hosted_button_id

function loadPayPalScript(callback: () => void) {
  const scriptId = "paypal-donate-sdk";
  if (document.getElementById(scriptId)) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://www.paypalobjects.com/donate/sdk/donate-sdk.js";
  script.id = scriptId;
  script.charset = "UTF-8";
  script.onload = callback;
  document.body.appendChild(script);
}

export default function Donate() {
  useEffect(() => {
    loadPayPalScript(() => {
      // @ts-ignore
      if (window.PayPal && window.PayPal.Donation) {
        // @ts-ignore
        window.PayPal.Donation.Button({
          env: "production",
          hosted_button_id: PAYPAL_BUTTON_ID,
          image: {
            src: "https://pics.paypal.com/00/s/MjFmNTYwYjYtNGM2NC00MDkwLThkODUtYWJjNDBmZGU2ODQ1/file.PNG",
            alt: "Donate with PayPal button",
            title: "PayPal - The safer, easier way to pay online!",
          },
        }).render("#donate-button");
      }
    });
  }, []);

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
      <div className="page-content donate-page" style={{
        maxWidth: 950,
        minHeight: '70vh',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: 'Georgia, serif',
        color: '#222',
      }}>
        <div className="text-content">
          <h1 style={{ textAlign: 'left', fontWeight: 400, fontSize: '2.2rem', margin: '0 0 1.2rem 0', letterSpacing: '0.01em' }}>Give a high five.</h1>
          <p style={{ textAlign: 'left', margin: '0 0 1.1rem 0', fontSize: '1.35rem' }}>
            Start by giving $5 and take the first steps to ensure housing for all.
          </p>
          <p style={{ textAlign: 'left', margin: '0 0 2.2rem 0', fontSize: '1.35rem', color: '#444' }}>
            As of April 8, 2025, donations are not available at this time.
          </p>
          <div style={{ fontStyle: 'italic', fontSize: '1.35rem', color: '#444', margin: '0 0 0.7rem 0', textAlign: 'left' }}>
            We are a non-profit organization.<br />pending 501(c)(3) status. Your donation is <b>tax deductible.</b><br />100% of proceeds support the mission to fund our housing development operations.
          </div>
          <div style={{ fontSize: '1.35rem', color: '#444', margin: '0 0 0.7rem 0', textAlign: 'left' }}>
            Track how every penny of our funds are spent in our progress page.
          </div>
          <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }} id="donate-button"></div>
        </div>
        <div className="">
          {/* Only render the PayPal button, no amount options */}
         
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
