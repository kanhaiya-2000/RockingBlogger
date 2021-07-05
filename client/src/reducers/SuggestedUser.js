import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const getSuggestedUser = createAsyncThunk("user/suggested", async ({limit}) => {
  const data  = await FetchData(`/user/getsuggesteduser?limit=${limit}`);
  return data;
});

const SuggestedUserSlice = createSlice({
  name: "suggesteduser",
  initialState: {
    isFetchingSuggestedUsers: true,
    SuggestedUsers: [],
    
  },
  reducers:{    
    FollowUnfollowSuggestedUser(state,action){
      state.SuggestedUsers.forEach(function(x){
        if(x._id===action.payload){
          x.isFollowing = !x.isFollowing;
        }
      })
    }
  },
  extraReducers: {
    [getSuggestedUser.fulfilled]: (state, action) => {
      state.isFetchingSuggestedUsers = false;      
      state.SuggestedUsers = action.payload.users;
    },
  },
});

export const {
  FollowUnfollowSuggestedUser
} = SuggestedUserSlice.actions;

export default SuggestedUserSlice.reducer;