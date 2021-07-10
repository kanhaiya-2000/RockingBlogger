import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const Fetchfollowingpeople = createAsyncThunk("user/followingpeople", async ({currIndex,user}) => {
  const data  = await FetchData(`/user/getuserdata/${user}?currIndex=${currIndex}&data=following`);
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
    ClearFollowingPeople(state,action){
      state.isFetchingfollowing=true;
      state.Followingpeople= [];
      state.currIndex=0     
    },
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
    [Fetchfollowingpeople.fulfilled]: (state, action) => {
      state.isFetchingfollowing = action.payload.users.length!==0;
      state.currIndex = state.currIndex + action.payload.users.length;
      state.Followingpeople = [...state.Followingpeople,...action.payload.users];
    },
  },
});

export const {
  FollowUnfollowStatusInAlreadyFollowing,
  addToFollowingList,
  ClearFollowingPeople,
  removeFromFollowingList
} = FollowingpeopleSlice.actions;

export default FollowingpeopleSlice.reducer;