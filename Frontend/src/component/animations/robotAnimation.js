import React from "react";

const RobotAnimation = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>
      {`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .eye { animation: blink 2s infinite; }
      `}
    </style>
    <circle cx="100" cy="100" r="90" fill="#e0e0e0" />
    <circle cx="100" cy="85" r="40" fill="#c0c0c0" />
    <circle cx="85" cy="80" r="10" fill="#ffffff" className="eye" />
    <circle cx="115" cy="80" r="10" fill="#ffffff" className="eye" />
    <rect x="70" y="120" width="60" height="20" rx="10" fill="#a0a0a0" />
  </svg>
);

export default RobotAnimation;
