import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const Fetchfollowers = createAsyncThunk("user/followers", async ({curr2Index,user}) => {
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
  reducers:{
    FollowUnfollowStatus(state,action){
      state.Followers.forEach(function(x){
        if(x._id===action.payload){
          x.isFollowing = !x.isFollowing;
        }
      })
    }
  },
  extraReducers: {
    [Fetchfollowers.fulfilled]: (state, action) => {
      state.isFetchingfollower = action.payload.users.length!==0;
      state.curr2Index = state.curr2Index + action.payload.users.length;
      state.Followers = [...state.Followers,action.payload.users];
    },
  },
});

export const {
  FollowUnfollowStatus
} = FollowersSlice.actions;

export default FollowersSlice.reducer;