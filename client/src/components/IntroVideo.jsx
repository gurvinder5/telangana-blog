import React, { useRef, useState, useEffect } from 'react';

const IntroVideo = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto-play on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay blocked, still allow skip
      });
    }
  }, []);

  const handleEnd = () => {
    triggerFadeOut();
  };

  const handleSkip = () => {
    triggerFadeOut();
  };

  const triggerFadeOut = () => {
    setFading(true);
    setTimeout(() => {
      onFinish();
    }, 700); // Match fade-out duration
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease-in-out',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        autoPlay
        muted={false}
        playsInline
        onEnded={handleEnd}
        onTimeUpdate={handleTimeUpdate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #0d9488, #f59e0b)',
          transition: 'width 0.3s linear',
          zIndex: 2,
        }}
      />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2rem',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50px',
          padding: '0.55rem 1.4rem',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '0.04em',
          transition: 'all 0.2s ease',
          zIndex: 3,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Skip
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 4 15 12 5 20 5 4" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      </button>

      {/* Branding watermark */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.75rem',
          color: 'rgba(255,255,255,0.75)',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #2dd4bf, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          zIndex: 3,
        }}
      >
        Telangana Tourism Blog
      </div>
    </div>
  );
};

export default IntroVideo;
