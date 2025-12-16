import BackIcon from "../../../assets/SVG/BackIcon";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";

const CreatePasswordView = () => {
  const [createPassword, setCreatePassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowCreatePassword = () => setShowCreatePassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // password legnth
  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 6) return "Weak";
    if (pwd.length < 10) return "Medium";
    return "Strong";
  };
  console.log("Create Password Strength:", getPasswordStrength(createPassword));

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && createPassword !== confirmPassword;

  return (
    <div>
      <section className="min-h-screen w-full flex flex-col lg:flex-row">
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
          <Link to={"/reset-password"}>
            <BackIcon />
          </Link>
        </div>
        {/* Content Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 sm:px-6 py-10 lg:rounded-l-[40px]">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-1">
              Create New Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Enter New Password
            </p>

            {/* Create Paaword */}
            <div className="mb-4 relative">
              <div className="flex items-center justify-between mb-0 mr-1">
                <label className="block text-sm font-medium">
                  Create Password *
                </label>
                {createPassword && (
                  <span
                    className={`text-xs underline font-medium ${
                      getPasswordStrength(createPassword) === "Weak"
                        ? "text-red-500"
                        : getPasswordStrength(createPassword) === "Medium"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {getPasswordStrength(createPassword)}
                  </span>
                )}
              </div>
              <Input
                type={showCreatePassword ? "text" : "password"}
                placeholder="Create password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                className="pr-20"
              />

              <span
                className="absolute right-4 bottom-1 -translate-y-1/2
               flex items-center gap-1 cursor-pointer
               text-gray-500 text-sm bg-white pl-2"
                onClick={toggleShowCreatePassword}
              >
                {showCreatePassword ? "Hide" : "Show"}
                {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confrm Password */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">
                Confirm Password *
              </label>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-20"
              />

              {/* [1,2,3].map((item) => (<Checkbox key={item} />) */}

              <span
                className="absolute right-4 bottom-1 -translate-y-1/2
               flex items-center gap-1 cursor-pointer
               text-gray-500 text-sm bg-white pl-2"
                onClick={toggleShowConfirmPassword}
              >
                {showConfirmPassword ? "Hide" : "Show"}
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {passwordsDoNotMatch && (
              <p className="text-xs text-red-500 mb-5">
                Passwords do not match
              </p>
            )}

            <Button text={"Reset Password"} cn={"h-[48px]"} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatePasswordView;
