import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchData } from "../utils/connect";

export const FetchsuggestedTopic = createAsyncThunk("user/suggestedtopic", async ({currIndex2}) => {
  const data  = await FetchData(`/user/getsuggestedtopic?currIndex=${currIndex2}`);
  return data;
});

const suggestedTopicSlice = createSlice({
  name: "suggestedtopic",
  initialState: {
    isfetchingsuggestedtopic: true,
    suggestedtopics: [],
    currIndex2:0,    
  },
  reducers:{    
    FollowUnfollowSuggestedTopic(state,action){
      state.suggestedtopics.forEach(function(x){
        if(x.name===action.payload){
          x.isFollowing = !x.isFollowing;
        }
      })
    }
  },
  extraReducers: {
    [FetchsuggestedTopic.fulfilled]: (state, action) => {
      state.isfetchingsuggestedtopic = action.payload.topics.length!==0;     
      state.currIndex2 = state.currIndex2 + action.payload.topics.length; 
      state.suggestedtopics = [...state.suggestedtopics,...action.payload.topics];
    },
  },
});

export const {
  FollowUnfollowSuggestedTopic
} = suggestedTopicSlice.actions;

export default suggestedTopicSlice.reducer;