import Users from "../src/pages/users/Users";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import SignIn from "./pages/auth/SignIn";
import Main from "./pages/comp/Main";
import Properties from "./pages/comp/Properties";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import { useGetMyProfileMutation } from "./features/auth/rtk/authApis";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "./features/auth/rtk/authSlice";
import { useState } from "react";
import Spinner from "./components/shared/Spinner";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [getMyProfile] = useGetMyProfileMutation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) {
          const res = await getMyProfile().unwrap();
          if (res.success) {
            dispatch(userExist(res.data));
          } else {
            dispatch(userNotExist());
          }
        }
      } catch (error) {
        userNotExist();
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, getMyProfile, dispatch]);

  return (
    <Router>
      {loading ? (
        <Spinner size={60} />
      ) : (
        <Routes>
          <Route element={<ProtectedRoute user={!user} redirectUrl="/" />}>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/*  Layout Routes */}
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/" element={<Main />} />
              <Route path="/create-new-comp" element={<Main />} />
              <Route path="/users" element={<Users />} />
              <Route path="/history" element={<Properties />} />
            </Route>
          </Route>
        </Routes>
      )}
    </Router>
  );
};

export default App;
