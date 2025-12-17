import SignInView from "../../features/auth/views/SignInView";
import { useLoginMutation } from "../../features/auth/rtk/authApis";
import { userExist } from "../../features/auth/rtk/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const SignIn = () => {
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();
  const handleLoginUser = async (email, password) => {
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields.");
        return;
      }
      const res = await loginUser({ email, password }).unwrap();
      console.log("Login response:", res);
      if (res.success) {
        toast.success(res.message || "Login successful!");
        dispatch(userExist(res.data));
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
