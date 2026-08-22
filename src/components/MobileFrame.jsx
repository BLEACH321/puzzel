import React, { useState } from 'react';

export function MobileFrame({ children }) {
  const [deviceMode, setDeviceMode] = useState('iphone');

  return (
    <div className="device-wrapper">
      {/* Desktop Preview Switcher Toolbar */}
      <div className="device-switcher-bar">
        <button
          className={`switcher-btn ${deviceMode === 'iphone' ? 'active' : ''}`}
          onClick={() => setDeviceMode('iphone')}
        >
          📱 iPhone 15
        </button>
        <button
          className={`switcher-btn ${deviceMode === 'pixel' ? 'active' : ''}`}
          onClick={() => setDeviceMode('pixel')}
        >
          📱 Pixel 8
        </button>
        <button
          className={`switcher-btn ${deviceMode === 'fullscreen' ? 'active' : ''}`}
          onClick={() => setDeviceMode('fullscreen')}
        >
          💻 Full View
        </button>
      </div>

      {/* The Native Phone Screen */}
      <div className={`mobile-phone-frame mode-${deviceMode}`}>
        {/* Status Bar & Dynamic Island */}
        <div className="phone-notch-bar">
          <span>9:41</span>
          <div className="phone-dynamic-island"></div>
          <span>📶 5G 🔋</span>
        </div>

        {/* Scrollable Mobile Viewport */}
        <main className="app-screen-container">
          {children}
        </main>

        {/* Bottom Swipe Indicator */}
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  );
}
