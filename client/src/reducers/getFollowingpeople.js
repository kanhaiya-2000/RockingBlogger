import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getFollowingpeople = createAsyncThunk("user/followingpeople", async ({curr3Index,user}) => {
  const data  = await FetchData(`/user/getuserdata/${user}?currIndex=${curr3Index}&data=followers`,{method:"POST"});
  return data;
});

const FollowingpeopleSlice = createSlice({
  name: "followingpeople",
  initialState: {
    isFetchingfollowing: true,
    Followingpeople: [],
    currIndex:0,
  },
  extraReducers: {
    [getFollowingpeople.fulfilled]: (state, action) => {
      state.isFetchingfollowing = action.payload.users.length!==0;
      state.curr3Index = state.curr3Index + action.payload.users.length;
      state.Followingpeople = [...state.Followingpeople,action.payload.users];
    },
  },
});

export default FollowingpeopleSlice.reducer;