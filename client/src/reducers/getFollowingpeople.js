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
  reducers:{
    FollowUnfollowStatusInAlreadyFollowing(state,action){
      state.Followingpeople.forEach(function(x){
        if(x._id===action.payload){
          x.isFollowing = !x.isFollowing;
        }
      })
    },
    addToFollowingList(state,action){
      state.Followingpeople = [
        action.payload,
        ...state.Followingpeople
      ]
    },
    removeFromFollowingList(state,action){
      state.Followingpeople = state.Followingpeople.filter(function(x){return x._id!==action.payload})
    }
  },
  extraReducers: {
    [getFollowingpeople.fulfilled]: (state, action) => {
      state.isFetchingfollowing = action.payload.users.length!==0;
      state.curr3Index = state.curr3Index + action.payload.users.length;
      state.Followingpeople = [...state.Followingpeople,action.payload.users];
    },
  },
});

export const {
  FollowUnfollowStatusInAlreadyFollowing,
  addToFollowingList,
  removeFromFollowingList
} = FollowingpeopleSlice.actions;

export default FollowingpeopleSlice.reducer;