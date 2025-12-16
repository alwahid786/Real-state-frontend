import React from "react";

const PlusIcon = ({ width = 15, height = 15, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor" // ⭐ use currentColor for hover-friendly
  >
    <path
      d="M7.41667 0.75C8.71009 0.749764 9.97566 1.12579 11.0591 1.83224C12.1426 2.53869 12.9971 3.54506 13.5186 4.72869C14.0401 5.91232 14.2061 7.2221 13.9962 8.49839C13.7863 9.77468 13.2097 10.9624 12.3367 11.9167M7.41667 4.75V10.0833M10.0833 7.41667H4.75M1.08333 5.33333C0.8709 5.97911 0.758489 6.65357 0.75 7.33333M1.30339 10.0833C1.67772 10.9446 2.22977 11.717 2.92339 12.35M2.50749 2.90662C2.69351 2.70411 2.89189 2.5133 3.10149 2.33529M5.17936 13.6967C6.84183 14.2889 8.67129 14.1978 10.2667 13.4434"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PlusIcon;
