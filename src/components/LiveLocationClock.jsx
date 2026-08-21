import React, { useState, useEffect } from 'react';
import './LiveLocationClock.css';

/**
 * LiveLocationClock
 * 
 * Inspired by parthh.in
 * Displays real-time local time for Atharav (Manipal / Bangalore, IN, Asia/Kolkata)
 * with an active glowing LED pulse indicator.
 */
export default function LiveLocationClock({
  timezone = 'Asia/Kolkata',
  locationLabel = 'BLR / MANIPAL, IN',
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setTimeStr(formatted);
      } catch {
        setTimeStr(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="live-location-clock-pill" title={`Local Time in ${locationLabel}`}>
      <span className="live-status-dot" aria-hidden="true" />
      <span className="location-label">{locationLabel}</span>
      <span className="live-time-value">{timeStr || '--:--:--'}</span>
    </div>
  );
}
