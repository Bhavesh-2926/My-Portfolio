import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch screen
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Track interactive elements
    const handleElementHover = () => {
      const interactiveEls = document.querySelectorAll('a, button, input, textarea, [role="button"], .interactive-cursor');
      interactiveEls.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    handleElementHover();
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);

  // Smooth lerp for trailing cursor
  useEffect(() => {
    if (isTouch) return;
    let animationId: number;

    const follow = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18
      }));
      animationId = requestAnimationFrame(follow);
    };

    animationId = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationId);
  }, [position, isTouch]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Central Cyan Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
          width: '6px',
          height: '6px',
          backgroundColor: '#00F0FF',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 0 10px #00F0FF'
        }}
      />
      {/* Smooth Trailing Follower Ring */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%) scale(${isHovered ? 1.7 : 1})`,
          width: '32px',
          height: '32px',
          border: `1.5px solid ${isHovered ? '#00F0FF' : 'rgba(0, 240, 255, 0.4)'}`,
          backgroundColor: isHovered ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'transform 0.15s ease-out, border-color 0.2s ease, background-color 0.2s ease',
          boxShadow: isHovered ? '0 0 18px rgba(0, 240, 255, 0.35)' : 'none'
        }}
      />
    </>
  );
};
