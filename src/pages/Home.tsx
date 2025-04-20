export default function Home() {
  return (
    <main className="main-content">
      <div className="home-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="main-title" style={{ fontSize: '2.2rem', fontWeight: 500, marginBottom: '2.2rem', textAlign: 'center' }}>
          a nonprofit to create free, universal housing.
        </div>
        <div className="because-box" style={{ fontSize: '2.1rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: '#222' }}>
          <div>because<br/>it's<br/>fair</div>
        </div>
      </div>
    </main>
  );
}
