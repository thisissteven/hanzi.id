import React from "react";

export function Loader() {
  return (
    <React.Fragment>
      <style jsx global>{`
        .container {
          --uib-size: 40px;
          --uib-color: #cecece;
          --uib-speed: 0.8s;
          --uib-bg-opacity: 0.1;
          height: var(--uib-size);
          width: var(--uib-size);
          transform-origin: center;
          animation: rotate var(--uib-speed) linear infinite;
          will-change: transform;
          overflow: visible;
        }

        .car {
          fill: none;
          stroke: var(--uib-color);
          stroke-dasharray: 25, 75;
          stroke-dashoffset: 0;
          stroke-linecap: round;
          transition: stroke 0.5s ease;
        }

        .track {
          fill: none;
          stroke: var(--uib-color);
          opacity: var(--uib-bg-opacity);
          transition: stroke 0.5s ease;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <svg className="container" viewBox="0 0 40 40" height="40" width="40">
        <circle className="track" cx="20" cy="20" r="17.5" pathLength="100" strokeWidth="5px" fill="none" />
        <circle className="car" cx="20" cy="20" r="17.5" pathLength="100" strokeWidth="5px" fill="none" />
      </svg>
    </React.Fragment>
  );
}
