import React, { useRef, useState, useEffect } from 'react';

const IntroVideo = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Auto-play on mount
    if (videoRef.current) {
      // Ensure muted is true before playing to comply with browser policy
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Autoplay was prevented:", err);
            setIsPlaying(false);
          });
      }
    }
  }, []);

  const handleEnd = () => {
    triggerFadeOut();
  };

  const handleSkip = (e) => {
    e.stopPropagation();
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

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handlePlayVideo = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Play failed:", err);
        });
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Play failed:", err));
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuteState = !isMuted;
      videoRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
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
      {/* Dynamic Keyframes for Animations */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(45, 212, 191, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); }
        }
        @keyframes subtle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .play-btn-pulse {
          animation: pulse-ring 2s infinite ease-in-out;
        }
      `}</style>

      {/* Video element */}
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}intro.mp4`}
        autoPlay
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnd}
        onTimeUpdate={handleTimeUpdate}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          cursor: 'pointer',
        }}
      />

      {/* Large Central Play Overlay (shows only if video is paused / autoplay blocked) */}
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 10,
            pointerEvents: 'none', // Allow click to pass through to container/button
          }}
        >
          <button
            onClick={handlePlayVideo}
            className="play-btn-pulse"
            style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgba(45, 212, 191, 0.8)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto', // Enable pointer events for button
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.border = '2px solid rgba(245, 158, 11, 0.9)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
              e.currentTarget.style.border = '2px solid rgba(45, 212, 191, 0.8)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginLeft: '6px', color: '#fff' }}
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </button>
          <span
            style={{
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              animation: 'subtle-bounce 2s infinite ease-in-out',
            }}
          >
            Click to Play Experience
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #2dd4bf, #f59e0b)',
          transition: 'width 0.1s linear',
          zIndex: 2,
        }}
      />

      {/* Premium Watermark Brand Info (top-left) */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: '10px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <img src={`${import.meta.env.BASE_URL}logo-horizontal.png`} alt="Telangana Tourism" style={{ height: '32px', width: 'auto' }} />
      </div>

      {/* Audio Mute/Unmute toggle (bottom-left) */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '2rem',
          background: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '50px',
          padding: '0.6rem 1.3rem',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          letterSpacing: '0.04em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 3,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.35)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}
      >
        {isMuted ? (
          <>
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
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>Unmute Sound</span>
          </>
        ) : (
          <>
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
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Mute Sound</span>
          </>
        )}
      </button>

      {/* Skip button (bottom-right) */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2rem',
          background: 'rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '50px',
          padding: '0.6rem 1.4rem',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          letterSpacing: '0.04em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 3,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.55)';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.35)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}
      >
        <span>Skip</span>
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
          <polygon points="5 4 15 12 5 20 5 4" fill="none" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      </button>
    </div>
  );
};

export default IntroVideo;
