import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getProfile = createAsyncThunk("user/profile", async ({user}) => {
  const data  = await FetchData(`/user/${user}`);
  return data;
});

const ProfileSlice = createSlice({
  name: "profile",
  initialState: {
    isFetchingProfile: true,
    profile: {},    
  },
  extraReducers: {
    [getProfile.fulfilled]: (state, action) => {
      state.isFetchingProfile = false;      
      state.profile = action.payload.profile;
    },
  },
});

export default ProfileSlice.reducer;