export default function Progress() {
  // Example: 0 out of 100000 raised
  const goal = 100000;
  const raised = 0;
  const percent = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <div className="page-content progress-page" style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: 'Georgia, serif',
      color: '#222',
      display: 'flex',
      flexDirection: 'row',
      gap: '2.5rem',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      position: 'relative',
    }}>
      {/* Left column */}
      <div style={{ flex: 1, minWidth: 290, maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Donation Goals</h2>
          <div style={{
            background: '#eee',
            borderRadius: 8,
            height: 28,
            width: '100%',
            marginBottom: 16,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #2d4c8d 60%, #4e7ad9 100%)',
              height: '100%',
              borderRadius: 8,
              transition: 'width 0.5s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: percent > 10 ? 'flex-end' : 'flex-start',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.35rem',
              paddingRight: percent > 10 ? 12 : 0,
              paddingLeft: percent <= 10 ? 12 : 0
            }}>
              {percent > 0 && <span>{percent}%</span>}
            </div>
          </div>
          <ul style={{ fontSize: '1.35rem', lineHeight: 1.7 }}>
            <li>Goal: $100,000 for first Actum residence <span style={{ color: '#2d4c8d', fontWeight: 600 }}>[In Progress]</span></li>
            <li>Raised so far: <b>$0</b> (Donations opening soon)</li>
          </ul>
        </section>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Action Items</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#2d4c8d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>1</div>
              <div style={{ fontSize: '1.35rem', lineHeight: 1.5 }}>
                501(c)(3) nonprofit status: <span style={{ color: '#2d4c8d', fontWeight: 600 }}>Pending</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#2d4c8d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>2</div>
              <div style={{ fontSize: '1.35rem', lineHeight: 1.5 }}>
                Secure land for first housing unit: <span style={{ color: '#2d4c8d', fontWeight: 600 }}>Upcoming</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#2d4c8d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>3</div>
              <div style={{ fontSize: '1.35rem', lineHeight: 1.5 }}>
                Open applications for housing: <span style={{ color: '#2d4c8d', fontWeight: 600 }}>Upcoming</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#2d4c8d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>4</div>
              <div style={{ fontSize: '1.35rem', lineHeight: 1.5 }}>
                Launch donation platform: <span style={{ color: '#2d4c8d', fontWeight: 600 }}>Upcoming</span>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Housing Units Created</h2>
          <ul style={{ fontSize: '1.35rem', lineHeight: 1.7 }}>
            <li>0 units created (first project in progress)</li>
          </ul>
        </section>
      </div>
      {/* Vertical divider */}
      <div className="progress-divider" style={{
        width: 1,
        background: '#bbb',
        alignSelf: 'stretch',
        minHeight: 320,
        margin: '0 1.2rem',
        opacity: 0.5,
        display: 'block',
      }} />
      {/* Right column: Social Media */}
      <div style={{ flex: 1, minWidth: 290, maxWidth: 520 }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Latest from Social Media</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* YouTube */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://www.youtube.com/@becauseitsfair" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#eee',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  marginBottom: 8
                }}>
                  No posts yet
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>YouTube</div>
              </a>
            </div>
            {/* Instagram */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://www.instagram.com/becauseitsfair/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#eee',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  marginBottom: 8
                }}>
                  No posts yet
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>Instagram</div>
              </a>
            </div>
            {/* Facebook */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://www.facebook.com/becauseitsfair/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#eee',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  marginBottom: 8
                }}>
                  No posts yet
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>Facebook</div>
              </a>
            </div>
            {/* TikTok */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://www.tiktok.com/@becauseitsfair" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#eee',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  marginBottom: 8
                }}>
                  No posts yet
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>TikTok</div>
              </a>
            </div>
            {/* X */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://x.com/becauseitsfair" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#eee',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  marginBottom: 8
                }}>
                  No posts yet
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>X</div>
              </a>
            </div>
            {/* Twitch */}
            <div style={{ textAlign: 'center' }}>
              <a href="https://www.twitch.tv/universalhousing" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  background: '#eee',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontWeight: 600,
                  fontSize: '1.35rem',
                  marginBottom: 8
                }}>
                  No posts yet
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>Twitch</div>
              </a>
            </div>
          </div>
        </section>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .progress-divider { display: none !important; }
        }
      `}</style>
    </div>
  );
} 