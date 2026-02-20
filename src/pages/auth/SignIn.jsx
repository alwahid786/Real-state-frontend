import SignInView from "../../features/auth/views/SignInView";
import { useLoginMutation } from "../../features/auth/rtk/authApis";
import { userExist } from "../../features/auth/rtk/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginMutation();
  const handleLoginUser = async (email, password) => {
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields.");
        return;
      }
      const res = await loginUser({ email, password }).unwrap();
      if (res.success) {
        // Store token so APIs work cross-origin in production (Bearer header)
        const token = res.data?.accessToken || res.data?.token;
        if (token) {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("token", token);
        }
        toast.success(res.message || "Login successful!");
        dispatch(userExist(res.data));
        navigate("/users");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <SignInView handleLoginUser={handleLoginUser} isLoading={isLoading} />
    </>
  );
};

export default SignIn;
