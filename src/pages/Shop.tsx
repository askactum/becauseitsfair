import './Shop.css';

export default function Shop() {
  return (
    <div className="page-content shop-page shop-center">
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 32 }}>
        <rect x="3" y="7" width="18" height="13" rx="2.5" fill="#222"/>
        <rect x="1" y="7" width="22" height="2" rx="1" fill="#444"/>
        <path d="M7 7V5a5 5 0 0 1 10 0v2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="17" r="1.5" fill="#fff"/>
        <circle cx="16" cy="17" r="1.5" fill="#fff"/>
      </svg>
      <h1 style={{ fontWeight: 500, fontSize: '2.2rem', margin: 0, color: '#222', letterSpacing: '0.01em' }}>Shop</h1>
      <p className="zoom-animation" style={{ fontSize: '1.25rem', color: '#444', marginTop: 14, fontStyle: 'italic' }}>Coming soon</p>
    </div>
  );
}
