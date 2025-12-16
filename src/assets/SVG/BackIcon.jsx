const BackIcon = ({ width = 38, height = 24, fill = "#71717A", className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 38 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4198 0.706939C15.2016 1.58415 15.1356 2.9401 14.2697 3.73361L7.59474 9.85723H35.8889C37.0549 9.85723 38 10.8165 38 12C38 13.1836 37.0549 14.1428 35.8889 14.1428H7.59474L14.2697 20.2664C15.1356 21.0599 15.2015 22.4159 14.4198 23.2931C13.638 24.172 12.3037 24.2406 11.4378 23.4471L0.695995 13.5903C0.252322 13.1835 0 12.606 0 12C0 11.394 0.252347 10.8165 0.695995 10.4097L11.4378 0.552907C12.3037 -0.240606 13.638 -0.171934 14.4198 0.706939Z"
        fill={fill}
      />
    </svg>
  );
};

export default BackIcon;
