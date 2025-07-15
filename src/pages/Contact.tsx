import { FaYoutube, FaInstagram, FaFacebook, FaTiktok, FaXTwitter, FaTwitch } from 'react-icons/fa6';

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
      justifyContent: 'flex-start', // changed from center
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 38px)',
        gridTemplateRows: 'repeat(2, 1fr)',
        columnGap: '2.05rem',
        rowGap: '0.30rem',
        width: 'auto',
        margin: '2.5rem auto 0 auto',
        justifyItems: 'center',
        alignItems: 'center',
      }}>
        <a href="https://www.youtube.com/@becauseitsfair" target="_blank" rel="noopener noreferrer" title="YouTube" style={iconStyle}><FaYoutube /></a>
        <a href="https://www.instagram.com/becauseitsfair/" target="_blank" rel="noopener noreferrer" title="Instagram" style={iconStyle}><FaInstagram /></a>
        <a href="https://www.facebook.com/becauseitsfair/" target="_blank" rel="noopener noreferrer" title="Facebook" style={iconStyle}><FaFacebook /></a>
        <a href="https://www.tiktok.com/@becauseitsfair" target="_blank" rel="noopener noreferrer" title="TikTok" style={iconStyle}><FaTiktok /></a>
        <a href="https://x.com/becauseitsfair" target="_blank" rel="noopener noreferrer" title="X" style={iconStyle}><FaXTwitter /></a>
        <a href="https://www.twitch.tv/universalhousing" target="_blank" rel="noopener noreferrer" title="Twitch" style={iconStyle}><FaTwitch /></a>
      </div>
    </div>
  );
}

const iconStyle = {
  background: '#222',
  color: '#fff',
  fontSize: '1.45rem',
  width: 38,
  height: 38,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  transition: 'background 0.2s',
  margin: 0,
  boxShadow: 'none',
  border: 'none',
  textDecoration: 'none',
};
