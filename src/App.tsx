import './App.css';
import './fade-transition.css';
import { useState } from 'react';
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
import { FaYoutube, FaInstagram, FaFacebook, FaTiktok, FaXTwitter } from 'react-icons/fa6';

const sidebarLinks = [
  { label: 'mission', href: '/mission' },
  { label: 'team', href: '/team' },
  { label: 'our plan', href: '/plan' },
  { label: 'donate', href: '/donate' },
  { label: 'contact', href: '/contact' },
  { label: 'the laboratory', href: '/laboratory' },
  { label: 'shop', href: '/shop' },
];

const socialLinks = [
  { label: 'YouTube', href: 'https://www.youtube.com/@becauseitsfair', icon: <FaYoutube /> },
  { label: 'Instagram', href: 'https://www.instagram.com/becauseitsfair/', icon: <FaInstagram /> },
  { label: 'Facebook', href: 'https://www.facebook.com/becauseitsfair/', icon: <FaFacebook /> },
  { label: 'TikTok', href: 'https://www.tiktok.com/@becauseitsfair', icon: <FaTiktok /> },
  { label: 'X', href: 'https://x.com/becauseitsfair', icon: <FaXTwitter /> },
];

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/mission" element={<Mission />} />
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<main className="main-content"><Team /></main>} />
      <Route path="/plan" element={<main className="main-content"><Plan /></main>} />
      <Route path="/donate" element={<main className="main-content"><Donate /></main>} />
      <Route path="/contact" element={<main className="main-content"><Contact /></main>} />
      <Route path="/laboratory" element={<main className="main-content"><Laboratory /></main>} />
      <Route path="/shop" element={<main className="main-content"><Shop /></main>} />
    </Routes>
  );
}

function AppLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const location = useLocation();
  return (
    <div className="main-layout fit-one-page">
      <button className="hamburger top-right" onClick={toggleSidebar} aria-label="Toggle navigation menu">
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      {showSidebar && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <div className="sidebar-container">
        <aside className={`sidebar always-visible${showSidebar ? ' open-mobile' : ''}`}> 
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
                  <Link
                    to={link.href}
                    className={`sidebar-link main-link${isActive ? ' active' : ''}`}
                    onClick={() => setShowSidebar(false)}
                  >
                    {link.label}
                    {isActive && <div className="underline" />}
                  </Link>
                </div>
              );
            })}
          </nav>
          <div className="sidebar-socials bottom">
            {socialLinks.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" title={link.label} className="icon">
                {link.icon}
              </a>
            ))}
          </div>
        </aside>
      </div>
      <div className="content-area with-sidebar">
        <header className="top-nav always-centered">
          <div className="nav-buttons">
            <Link to="/shop"><button>shop</button></Link>
            <Link to="/laboratory"><button>the laboratory</button></Link>
            <Link to="/donate"><button>donate</button></Link>
          </div>
        </header>
        <AnimatedRoutes />
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
