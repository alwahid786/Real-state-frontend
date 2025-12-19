import { useState } from "react";

const Input = ({ label, cn = "", noActiveRed = false, ...props }) => {
  const [active, setActive] = useState(false);

  const borderColor =
    !noActiveRed && active ? "border-red-500" : "border-[#E4E4E7]";

  return (
    <div>
      {label && (
        <label className="font-medium text-sm md:text-base text-primary">
          {label}
        </label>
      )}

      <div className="relative mt-2">
        <input
          {...props}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className={`
            w-full h-12 px-4
            border ${borderColor} rounded-md
            outline-none text-sm
            ${cn}
          `}
        />
      </div>
    </div>
  );
};

export default Input;
