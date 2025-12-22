import { useState } from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import Aside from "./Aside";
import { useSelector } from "react-redux";
import { getUserInitial, getAvatarColor } from "../utils/avatar";

const routeTitles = {
  "/users": "Users",
  "/create-new-comp": "Main",
  "/history": "Properties",
};

const Header = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const currentTab = routeTitles[location.pathname] || "Main";
  const initial = getUserInitial(user);
  const avatarColor = getAvatarColor(initial);

  return (
    <header className="flex h-18.5 items-center justify-between gap-4 rounded-lg bg-white p-4 lg:px-7 lg:py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button className="block xl:hidden" onClick={() => setMobileNav(true)}>
          <HiOutlineBars3CenterLeft size={27} className="text-gold-400" />
        </button>
        <div>
          <h2 className="text-dark-text text-xl lg:text-[24px] font-medium capitalize truncate w-37.5 md:w-full">
            {currentTab}
          </h2>
        </div>
      </div>

      {/* Profile */}
      <div className="flex gap-3 items-center">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${avatarColor}`}
        >
          {initial}
        </div>

        <div className="hidden md:flex flex-col gap-1">
          <h3 className="text-[14px] text-primary">{user?.name || "—"}</h3>
          <p className="text-[10px] text-primary">{user?.email || "—"}</p>
        </div>
      </div>

      {/* Mobile Aside  */}
      <div
        className={`block xl:hidden fixed inset-0 bg-[#00000071] z-50 transition-all duration-500 ${
          mobileNav
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileNav(false)}
      >
        <div
          className={`absolute top-3 left-3 h-[calc(100svh-24px)] transition-transform duration-500 ${
            mobileNav ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Aside />
        </div>
      </div>
    </header>
  );
};

export default Header;
