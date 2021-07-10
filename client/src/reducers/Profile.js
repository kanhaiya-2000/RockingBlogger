import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchProfile = createAsyncThunk("user/profile", async ({user,callback}) => {
  const data  = await FetchData(`/user/${user}`);
  return data;
});

const ProfileSlice = createSlice({
  name: "profile",
  initialState: {
    isFetchingProfile: true,
    Profile: {},    
  },
  reducers:{
    clearProfile(state,action){
      state.isFetchingProfile = true;
      state.Profile = {};
    },
    FollowUnfollowInProfile(state,action){
      if(action.payload===state.Profile._id){
        state.Profile = {
          ...state.Profile,
          isFollowing:!state.Profile.isFollowing
        }
      }
    }
  },
  extraReducers: {
    [FetchProfile.fulfilled]: (state, action) => {
      state.isFetchingProfile = false;      
      state.Profile = action.payload.profile||{};
    },
  },
});

export const {
  clearProfile,
  FollowUnfollowInProfile
} = ProfileSlice.actions;

export default ProfileSlice.reducer;