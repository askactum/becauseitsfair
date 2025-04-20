export default function Contact() {
  return (
    <div className="page-content contact-page" style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1rem', fontFamily: 'Georgia, serif', color: '#222', display: 'flex', flexWrap: 'wrap', gap: '2.5rem', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div style={{ flex: '2 1 380px', minWidth: 290, maxWidth: 520 }}>
        <h1 style={{ fontWeight: 400, fontSize: '2.6rem', margin: '0 0 1.7rem 0', letterSpacing: '0.01em' }}>Let’s connect.</h1>
        <p style={{ fontSize: '1.19rem', marginBottom: '1.5rem', color: '#444' }}>
          Thank you for wanting to reach out to our organization.
        </p>
        <p style={{ fontSize: '1.11rem', marginBottom: '1.2rem', color: '#444' }}>
          To contribute skills or ideas, you can visit the actum lab— a forum of questions and discussions reviewed by our team.
        </p>
        <p style={{ fontSize: '1.11rem', marginBottom: '2.2rem', color: '#444' }}>
          If you need to reach us directly for an inquiry or partnership, please email us at <span style={{ fontStyle: 'italic', color: '#111' }}>[email address]</span>.
        </p>
        <div style={{ fontSize: '1.11rem', marginBottom: '1.1rem', color: '#111' }}>
          <b>E-mail:</b><br />
          <span style={{ fontStyle: 'italic' }}>askactum@gmail.com</span>
        </div>
        <div style={{ fontSize: '1.11rem', marginBottom: '1.1rem', color: '#111' }}>
          <b>Phone:</b><br />
          <span style={{ fontStyle: 'italic' }}>xxx–x–x–—</span>
        </div>
        <div style={{ fontSize: '1.11rem', color: '#111' }}>
          <b>Address:</b><br />
          <span style={{ fontStyle: 'italic' }}>5805 White Oak Ave #16474<br />Encino, CA 91416<br />United States</span>
        </div>
      </div>
      <div style={{ flex: '1 1 380px', minWidth: 290, maxWidth: 480, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 14px rgba(0,0,0,0.07)' }}>
        <iframe
          title="Actum Map"
          width="100%"
          height="600"
          frameBorder="0"
          style={{ border: 0, filter: 'grayscale(1)' }}
          src="https://www.google.com/maps?q=5805+White+Oak+Ave+%2316474,+Encino,+CA+91416,+United+States&output=embed"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
