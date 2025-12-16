import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2";
import profilePic from "../assets/profile.jpg";
import Aside from "./Aside";

const Header = () => {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <header className="flex h-[74px] items-center justify-between gap-4 rounded-lg bg-white p-4 lg:px-7 lg:py-4 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger for mobile */}
        <button className="block xl:hidden" onClick={() => setMobileNav(true)}>
          <HiOutlineBars3CenterLeft size={27} className="text-gold-400" />
        </button>
        <div>
          <h2 className="text-dark-text text-xl lg:text-2xl font-medium capitalize truncate w-[150px] md:w-full">
            PathName
          </h2>
        </div>
      </div>

      {/* Right Section */}

      <div className="flex gap-3 items-center">
        <img
          src={profilePic}
          alt="Profile"
          className="rounded-full w-9 h-9 sm:w-10 sm:h-10 object-cover"
        />{" "}
        <div className="hidden md:flex flex-col gap-1">
          <h3 className="text-[18px] text-primary">Alexandera</h3>
          <p className="text-[10px] text-primary">alex@mail.com</p>
        </div>
      </div>

      {/* Mobile Aside  */}
      <div
        className={`block xl:hidden fixed w-full h-full inset-0 bg-[#00000071] z-50 transition-all duration-500 ${
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
        >
          <Aside />
        </div>
      </div>
    </header>
  );
};

export default Header;
