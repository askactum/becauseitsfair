import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faTiktok, faTwitch, faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

export default function Contact() {
  return (
    <div className="page-content contact-page" style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '1.5rem 1rem',
      fontFamily: 'Georgia, serif',
      color: '#222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', // ensure full viewport height
      paddingTop: '4.5rem', // add space from the top
    }}>
      <div style={{ width: '100%', maxWidth: 880 }}>
        <h1 style={{ fontWeight: 400, fontSize: '2.6rem', margin: '0 0 1.7rem 0', letterSpacing: '0.01em', textAlign: 'center' }}>Let's connect.</h1>
        <p style={{ fontSize: '1.35rem', marginBottom: '1.5rem', color: '#444', textAlign: 'center' }}>
          Thank you for wanting to reach out to our organization.
        </p>
        <p style={{ fontSize: '1.35rem', marginBottom: '1.2rem', color: '#444', textAlign: 'center' }}>
          To contribute skills or ideas, you can visit the <a href="/laboratory" style={{ color: '#2d4c8d', textDecoration: 'underline' }}>Actum Lab</a>— a global idea forum where you can contribute discussions to improve Actum's mission.
        </p>
        <p style={{ fontSize: '1.35rem', marginBottom: '1.2rem', color: '#444', textAlign: 'center' }}>
          To volunteer and start your own campus charter for high school or universities, please also email the address below.
        </p>
        <p style={{ fontSize: '1.35rem', marginBottom: '2.2rem', color: '#444', textAlign: 'center' }}>
          If you need to reach us directly for an inquiry or partnership, please email us.
        </p>
        <div style={{ fontSize: '1.35rem', marginBottom: '1.1rem', color: '#111', textAlign: 'center' }}>
          <b>E-mail:</b><br />
          <a href="mailto:askactum@gmail.com" style={{ fontStyle: 'italic', color: '#111', textDecoration: 'underline' }}>askactum@gmail.com</a>
        </div>
        <div style={{ fontSize: '1.35rem', marginBottom: '1.1rem', color: '#111', textAlign: 'center' }}>
          <b>Phone:</b><br />
          <span style={{ fontStyle: 'italic' }}>TBD</span>
        </div>
        <div style={{ fontSize: '1.35rem', color: '#111', textAlign: 'center' }}>
          <b>Address:</b><br />
          <span style={{ fontStyle: 'italic' }}>5805 White Oak Ave #16474<br />Encino, CA 91416<br />United States</span>
        </div>
      </div>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossOrigin="anonymous" />

      <ul className="social-icons">
        <li>
          <a href="https://www.youtube.com/becauseitsfair/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} className="icon" />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/becauseitsfair/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="icon" />
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/becauseitsfair/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} className="icon" />
          </a>
        </li>
        <li>
          <a href="https://www.tiktok.com/company/becauseitsfair" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} className="icon" />
          </a>
        </li>
        <li>
          <a href="https://x.com/becauseitsfair" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className="icon" />
          </a>
        </li>
        <li>
          <a href="https://www.twitch.tv/becauseitsfair" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitch} className="icon" />
          </a>
        </li>
      </ul>
    </div>
  );
}
