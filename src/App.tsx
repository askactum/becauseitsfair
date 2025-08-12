import './App.css';
import './fade-transition.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/Actum_Official_Logo.jpg';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Team from './pages/Team';
import Plan from './pages/Plan';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Laboratory from './pages/Laboratory';
import Shop from './pages/Shop';
import Progress from './pages/Progress';
import Applications from './pages/Applications';
import { FaYoutube, FaInstagram, FaFacebook, FaTiktok, FaXTwitter, FaTwitch } from 'react-icons/fa6';
import { AnimatePresence, motion } from 'framer-motion';
import shopImg from './assets/shop.png';
import donateImg from './assets/donate.png';
import labImg from './assets/lab.png';
import Lab from './pages/Lab';

const sidebarLinks = [
  { label: 'mission', href: '/mission' },
  { label: 'team', href: '/team' },
  { label: 'our plan', href: '/plan' },
  { label: 'track our progress', href: '/progress' },
  { label: 'application for housing', href: '/applications' },
  { label: 'donate', href: '/donate' },
  { label: 'contact', href: '/contact' },
  { label: 'the laboratory', href: '/lab' },
  { label: 'shop', href: '/shop' },
];

const socialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@becauseitsfair', icon: <FaYoutube /> },
  { label: 'Instagram', href: 'https://www.instagram.com/becauseitsfair/', icon: <FaInstagram /> },
  { label: 'Facebook', href: 'https://www.facebook.com/becauseitsfair/', icon: <FaFacebook /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@becauseitsfair', icon: <FaTiktok /> },
  { label: 'X', href: 'https://x.com/becauseitsfair', icon: <FaXTwitter /> },
  { label: 'Twitch', href: 'https://www.twitch.tv/universalhousing', icon: <FaTwitch /> },
];

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        {[
          { path: '/', element: <Home /> },
          { path: '/mission', element: <Mission /> },
          { path: '/team', element: <Team /> },
          { path: '/plan', element: <Plan /> },
          { path: '/progress', element: <Progress /> },
          { path: '/donate', element: <Donate /> },
          { path: '/contact', element: <Contact /> },
          { path: '/lab', element: <Lab /> },
          { path: '/laboratory', element: <Laboratory /> },
          { path: '/shop', element: <Shop /> },
          { path: '/applications', element: <Applications /> },
        ].map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {element}
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLab, setShowLab] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Responsive detection for mobile and smaller screens
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024); // 1024px covers tablets and smaller
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  // Close menu on outside click
  useEffect(() => {
    if (!showMobileMenu) return;
    function handleClick(e: MouseEvent) {
      const menu = document.getElementById('mobile-floating-menu');
      const gear = document.getElementById('mobile-gear-icon');
      if (menu && !menu.contains(e.target as Node) && gear && !gear.contains(e.target as Node)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileMenu]);

  // Intercept navigation to /laboratory for transition
  useEffect(() => {
    if (location.pathname === '/laboratory' && !showLab) {
      setShowLab(true);
    } else if (location.pathname !== '/laboratory' && showLab) {
      setShowLab(false);
    }
  }, [location.pathname]);

  // Custom handler for Lab link click
  function handleLabClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    navigate('/lab');
  }

  return (
    <div className="main-layout fit-one-page">
      {/* White-to-black transition overlay */}
      {/* Top nav for mobile/tablet/small screens */}
      {isMobile && (
        <header className="top-nav mobile-dropdown-nav" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 1000, background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative',
            minHeight: 60
          }}>
            <Link to="/" tabIndex={-1} style={{display: 'flex', alignItems: 'center', marginLeft: '0.6rem', marginRight: '0.6rem'}}>
              <img src={logo} alt="ACTUM Logo" style={{width: 38, height: 38, borderRadius: 8, marginRight: '0.7rem'}} />
            </Link>
            <span style={{
              position: 'absolute',
              left: 0, right: 0,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#222',
              fontFamily: 'Georgia, serif',
              pointerEvents: 'none'
            }}>
              because it's fair
            </span>
            <button
              className="dropdown-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setShowDropdown((s) => !s)}
              style={{
                padding: '1rem',
                fontSize: '1.1rem',
                background: 'none',
                border: 'none',
                textAlign: 'right',
                marginLeft: 'auto'
              }}>
              Menu &#9662;
            </button>
          </div>
          {showDropdown && (
            <nav className="dropdown-menu" style={{width: '100%', background: '#fff', border: '1px solid #eee', borderTop: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.07)'}}>
              {sidebarLinks.map((link) => (
                link.href === '/lab' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`dropdown-link${location.pathname === link.href ? ' active' : ''}`}
                    style={{display: 'block', padding: '1rem 1.5rem', color: '#222', textDecoration: 'none', fontFamily: 'Georgia, serif', fontSize: '1.1rem'}}
                    onClick={e => { handleLabClick(e); setShowDropdown(false); }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`dropdown-link${location.pathname === link.href ? ' active' : ''}`}
                    style={{display: 'block', padding: '1rem 1.5rem', color: '#222', textDecoration: 'none', fontFamily: 'Georgia, serif', fontSize: '1.1rem'}}
                    onClick={() => setShowDropdown(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          )}
        </header>
      )}
      {/* Sidebar for larger screens */}
      {!isMobile && (
        <div className="sidebar-container">
          <aside className="sidebar always-visible">
            <div className="logo-block">
              <Link to="/" className="logo-link" tabIndex={-1} style={{display:'flex', flexDirection:'column', alignItems:'center', textDecoration:'none'}}>
                <img src={logo} alt="ACTUM Logo" className="logo-img-official" />
                {/* <div className="logo-title-official">ACTUM</div> */}
              </Link>
            </div>
            <nav className="sidebar-nav">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <div key={link.label} className="sidebar-link-block">
                    {link.href === '/lab' ? (
                      <Link
                        to={link.href}
                        className={`sidebar-link main-link${isActive ? ' active' : ''}`}
                        onClick={handleLabClick}
                      >
                        {link.label}
                        {isActive && <div className="underline" />}
                      </Link>
                    ) : (
                      <Link
                        to={link.href}
                        className={`sidebar-link main-link${isActive ? ' active' : ''}`}
                      >
                        {link.label}
                        {isActive && <div className="underline" />}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="sidebar-socials bottom">
{socialLinks.map(link => (
  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" title={link.label} className={`icon ${link.label.toLowerCase()}`}>
    {link.icon}
  </a>
))}
            </div>
          </aside>
        </div>
      )}
      <div className="content-area with-sidebar" style={{ marginTop: isMobile ? 60 : 0 }}>
        {/* Mobile floating gear icon and menu */}
        {isMobile && (
          <>
            <button
              id="mobile-gear-icon"
              className="floating-icon floating-gear"
              style={{ left: 10, bottom: 10, zIndex: 2100, border: 'none', position: 'fixed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}
              aria-label="Open quick menu"
              onClick={() => setShowMobileMenu((s) => !s)}
            >
              <GridIcon size={32} color="#222" />
            </button>
            {showMobileMenu && (
              <div id="mobile-floating-menu" style={{ position: 'fixed', left: 10, bottom: 80, zIndex: 2200, padding: '1.1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', alignItems: 'center', borderRadius: 16 }}>
                <Link to="/shop" className="floating-icon" title="Shop" style={{ position: 'static' }}>
                  <img src={shopImg} alt="Shop" />
                </Link>
                <Link to="/donate" className="floating-icon" title="Donate" style={{ position: 'static' }}>
                  <img src={donateImg} alt="Donate" />
                </Link>
                <a
                  href="/laboratory"
                  className="floating-icon"
                  title="Visit the Lab"
                  style={{ position: 'static', cursor: 'pointer' }}
                  onClick={e => { handleLabClick(e); setShowMobileMenu(false); }}
                >
                  <img src={labImg} alt="Visit the Lab" />
                </a>
              </div>
            )}
          </>
        )}
        {/* Persistent floating icons for desktop only */}
        {!isMobile && (
          <>
            <Link to="/shop" className="floating-icon floating-shop" title="Shop">
              <img src={shopImg} alt="Shop" />
            </Link>
            <Link to="/donate" className="floating-icon floating-donate" title="Donate">
              <img src={donateImg} alt="Donate" />
            </Link>
            <a
              href="/laboratory"
              className="floating-icon floating-lab"
              title="Visit the Lab"
              style={{ cursor: 'pointer' }}
              onClick={handleLabClick}
            >
              <img src={labImg} alt="Visit the Lab" />
            </a>
          </>
        )}
        <AnimatedRoutes />
        <div className="copyright-footer">
          © {new Date().getFullYear()} ACTUM. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

// Add GridIcon component
const GridIcon = ({ size = 32, color = '#222' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[0, 1, 2].map(row =>
      [0, 1, 2].map(col => (
        <circle
          key={`${row}-${col}`}
          cx={5 + col * 12}
          cy={5 + row * 12}
          r={3.5}
          fill={color}
        />
      ))
    )}
  </svg>
);
