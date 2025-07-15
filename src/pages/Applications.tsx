export default function Applications() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      background: '#fff',
      color: '#111',
      padding: '0 1.5rem',
      textAlign: 'center',
    }}>
      <img
        src="/src/assets/application.png"
        alt="Applications Coming Soon"
        style={{ width: 200, height: 200, objectFit: 'contain', marginBottom: '2.5rem' }}
      />
      <h1 style={{ fontWeight: 700, fontSize: '2.1rem', marginBottom: '2rem' }}>
        Universal housing is coming.
      </h1>
      <div style={{ maxWidth: 600, fontSize: '1.18rem', textAlign: 'left' }}>
        <p>We’re currently fundraising for our first building,<br />and the application system isn’t open yet.</p>
        <p>When it is, anyone—regardless of income, background, or location—will be able to apply for a home at no cost and no expiration.</p>
        <p>You’re not just signing up. You’re stepping into the future of shelter.</p>
        <p>Want to be the first to know when applications open? Follow us on IG<br />@becauseitsfair.</p>
        <p>To be eligible for an Actum residence, you must be at least 18 years old and plan to make the unit your primary residence. You’ll need to consent to a background check and agree to follow basic community guidelines, including quiet hours and a no-smoking policy. Tenants are responsible for covering their own utilities, such as water and electricity. Pets are allowed, as long as we’re informed in advance.</p>
      </div>
    </div>
  );
}