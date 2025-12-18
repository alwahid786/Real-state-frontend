import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { users: [] },
  reducers: {
    userNotExists: (state) => {
      state.users = [];
    },
  },
});

export const { userNotExists } = userSlice.actions;
export default userSlice;
