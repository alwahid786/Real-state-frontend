import BackIcon from "../../../assets/SVG/BackIcon";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useResetpasswordMutation } from "../rtk/authApis";
import { toast } from "react-toastify";

const ResetPasswordView = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [createPassword, setCreatePassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ResetPassowrd] = useResetpasswordMutation();

  const toggleShowCreatePassword = () => setShowCreatePassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  // password legnth
  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";

    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);

    if (pwd.length < 8) return "Weak";
    if (pwd.length >= 8 && (!hasNumber || !hasSpecial)) return "Medium";

    return "Strong";
  };

  const resetPasswordHandler = async () => {
    try {
      if (!token || !createPassword || !confirmPassword) {
        return toast.error("Please enter all fields");
      }

      if (passwordStrength === "Weak") {
        return toast.error(
          "Password must be at least 8 characters with number & special character"
        );
      }

      if (createPassword !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
      const res = await ResetPassowrd({
        token,
        password: createPassword,
        confirmPassword,
      }).unwrap();
      if (res.success) {
        toast.success(res.message);
        return navigate("/sign-in");
      }
    } catch (error) {
      console.log("Error while reseting password");
      toast.error(
        error.data.message || "Error while reseting password please try again"
      );
    }
  };

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && createPassword !== confirmPassword;
  const passwordStrength = getPasswordStrength(createPassword);

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

        <div className="mt-3 ml-2 sm:mt-5 md:ml-6 w-6 sm:w-10">
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
                      passwordStrength === "Weak"
                        ? "text-red-500"
                        : passwordStrength === "Medium"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {passwordStrength}
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
            {passwordStrength === "Weak" && (
              <p className="text-xs text-red-500 mt-1">
                Minimum 8 characters, include 1 number & 1 special character
              </p>
            )}

            {passwordsDoNotMatch && (
              <p className="text-xs text-red-500 mb-5">
                Passwords do not match
              </p>
            )}

            <Button
              onClick={resetPasswordHandler}
              text={"Reset Password"}
              cn={"h-[48px]"}
              disabled={
                passwordStrength === "Weak" ||
                !createPassword ||
                !confirmPassword ||
                passwordsDoNotMatch
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordView;
