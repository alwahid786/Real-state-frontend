// Icons
import HomeIcon from "../../src/assets/SVG/HomeIcon";
import HistoryIcon from "../../src/assets/SVG/HistoryIcon";
import UserIcon from "../../src/assets/SVG/UserIcon";
import LogoutIcon from "../../src/assets/SVG/LogoutIcon";
import { MdKeyboardArrowLeft } from "react-icons/md";
// Logo
import Logo from "/Logo.png";
import { useState } from "react";
import { useLogoutMutation } from "../features/auth/rtk/authApis";
import { FiLoader } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../features/auth/rtk/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const pages = [
  {
    id: 1,
    title: "Create New Comp.",
    link: ["/create-new-comp"],
    icon: <HomeIcon />,
  },
  {
    id: 2,
    title: "Users",
    link: ["/users"],
    icon: <UserIcon />,
  },
  {
    id: 3,
    title: "History",
    link: ["/history"],
    icon: <HistoryIcon />,
  },
];

const Aside = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [logout, { isLoading }] = useLogoutMutation();

  const currentUser = useSelector((state) => state.auth.user);
  const filteredPages = pages.filter((page) => {
    if (page.title === "Users" && currentUser?.role !== "admin") return false;
    return true;
  });

  const logoutHandler = async () => {
    try {
      const res = await logout().unwrap();
      if (res.success) {
        dispatch(userNotExist());
        navigate("/sign-in");
        toast.success(res.message || "Logout successful!");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <aside
      className={`h-[calc(100vh-16px)] bg-white rounded-lg relative transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Toggle Arrow */}
      <div
        className={`bg-primary rounded-lg p-1 absolute top-7.5 -right-3 cursor-pointer transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdKeyboardArrowLeft className="text-lg text-white" />
      </div>

      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 p-4">
          <img
            src={Logo}
            alt="Logo"
            className={`h-16 w-auto transition-all duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Menu */}
        <div className="border-y-2 border-[#F6F6F6] p-2 py-4 flex-1">
          <div className="flex flex-col gap-2">
            {filteredPages.map((page) => (
              <NavLink
                key={page.id}
                to={page.link[0]}
                className={({ isActive }) =>
                  `flex items-center rounded-lg p-3 transition-all duration-200
                     ${isOpen ? "gap-3 justify-start" : "justify-center"}
                     ${
                       isActive
                         ? "bg-primary text-white"
                         : "text-[#71717A] hover-primary-gradient hover:text-white"
                     }`
                }
              >
                {page.icon}
                {isOpen && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {page.title}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-2">
          <button
            disabled={isLoading}
            onClick={logoutHandler}
            className={`flex w-full items-center rounded-lg p-3 transition-all duration-200 text-[#D55F5A]
              ${isOpen ? "gap-3 justify-start" : "justify-center"}
              hover-primary-gradient hover:text-white`}
          >
            {isLoading ? <FiLoader className="animate-spin" /> : <LogoutIcon />}

            {isOpen && (
              <span className="text-sm font-medium whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
