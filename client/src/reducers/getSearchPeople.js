import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchSearchedUser = createAsyncThunk("user/search", async ({currIndex,term}) => {
  const body = {
    term:term
  }
  const data  = await FetchData(`/user/search?currIndex=${currIndex}`,{body:body});
  return data;
});

const SearchedUserSlice = createSlice({
  name: "searchpeople",
  initialState: {
    isFetching: true,
    SearchedUsers: [],
    currIndex:0,
  },
  reducers:{ 
    ClearSearchPeople(state,action){
      console.log("clearing...");
      state.currIndex=0;
      state.SearchedUsers= [];
      state.isFetching=true;
      
           
    },
    FollowUnfollowSearchPeople(state,action){
      state.SearchedUsers.forEach(function(x){
        if(x._id===action.payload){
          x.isFollowing = !x.isFollowing;
        }
      })
    }
  },
  
  extraReducers: {
    [FetchSearchedUser.fulfilled]: (state, action) => {
      state.isFetching = action.payload.users.length!==0;
      state.currIndex = state.currIndex + action.payload.users.length;
      state.SearchedUsers = [...state.SearchedUsers,...action.payload.users];
    },
  },
});

export const {
  FollowUnfollowSearchPeople,
  ClearSearchPeople
} = SearchedUserSlice.actions;

export default SearchedUserSlice.reducer;