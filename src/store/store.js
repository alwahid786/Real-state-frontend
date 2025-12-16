import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/rtk/authSlice.js";
import authApis from "../features/auth/rtk/authApis.js";
import userSlice from "../features/users/rtk/userSlice.js";
import userApis from "../features/users/rtk/userApis.js";

const store = configureStore({
  reducer: {
    // Auth slices and apis
    [authSlice.name]: authSlice.reducer,
    [authApis.reducerPath]: authApis.reducer,
    // User slices and apis
    [userSlice.name]: userSlice.reducer,
    [userApis.reducerPath]: userApis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApis.middleware)
      .concat(userApis.middleware),
});

export default store;
