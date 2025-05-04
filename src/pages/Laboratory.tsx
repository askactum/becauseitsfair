export default function Laboratory() {
  return (
    <div className="page-content lab-page" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 32 }}>
        <path d="M9 2v6.5a5.5 5.5 0 0 1-1.5 3.8L5 16.5a5 5 0 0 0-1 3v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1a5 5 0 0 0-1-3l-2.5-4.2A5.5 5.5 0 0 1 15 8.5V2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 16h10" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h1 style={{ fontWeight: 500, fontSize: '2.2rem', margin: 0, color: '#000', letterSpacing: '0.01em' }}>The Laboratory</h1>
      <p className="zoom-animation" style={{ fontSize: '1.25rem', color: '#000', marginTop: 14, fontStyle: 'italic' }}>Coming soon</p>
    </div>
  );
}
