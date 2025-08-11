import './App.css';
import './fade-transition.css';
import { useState, useEffect } from 'react';
import logo from './assets/Actum_Official_Logo.jpg';
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
import { motion } from 'framer-motion';
import shopImg from './assets/shop.png';
import donateImg from './assets/donate.png';
import labImg from './assets/lab.png';
import Lab from './pages/Lab';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { label: 'mission', path: '/mission' },
  { label: 'team', path: '/team' },
  { label: 'our plan', path: '/plan' },
  { label: 'track our progress', path: '/progress' },
  { label: 'application for housing', path: '/applications' },
  { label: 'donate', path: '/donate' },
  { label: 'contact', path: '/contact' },
  { label: 'the laboratory', path: '/lab' },
  { label: 'shop', path: '/shop' },
];

const socialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@becauseitsfair', icon: <FaYoutube /> },
  { label: 'Instagram', href: 'https://www.instagram.com/becauseitsfair/', icon: <FaInstagram /> },
  { label: 'Facebook', href: 'https://www.facebook.com/becauseitsfair/', icon: <FaFacebook /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@becauseitsfair', icon: <FaTiktok /> },
  { label: 'X', href: 'https://x.com/becauseitsfair', icon: <FaXTwitter /> },
  { label: 'Twitch', href: 'https://www.twitch.tv/universalhousing', icon: <FaTwitch /> },
];

function Navigation() {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  // Responsive detection for mobile and smaller screens
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1024);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <header className="top-nav" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      zIndex: 1000, 
      background: '#fff', 
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      padding: '1rem 2rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        gap: '2rem'
      }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          marginRight: 'auto'
        }}>
          <img src={logo} alt="ACTUM Logo" style={{ width: 40, height: 40, borderRadius: 8, marginRight: '1rem' }} />
          <span style={{ 
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#222',
            fontFamily: 'Georgia, serif'
          }}>
            because it's fair
          </span>
        </Link>
        {isMobile ? (
          <button
            className="dropdown-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setShowMobileMenu((s) => !s)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              background: 'none',
              border: 'none'
            }}>
            Menu &#9662;
          </button>
        ) : (
          <ul className="nav-links">
            {sidebarLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isMobile && showMobileMenu && (
        <div style={{
          width: '100%',
          background: '#fff',
          borderTop: '1px solid #eee',
          padding: '1rem 2rem'
        }}>
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              style={{
                display: 'block',
                padding: '0.5rem 0',
                color: '#222',
                textDecoration: 'none',
                fontFamily: 'Georgia, serif',
                fontSize: '1rem'
              }}
              onClick={() => setShowMobileMenu(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function QuickAccessIcons() {
  return (
    <div style={{
      position: 'fixed',
      right: '2rem',
      bottom: '2rem',
      display: 'flex',
      gap: '1rem',
      zIndex: 2100
    }}>
      <Link to="/shop" title="Shop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={shopImg} alt="Shop" style={{ width: 40, height: 40 }} />
      </Link>
      <Link to="/donate" title="Donate" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={donateImg} alt="Donate" style={{ width: 40, height: 40 }} />
      </Link>
      <Link to="/lab" title="Visit the Lab" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={labImg} alt="Visit the Lab" style={{ width: 40, height: 40 }} />
      </Link>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="main-layout">
      <Navigation />
      <div className="content-area">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/team" element={<Team />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </div>
      </div>
      <QuickAccessIcons />
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
