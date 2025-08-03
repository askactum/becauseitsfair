import { useNavigate } from 'react-router-dom';
import labLogo from '../assets/lab_w.png';
import './Lab.css';

export default function Lab() {
  const navigate = useNavigate();
  return (
    <div className="lab-container">
      <img
        src={labLogo}
        alt="Actum Lab Logo"
        className="lab-logo"
      />
      <p className="lab-description">
        A live global idea forum where volunteers shape the future of shelter. Contributors gather here to reimagine what's possible, debate strategies, ask questions, and propose new systems. From ethics to technology, the Lab is where Actum's mission evolves— together, with you.
      </p>
      <button
        className="lab-button"
        onClick={() => navigate('/lab-transition')}
      >
        Enter The LAB
      </button>
    </div>
  );
}