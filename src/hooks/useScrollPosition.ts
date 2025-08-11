import { useEffect, useRef } from 'react';

export function useScrollPosition() {
  const position = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      position.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}
