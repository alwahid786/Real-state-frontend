import { Link } from "react-router-dom";
import BackIcon from "../../../assets/SVG/BackIcon";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
const ResetPassword = () => {
  return (
    <section className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Logo SEction */}
      <div className="w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen px-6 sm:px-10 lg:px-14 py-10 flex flex-col justify-center bg-black text-white">
        <img
          src={"/LogoPic.svg"}
          alt="Assets Hunters"
          className="w-36 sm:w-44 mb-8"
        />

        <h2 className="text-sm text-white sm:text-xl mb-4">
          Welcome Back to <span className="font-bold">ASSETS HUNTERS</span>
        </h2>

        <p className="text-sm sm:text-xl text-white leading-relaxed max-w-md">
          Manage properties, users, and handle operations — all in one place.
        </p>
      </div>
      <div className="mt-3 ml-3 sm:mt-5 md:ml-2 w-6 sm:w-10">
        <Link to={"/"}>
          <BackIcon />
        </Link>
      </div>

      {/* Content SEction */}
      <div className=" w-full lg:w-1/2 flex items-center justify-center bg-white px-4 sm:px-6 py-10 lg:rounded-l-[40px]">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold text-center mb-1">
            Reset Your Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter your email address below and we’ll send you a link to reset
            your password.
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <Input type="email" placeholder="email" />
          </div>

          {/* Errr Message */}
          <p className="text-xs text-red-500 mb-5">
            Invalid email or password. Please try again.
          </p>
          <Button text={"Send Reset Link"} cn={"h-[48px]"} />
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
