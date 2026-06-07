import { useEffect, useRef } from 'react';

export function useDevServerHeartbeat() {
  const lastActiveRef = useRef(Date.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateLastActive = () => {
      lastActiveRef.current = Date.now();
    };

    window.addEventListener('mousemove', updateLastActive);
    window.addEventListener('keydown', updateLastActive);
    window.addEventListener('click', updateLastActive);
    window.addEventListener('touchstart', updateLastActive);

    const interval = setInterval(() => {
      const inactiveFor = Date.now() - lastActiveRef.current;
      if (inactiveFor < 60_000) {
        fetch('/', { method: 'GET' }).catch(() => {
          // no-op: keep dev server alive
        });
      }
    }, 60_000 * 3);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateLastActive);
      window.removeEventListener('keydown', updateLastActive);
      window.removeEventListener('click', updateLastActive);
      window.removeEventListener('touchstart', updateLastActive);
    };
  }, []);
}
