const HamburgerIcon = ({ className = "", onClick, color = "black" }) => {
  return (
    <button onClick={onClick} className={className}>
      <svg
        width="27"
        height="25"
        viewBox="0 0 27 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.5 4.62189H2.20429H24.7957H13.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.20429 20.3777H24.7957"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 14.4108H2.20429H24.7957H13.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default HamburgerIcon;
