import { useState } from "react";

const Checkbox = ({ size = 16, className }) => {
  const [checked, setChecked] = useState(false);

  const toggleChecked = () => setChecked((prev) => !prev);

  return (
    <div
      className={`inline-block cursor-pointer ${className}`}
      onClick={toggleChecked}
    >
      {checked ? (
        // Checked SVG
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_56_133)">
            <path
              d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
              fill="url(#paint0_linear_56_133)"
            />
            <path
              d="M13.3337 4L6.00033 11.3333L2.66699 8"
              stroke="#FAFAFA"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <path
            d="M2 0.5H14C14.8284 0.5 15.5 1.17157 15.5 2V14C15.5 14.8284 14.8284 15.5 14 15.5H2C1.17157 15.5 0.5 14.8284 0.5 14V2C0.5 1.17157 1.17157 0.5 2 0.5Z"
            stroke="url(#paint1_linear_56_133)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_56_133"
              x1="8"
              y1="-18.4615"
              x2="8"
              y2="16"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E6CE65" />
              <stop offset="1" stopColor="#7C5825" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_56_133"
              x1="8"
              y1="-18.4615"
              x2="8"
              y2="16"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#E6CE65" />
              <stop offset="1" stopColor="#7C5825" />
            </linearGradient>
            <clipPath id="clip0_56_133">
              <path
                d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
                fill="white"
              />
            </clipPath>
          </defs>
        </svg>
      ) : (
        // Unchecked SVG
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="15"
            height="15"
            rx="2"
            stroke="#E6CE65"
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
};

export default Checkbox;
