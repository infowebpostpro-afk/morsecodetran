import React from 'react';

export function ChromeIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ verticalAlign: 'middle', flexShrink: 0 }}
    >
      <circle cx="16" cy="16" r="14" fill="#ffffff" fillOpacity="0.08" />
      {/* Red Section */}
      <path
        d="M16 4C21.72 4 26.47 8.05 27.64 13.43H16C13.79 13.43 11.91 14.88 11.23 16.89L5.34 6.7C8.16 5.02 11.91 4 16 4Z"
        fill="#EA4335"
      />
      {/* Yellow Section */}
      <path
        d="M27.64 13.43C27.88 14.25 28 15.11 28 16C28 22.63 22.63 28 16 28C13.91 28 11.94 27.46 10.23 26.51L16 16.5C17.38 16.5 18.63 17.31 19.2 18.55L27.64 13.43Z"
        fill="#FBBC05"
      />
      {/* Green Section */}
      <path
        d="M10.23 26.51C6.48 24.44 4 20.5 4 16C4 12.3 5.67 9 8.3 6.82L14.19 17.01C13.51 18.15 13.68 19.61 14.62 20.56L10.23 26.51Z"
        fill="#34A853"
      />
      {/* White Ring */}
      <circle cx="16" cy="16" r="5.5" fill="#FFFFFF" />
      {/* Blue Center */}
      <circle cx="16" cy="16" r="4.2" fill="#1A73E8" />
    </svg>
  );
}
