import { useEffect, useRef } from 'react';
import './Home.css';

export default function Home() {
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    if (titleRef.current) observer.observe(titleRef.current);
    contentRefs.current.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      contentRefs.current.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);
  return (
    <main className="main-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '3vh' }}>
      <div className="home-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div ref={titleRef} className="main-title" style={{ fontSize: '3.2rem', fontWeight: 500, marginBottom: '2.2rem', textAlign: 'center' }}>
          welcome to actum.
        </div>
        <div ref={el => { if (el) contentRefs.current[0] = el }} style={{ fontSize: '1.8rem', marginBottom: '2.5rem', color: '#333', textAlign: 'center' }}>
          we are building the first global network of rent-free homes—permanently.
        </div>
        <div ref={el => { if (el) contentRefs.current[1] = el }} style={{ fontSize: '1.5rem', marginBottom: '2.5rem', color: '#333', textAlign: 'left' }}>
          real units.<br />
          for everyone.<br />
          forever.<br />
          for good.
        </div>
        <div ref={el => { if (el) contentRefs.current[2] = el }} style={{ fontSize: '2.1rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: '#222' }}>
          because it’s fair.
        </div>
      </div>
    </main>
  );
}
