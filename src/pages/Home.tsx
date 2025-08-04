export default function Home() {
  return (
    <main className="main-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'inherit', paddingTop: '3vh' }}>
      <head>
        <meta name="keywords" content="Universal Housing, ACTUM, LA Housing, Free Housing, Because Its Fair, becauseitsfair, lahousing, unviersalhousing" />
      </head>
      <div className="home-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="main-title" style={{ fontSize: '3.2rem', fontWeight: 500, marginBottom: '2.2rem', textAlign: 'center' }}>
          welcome to actum.
        </div>
        <div style={{ fontSize: '1.8rem', marginBottom: '2.5rem', color: '#333', textAlign: 'center' }}>
          we are building the first global network of rent-free homes—permanently.
        </div>
        <div style={{ fontSize: '1.5rem', marginBottom: '2.5rem', color: '#333', textAlign: 'left' }}>
          real units.<br />
          for everyone.<br />
          forever.<br />
          for good.
        </div>
        <div style={{ fontSize: '2.1rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: '#222' }}>
          because it’s fair.
        </div>
      </div>
    </main>
  );
}
