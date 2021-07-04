import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getFollowers = createAsyncThunk("user/followers", async ({curr2Index,user}) => {
  const data  = await FetchData(`/user/getuserdata/${user}?currIndex=${curr2Index}&data=followers`,{method:"POST"});
  return data;
});

const FollowersSlice = createSlice({
  name: "followers",
  initialState: {
    isFetchingfollower: true,
    Followers: [],
    curr2Index:0,
  },
  extraReducers: {
    [getFollowers.fulfilled]: (state, action) => {
      state.isFetchingfollower = action.payload.users.length!==0;
      state.curr2Index = state.curr2Index + action.payload.users.length;
      state.Followers = [...state.Followers,action.payload.users];
    },
  },
});

export default FollowersSlice.reducer;