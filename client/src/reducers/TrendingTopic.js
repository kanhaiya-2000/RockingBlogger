import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchTrendingTopic = createAsyncThunk("user/Trendingtopic", async () => {
  const data  = await FetchData(`/user/getsuggestedtopic?trending=true`);
  return data;
});

const TrendingTopicSlice = createSlice({
  name: "trendingtopic",
  initialState: {
    isfetchingtrendingtopic: true,
    Trendingtopics: [],    
  },
  reducers:{    
    FollowUnfollowTrendingTopic(state,action){
      state.Trendingtopics.forEach(function(x){
        if(x._id===action.payload){
          x.isFollowing = !x.isFollowing;
        }
      })
    }
  },
  extraReducers: {
    [FetchTrendingTopic.fulfilled]: (state, action) => {
      state.isfetchingtrendingtopic = false;        
      state.Trendingtopics = action.payload.topics;
    },
  },
});

export const {
  FollowUnfollowTrendingTopic
} = TrendingTopicSlice.actions;

export default TrendingTopicSlice.reducer;