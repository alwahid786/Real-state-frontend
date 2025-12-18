import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import { toast } from "react-toastify";

const SignInView = ({ handleLoginUser, isLoading }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await handleLoginUser(form.email, form.password);
    } catch (err) {
      toast.error(err?.message || "Login failed.");
    }
  };

  return (
    <section className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Logo Section */}
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

      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-4 sm:px-6 py-10 lg:rounded-l-[40px]">
        <form className="w-full max-w-md">
          <h2 className="text-xl font-semibold text-center mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Log in to your account.
          </p>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password *
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-500 mb-5">{error}</p>}

          <Button
            type="submit"
            text={"Sign in"}
            cn={`h-[48px] ${isLoading ? "opacity-30 pointer-events-none" : ""}`}
            disabled={isLoading}
            onClick={handleSubmit}
          />

          {/* Password Forgot */}
          <Link to={"/forget-password"}>
            <p className="text-sm text-center text-gray-500 underline mt-6 cursor-pointer">
              Forgot your password?
            </p>
          </Link>
        </form>
      </div>
    </section>
  );
};

export default SignInView;
